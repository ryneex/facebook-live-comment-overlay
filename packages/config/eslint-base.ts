import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export const config = defineConfig([
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-namespace": ["off"],
    },
  },
]);
