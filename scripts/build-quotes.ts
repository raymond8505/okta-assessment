/**
 * Turns `prior-art/Quotes Exercise Dataset - quotes.csv` into
 * `src/data/quotes.json` ({ id, author, quote, image }) plus a
 * `src/data/credits.json` sidecar carrying Unsplash attribution.
 *
 * Run with `yarn data:quotes`.
 *
 * Two things shape this script, both measured against the live API rather than
 * assumed:
 *
 * 1. The access key is on Unsplash's Demo tier — 50 requests per hour. There are
 *    120 quotes, so one request per quote does not fit in a window. Instead each
 *    quote is mapped to a short visual concept (concepts.json) drawn from a
 *    deliberately small vocabulary, and we issue one request per *unique*
 *    concept, handing different photos from the same 30-result page to quotes
 *    that share a concept. That is ~44 requests, not 120.
 *
 * 2. Unsplash narrows hard as query terms are added: "frozen lake" returns 2681
 *    results, "tangled roots dark forest" returns 0. A concept coming back empty
 *    is a real outcome, so every quote has a fallback chain
 *    (concept -> theme -> "abstract texture").
 *
 * Every response is cached under `.cache/`, so a re-run — or a resume after the
 * hourly quota refills — costs zero requests.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ROOT = join(import.meta.dirname, "..");
const CSV_PATH = join(
  ROOT,
  "prior-art",
  "Quotes Exercise Dataset - quotes.csv",
);
const CONCEPTS_PATH = join(ROOT, "scripts", "concepts.json");
const CACHE_PATH = join(ROOT, ".cache", "unsplash.json");
const OUT_DIR = join(ROOT, "src", "data");

/** Unsplash requires this on attribution links. */
const APP_NAME = "okta-assessment";
const UTM = `utm_source=${APP_NAME}&utm_medium=referral`;

/** Last resort when both a quote's concept and its theme come back empty. */
const LAST_RESORT_QUERY = "abstract texture";

const PER_PAGE = 30;

interface QuoteRow {
  id: number;
  author: string;
  quote: string;
}

interface Concept {
  query: string;
  theme: string;
}

/** Only the fields we actually read. */
interface UnsplashPhoto {
  id: string;
  urls: { regular: string };
  links: { html: string };
  user: { name: string; links: { html: string } };
}

interface UnsplashSearchResponse {
  total: number;
  results: UnsplashPhoto[];
}

interface EnrichedQuote extends QuoteRow {
  image: string;
}

interface Credit {
  photographer: string;
  profile: string;
  photo: string;
}

/** Thrown when the hourly window is spent; the cache is flushed before it escapes. */
class QuotaExhaustedError extends Error {}

/**
 * RFC 4180 parser. 46 of the 120 quotes contain commas and are therefore quoted
 * fields (id 14 is `"Make it work, make it right, make it fast."`), so
 * `split(",")` would silently corrupt more than a third of the dataset.
 * Handles quoted fields and escaped `""`.
 */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (char !== "\r") {
      field += char;
    }
  }

  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows;
}

function readQuotes(): QuoteRow[] {
  const rows = parseCsv(readFileSync(CSV_PATH, "utf8"));
  const [header, ...body] = rows;

  if (header.join(",") !== "id,author,quote") {
    throw new Error(`Unexpected CSV header: ${header.join(",")}`);
  }

  return body
    .filter((row) => row.some((cell) => cell.trim() !== ""))
    .map((row, index) => {
      const [id, author, quote] = row;
      if (row.length !== 3 || !id || !author || !quote) {
        throw new Error(
          `Malformed CSV row ${index + 2}: expected 3 non-empty columns, got ${JSON.stringify(row)}`,
        );
      }
      return { id: Number(id), author, quote };
    });
}

function readConcepts(): Record<string, Concept> {
  return JSON.parse(readFileSync(CONCEPTS_PATH, "utf8")) as Record<
    string,
    Concept
  >;
}

function readCache(): Record<string, UnsplashPhoto[]> {
  try {
    return JSON.parse(readFileSync(CACHE_PATH, "utf8")) as Record<
      string,
      UnsplashPhoto[]
    >;
  } catch {
    return {};
  }
}

function writeCache(cache: Record<string, UnsplashPhoto[]>): void {
  mkdirSync(join(ROOT, ".cache"), { recursive: true });
  writeFileSync(CACHE_PATH, `${JSON.stringify(cache, null, 2)}\n`);
}

async function main(): Promise<void> {
  try {
    process.loadEnvFile();
  } catch {
    // No .env file — fall through to the env-var check below.
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    throw new Error(
      "UNSPLASH_ACCESS_KEY is not set. Copy .env.example to .env and add your key.",
    );
  }

  const quotes = readQuotes();
  const concepts = readConcepts();

  const missing = quotes.filter((q) => !concepts[String(q.id)]);
  if (missing.length > 0) {
    throw new Error(
      `No concept mapped for quote id(s): ${missing.map((q) => q.id).join(", ")}. ` +
        `Add them to scripts/concepts.json.`,
    );
  }

  const cache = readCache();
  let requests = 0;
  let rateRemaining = Number.POSITIVE_INFINITY;

  async function search(query: string): Promise<UnsplashPhoto[]> {
    const cached = cache[query];
    if (cached) return cached;

    if (rateRemaining <= 0) throw new QuotaExhaustedError(query);

    const url = new URL("https://api.unsplash.com/search/photos");
    url.searchParams.set("query", query);
    url.searchParams.set("per_page", String(PER_PAGE));
    url.searchParams.set("content_filter", "high");

    const response = await fetch(url, {
      headers: {
        Authorization: `Client-ID ${accessKey}`,
        "Accept-Version": "v1",
      },
    });
    requests++;

    const remaining = response.headers.get("x-ratelimit-remaining");
    if (remaining !== null) rateRemaining = Number(remaining);

    if (response.status === 401) {
      throw new Error(
        "Unsplash rejected the key (401). Check UNSPLASH_ACCESS_KEY.",
      );
    }
    if (response.status === 403) throw new QuotaExhaustedError(query);
    if (!response.ok) {
      throw new Error(
        `Unsplash returned ${response.status} ${response.statusText} for "${query}".`,
      );
    }

    const body = (await response.json()) as UnsplashSearchResponse;
    cache[query] = body.results;
    console.log(
      `  fetched "${query}" -> ${body.results.length} photos (${rateRemaining} requests left this hour)`,
    );
    return body.results;
  }

  const enriched: EnrichedQuote[] = [];
  const credits: Record<string, Credit> = {};
  const usedPhotoIds = new Set<string>();
  const fellBack: { id: number; from: string; to: string }[] = [];

  try {
    for (const quote of quotes) {
      const concept = concepts[String(quote.id)];
      const chain = [concept.query, concept.theme, LAST_RESORT_QUERY];

      let photo: UnsplashPhoto | undefined;
      let matchedQuery = "";

      for (const query of chain) {
        const photos = await search(query);
        photo = photos.find((candidate) => !usedPhotoIds.has(candidate.id));
        if (photo) {
          matchedQuery = query;
          break;
        }
      }

      if (!photo) {
        throw new Error(
          `Exhausted every query for quote ${quote.id} ("${concept.query}").`,
        );
      }

      if (matchedQuery !== concept.query) {
        fellBack.push({ id: quote.id, from: concept.query, to: matchedQuery });
      }

      usedPhotoIds.add(photo.id);
      enriched.push({ ...quote, image: photo.urls.regular });
      credits[String(quote.id)] = {
        photographer: photo.user.name,
        profile: `${photo.user.links.html}?${UTM}`,
        photo: `${photo.links.html}?${UTM}`,
      };
    }
  } catch (error) {
    writeCache(cache);
    if (error instanceof QuotaExhaustedError) {
      throw new Error(
        `Hourly Unsplash quota exhausted while fetching "${error.message}". ` +
          `${enriched.length}/${quotes.length} quotes were resolved and every response so far is cached — ` +
          `re-run \`yarn data:quotes\` after the window refills and it will pick up where it stopped.`,
      );
    }
    throw error;
  }

  writeCache(cache);
  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(
    join(OUT_DIR, "quotes.json"),
    `${JSON.stringify(enriched, null, 2)}\n`,
  );
  writeFileSync(
    join(OUT_DIR, "credits.json"),
    `${JSON.stringify(credits, null, 2)}\n`,
  );

  console.log(
    `\nWrote ${enriched.length} quotes to src/data/quotes.json ` +
      `(${usedPhotoIds.size} distinct photos, ${requests} API requests).`,
  );

  if (fellBack.length > 0) {
    console.log(`\n${fellBack.length} quote(s) fell back to a broader query:`);
    for (const entry of fellBack) {
      console.log(`  #${entry.id}: "${entry.from}" -> "${entry.to}"`);
    }
  }
}

main().catch((error: unknown) => {
  console.error(`\n${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
});
