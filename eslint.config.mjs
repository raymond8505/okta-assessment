import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import eslintConfigPrettier from "eslint-config-prettier/flat";
import tseslint from "typescript-eslint";

// `eslint-config-next/core-web-vitals` is already a flat-config array bundling the
// `next`, `next/typescript` and `next/core-web-vitals` blocks plus Next's own ignores.
const config = [
  {
    ignores: [
      ".next/**",
      "public/storybook/**",
      "storybook-static/**",
      "node_modules/**",
      "next-env.d.ts",
    ],
  },
  ...nextCoreWebVitals,
  ...tseslint.configs.recommended,

  // Must stay last — it only switches rules off. Nothing above it ships
  // formatting rules today, so this currently disables nothing; it is here so
  // that a future config addition can't start fighting `yarn format`.
  // (`/flat` over the bare entry point only adds a `name` for config-inspector.)
  eslintConfigPrettier,
];

export default config;
