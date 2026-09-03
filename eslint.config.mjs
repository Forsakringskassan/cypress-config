import defaultConfig from "@forsakringskassan/eslint-config";
import cliConfig from "@forsakringskassan/eslint-config-cli";
import cypressConfig from "@forsakringskassan/eslint-config-cypress";
import typescriptConfig from "@forsakringskassan/eslint-config-typescript";
import typeinfoConfig from "@forsakringskassan/eslint-config-typescript-typeinfo";
import pkg from "./package.json" with { type: "json" };

export default [
    {
        name: "Ignored files",
        ignores: [
            "**/coverage/**",
            "**/dist/**",
            "**/node_modules/**",
            "**/temp/**",
        ],
    },

    ...defaultConfig,

    cliConfig(pkg),
    cypressConfig(),
    typescriptConfig(),
    typeinfoConfig(import.meta.dirname),
];
