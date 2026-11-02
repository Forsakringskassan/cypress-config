import "cypress";
import { init as install } from "@forsakringskassan/cypress-axe/plugins";
import { getApplicationSelector } from "@forsakringskassan/get-application-slug";

import { mergeConfig } from "../utils/merge-config";
import { type PackageJson } from "../utils/package-json";

const defaultOptions = (pkg?: PackageJson): object => {
    const options = {
        context: {
            include: [
                [".code-preview"],
                ["[data-preview]"],
                ["[data-cy-root]"],
            ],
            exclude: [
                [".calendar__item--selected"],
                [".file-selector input"],
                [".wizard-step__header__title"],
                [".live-example__code"],
            ],
        },
    };

    if (pkg) {
        options.context.include.push([getApplicationSelector(pkg.name)]);
    }

    return options;
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
    const pkg = config.pkg;
    const options = mergeConfig<object>(defaultOptions(pkg), userOptions);
    const updatedConfig = install(on, config, options);

    return Promise.resolve(updatedConfig);
}
