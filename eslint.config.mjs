import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import perfectionist from "eslint-plugin-perfectionist";
import unusedImports from "eslint-plugin-unused-imports";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type { import("eslint").Linter.Config[] } */

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    plugins: { perfectionist, "unused-imports": unusedImports },
    rules: {
      "max-params": "error",
      "unused-imports/no-unused-imports": "error",
      "react/jsx-boolean-value": "error",
      "react/jsx-curly-brace-presence": ["error", "never"],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "perfectionist/sort-interfaces": [
        "error",
        {
          type: "line-length",
          partitionByNewLine: true,
          partitionByComment: false,
        },
      ],
      "perfectionist/sort-exports": [
        "error",
        {
          type: "line-length",
          partitionByNewLine: true,
          partitionByComment: false,
        },
      ],
      "perfectionist/sort-imports": [
        "error",
        {
          type: "line-length",
          groups: [
            "side-effect",
            "builtin",
            "external",
            "a12",
            ["parent", "sibling", "index"],
          ],
          customGroups: {
            value: {
              a12: ["@com.mgmtp.a12*/**"],
            },
          },
        },
      ],
      "perfectionist/sort-jsx-props": ["error", { type: "line-length" }],
      "perfectionist/sort-named-imports": ["error", { type: "line-length" }],
    },
  },
];

export default eslintConfig;
