import { mount as originalMount } from "cypress/vue";
import {
    FormatPlugin,
    TestPlugin,
    TranslationPlugin,
    ValidationPlugin,
    setRunningContext,
} from "@fkui/vue";

/**
 * Wrapper around `mount()` from `cypress/vue` with new defaults.
 *
 * @public
 * @since %version%
 */
export const mount = (
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
    options.global.plugins.push(
        FormatPlugin,
        TestPlugin,
        TranslationPlugin,
        ValidationPlugin,
    );

    /* setup running context  */
    options.global.plugins.push({
        install(app) {
            setRunningContext(app);
        },
    });

    return originalMount(component, options);
};
