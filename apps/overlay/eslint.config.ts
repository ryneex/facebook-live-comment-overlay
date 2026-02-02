import { config } from "@repo/config/eslint-base"
import { defineConfig } from "eslint/config"

export default defineConfig([
  ...config,
  {
    languageOptions: {
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
