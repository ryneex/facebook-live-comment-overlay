import { config as baseConfig } from "@repo/config/prettier"
import type { Config } from "prettier"

const config: Config = {
  ...baseConfig,
  plugins: ["prettier-plugin-tailwindcss"],
}

export default config
