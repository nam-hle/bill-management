import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import reactPlugin from "eslint-plugin-react";
import functional from "eslint-plugin-functional";
import stylistic from "@stylistic/eslint-plugin-ts";
import perfectionist from "eslint-plugin-perfectionist";
import unusedImports from "eslint-plugin-unused-imports";
import reactHooksPlugin from "eslint-plugin-react-hooks";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname
});

/** @type { import("eslint").Linter.Config[] } */

const eslintConfig = [
	...compat.extends("next/core-web-vitals", "next/typescript"),
	{
		settings: {
			react: {
				version: "detect"
			}
		},
		plugins: {
			stylistic,
			functional,
			perfectionist,

			unusedImports: unusedImports,
			...reactPlugin.configs.flat.recommended.plugins,
			"react-hooks": reactHooksPlugin
		},
		rules: {
			...reactPlugin.configs.flat.recommended.rules,
			...reactHooksPlugin.configs.recommended.rules,
			"react/jsx-boolean-value": "error",
			"react-hooks/exhaustive-deps": "error",
			"react/jsx-curly-brace-presence": ["error", "never"],

			"sort-keys": "off",
			"max-params": "error",
			"@typescript-eslint/no-namespace": "off",
			"unusedImports/no-unused-imports": "error",
			"@typescript-eslint/no-explicit-any": "warn",
			"@typescript-eslint/no-empty-object-type": "off",
			"@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports", fixStyle: "inline-type-imports" }],
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
					ignoreRestSiblings: true,
					destructuredArrayIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^error$"
				}
			],

			"perfectionist/sort-jsx-props": ["error", { type: "line-length" }],
			"perfectionist/sort-named-imports": ["error", { type: "line-length" }],
			"perfectionist/sort-objects": ["error", { type: "line-length", partitionByNewLine: true }],
			"perfectionist/sort-exports": ["error", { type: "line-length", partitionByNewLine: true }],
			"perfectionist/sort-interfaces": ["error", { type: "line-length", partitionByNewLine: true }],
			"perfectionist/sort-object-types": ["error", { type: "line-length", partitionByNewLine: true }],
			"perfectionist/sort-imports": [
				"error",
				{
					type: "line-length",
					customGroups: { value: { project: ["@\/.*"] } },
					groups: ["side-effect", "builtin", "external", "project", ["parent", "sibling", "index"]]
				}
			],

			"stylistic/padding-line-between-statements": [
				"error",
				{
					prev: "*",
					blankLine: "always",
					next: ["if", "while", "for", "switch", "try", "do", "return"]
				},
				{ next: "*", prev: "block-like", blankLine: "always" }
			]
		}
	}
];

export default eslintConfig;
