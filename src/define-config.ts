import { type defineConfig as cypressDefineConfig } from "cypress";
import { defaultConfig } from "./default-config";
import { mergeConfig } from "./utils/merge-config";

/**
 * @public
 */
export type ConfigOptions = Parameters<typeof cypressDefineConfig>[0];

/**
 * @public
 * @since %version%
 */
export function defineConfig(
    userConfig?: Omit<ConfigOptions, "component"> & {
        component?: Partial<ConfigOptions["component"]>;
    },
): Readonly<ConfigOptions> {
    return mergeConfig<ConfigOptions>(
        defaultConfig,
        userConfig as ConfigOptions,
    );
}
