import { readFileSync } from "node:fs";
import { join } from "node:path";
import { type defineConfig as cypressDefineConfig } from "cypress";
import pkg from "cypress/package.json" with { type: "json" };
import { defaultConfig } from "./default-config";
import { mergeConfig } from "./utils/merge-config";
import { type PackageJson } from "./utils/package-json";

declare global {
    /* eslint-disable-next-line @typescript-eslint/no-namespace -- Cypress exposes its types in a global namespace. */
    namespace Cypress {
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars -- Must match Cypress's generic interface declaration. */
        interface ResolvedConfigOptions<ComponentDevServerOpts = any> {
            pkg?: PackageJson;
        }
    }
}

/**
 * @public
 */
export type ConfigOptions = Parameters<typeof cypressDefineConfig>[0];

const cypressMajor = pkg.version.split(".", 2).at(0);

/**
 * @public
 * @since v1.1.0
 * @param rootDir - path to the root directory (containing the `cypress.config.ts` file).
 */
export function defineConfig(
    rootDir: string,
    userConfig?: Omit<ConfigOptions, "component"> & {
        component?: Partial<ConfigOptions["component"]>;
    },
): Readonly<ConfigOptions> {
    const packageJsonPath = join(rootDir, "package.json");
    const content = readFileSync(packageJsonPath, "utf8");
    const packageJson = JSON.parse(content) as PackageJson;

    return mergeConfig<ConfigOptions>(
        defaultConfig(cypressMajor, packageJson),
        userConfig as ConfigOptions,
    );
}
