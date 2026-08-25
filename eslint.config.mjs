import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    // Features are vertical slices with a public surface. Everything outside a
    // feature imports it through `@/features/<name>`; reaching past the barrel
    // couples callers to internals that are free to change.
    files: [
      "src/app/**",
      "src/lib/**",
      "src/components/**",
      "src/routes.ts",
      "src/middleware.ts",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              // `routes` is the one exception: it is pure, and middleware
              // needs it without the server-only code behind the barrel.
              group: ["@/features/*/*", "!@/features/*/routes"],
              message:
                "Import from the feature's public API (@/features/<name>) instead of reaching into its internals.",
            },
          ],
        },
      ],
    },
  },

  {
    // Features may not import each other's internals either, and shared code
    // must not depend on a feature.
    files: ["src/features/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*/*"],
              message:
                "Cross-feature imports go through the public API (@/features/<name>).",
            },
          ],
        },
      ],
    },
  },

  {
    files: ["src/lib/**"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/*", "@/features/*/*"],
              message:
                "src/lib is shared infrastructure and must not depend on a feature.",
            },
          ],
        },
      ],
    },
  },

  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
