import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginReact from "eslint-plugin-react";
import { config as baseConfig } from "./eslint-base.ts";
import { defineConfig } from "eslint/config";

export const config = defineConfig([
  ...baseConfig,
  pluginReact.configs.flat.recommended!,
  {
    languageOptions: {
      ...pluginReact.configs.flat.recommended?.languageOptions,
    },
  },
  {
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    settings: { react: { version: "detect" } },
    rules: {
      ...pluginReactHooks.configs.recommended.rules,
      // React scope no longer necessary with new JSX transform.
      "react/react-in-jsx-scope": "off",
    },
  },
]);
