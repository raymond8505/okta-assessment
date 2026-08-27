/**
 * Joins class names, dropping anything falsy.
 *
 * Deliberately not `clsx`/`classnames` — the grid needs exactly this and
 * nothing else, and it keeps the dependency surface of the scaffold minimal.
 */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
