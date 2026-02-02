import { config } from "@repo/config/eslint-base"
import { defineConfig, globalIgnores } from "eslint/config"

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
  globalIgnores(["dist/**", "out/**"]),
])
