import { mount as originalMount } from "cypress/vue";
import type * as FkuiVue from "@fkui/vue";
import { failOnWarningPlugin } from "./fail-on-warning-plugin";

/** @public */
export type MountFn = (
    component: Parameters<typeof originalMount>[0],
    options?: NonNullable<Parameters<typeof originalMount>[1]>,
) => ReturnType<typeof originalMount>;

/**
 * Create a wrapper around `mount()` from `cypress/vue` with new defaults.
 *
 * @example
 *
 * ```ts
 * import { createMount } from "@forsakringskassan/cypress-config/support";
 *
 * const mount = await createMount();
 *
 * Cypress.Commands.add("mount", mount);
 * ```
 *
 * @remarks When passing in a custom `fkuiVue` module a default static copy will
 * still be imported (but largely unused), this is due to how Cypress bundles
 * the files (including dynamic imports). Any global side-effects will run for
 * both!
 *
 * @public
 * @since v1.9.0
 */
export async function createMount(options?: {
    fkuiVue?: typeof FkuiVue;
    failOnWarning?: boolean;
}): Promise<MountFn> {
    const { fkuiVue = await import("@fkui/vue"), failOnWarning = true } =
        options ?? {};
    const {
        FormatPlugin,
        TestPlugin,
        TranslationPlugin,
        ValidationPlugin,
        setRunningContext,
    } = fkuiVue;
    const plugins = [
        FormatPlugin,
        TestPlugin,
        TranslationPlugin,
        ValidationPlugin,
    ];
    return (
        component: Parameters<typeof originalMount>[0],
        options?: NonNullable<Parameters<typeof originalMount>[1]>,
    ): ReturnType<typeof originalMount> => {
        options ??= {};
        options.global ??= {};
        options.global.plugins ??= [];
        options.global.config ??= {};
        options.global.config.compilerOptions ??= {};
        options.global.config.compilerOptions.whitespace = "preserve";

        /* default plugins */
        options.global.plugins.push(...plugins);

        /* setup running context  */
        options.global.plugins.push({
            install(app) {
                setRunningContext(app);
            },
        });

        /* handle warnings as errors */
        if (failOnWarning) {
            options.global.plugins.push(failOnWarningPlugin());
        }

        return originalMount(component, options);
    };
}

/**
 * Wrapper around `mount()` from `cypress/vue` with new defaults.
 *
 * If you need to customize the `mount()` behaviour use `createMount()`.
 *
 * @example
 *
 * ```ts
 * import { mount } from "@forsakringskassan/cypress-config/support";
 *
 * Cypress.Commands.add("mount", mount);
 * ```
 *
 * @public
 * @since v1.7.0
 */
export const mount = await createMount();
