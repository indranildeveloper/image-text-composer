import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import pluginReact from "eslint-plugin-react";
import prettierPlugin from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";
import typescriptParser from "@typescript-eslint/parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  { files: ["**/*.{js,ts,jsx,tsx}"] },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parser: typescriptParser,
      parserOptions: {
        project: true,
      },
    },
    plugins: {
      prettier: prettierPlugin,
    },
  },
  eslintConfigPrettier,
  pluginJs.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  pluginReact.configs.flat.recommended,
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
    },
  },
  {
    ignores: [
      ".next/",
      "node_modules",
      "coverage",
      "build",
      "*.config.mjs",
      "convex",
      "src/db/prisma/**",
    ],
  },
];

export default eslintConfig;
