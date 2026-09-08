import { type defineConfig as cypressDefineConfig } from "cypress";
import pkg from "cypress/package.json";
import { defaultConfig } from "./default-config";
import { mergeConfig } from "./utils/merge-config";

/**
 * @public
 */
export type ConfigOptions = Parameters<typeof cypressDefineConfig>[0];

const cypressMajor = pkg.version.split(".", 2).at(0);

/**
 * @public
 * @since v1.1.0
 * @param _rootDir - path to the root directory (containing the `cypress.config.ts` file).
 */
export function defineConfig(
    _rootDir: string,
    userConfig?: Omit<ConfigOptions, "component"> & {
        component?: Partial<ConfigOptions["component"]>;
    },
): Readonly<ConfigOptions> {
    return mergeConfig<ConfigOptions>(
        defaultConfig(cypressMajor),
        userConfig as ConfigOptions,
    );
}
