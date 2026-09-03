import "cypress";
import { init as install } from "@forsakringskassan/cypress-axe/plugins";
import { mergeConfig } from "../utils/merge-config";

const defaultOptions = {
    context: {
        include: [[".code-preview"], ["[data-preview]"], ["[data-cy-root]"]],
        exclude: [
            [".calendar__item--selected"],
            [".file-selector input"],
            [".wizard-step__header__title"],
            [".live-example__code"],
        ],
    },
};

/**
 * Preconfigured `@forsakringskassan/cypress-axe` plugin.
 *
 * @public
 * @since v1.4.0
 * @param on - Cypress `on` callback from `setupNodeEvents`.
 * @param config - Cypress `config` parameter from `setupNodeEvents`.
 * @param userOptions - Custom configuration to pass to `@forsakringskassan/cypress-axe`.
 * @returns A promise resolved with the updated cypress configuration.
 */
export function axePlugin(
    on: Cypress.PluginEvents,
    config: Cypress.PluginConfigOptions,
    userOptions?: object,
): Promise<Cypress.PluginConfigOptions> {
    const options = mergeConfig<object>(defaultOptions, userOptions);
    config = install(on, config, options);
    return Promise.resolve(config);
}
