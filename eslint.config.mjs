import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
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
];

export default config;
