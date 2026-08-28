/**
 * These are all Prettier's own defaults, written out on purpose: the codebase
 * already formatted this way by hand before Prettier arrived, so adopting the
 * defaults made the initial sweep almost pure whitespace. Spelling them out
 * means a future default change in Prettier can't silently reformat the repo.
 *
 * @type {import("prettier").Config}
 */
const config = {
  printWidth: 80,
  semi: true,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "all",
};

export default config;
