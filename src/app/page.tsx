import { ThemeToggle } from "@/components/theme-toggle/ThemeToggle";

/**
 * Intentionally near-blank — the assessment UI gets built on top of this
 * scaffold. The only markup is the theme toggle, so the theming system is
 * reachable and verifiable in the running app; move or remove it freely.
 *
 * Server Component. Keep it that way unless something here needs browser-only
 * APIs — ThemeToggle carries its own "use client" boundary.
 */
export default function HomePage() {
  return (
    <main>
      <ThemeToggle />
    </main>
  );
}
