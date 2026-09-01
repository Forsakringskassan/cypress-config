import { createRequire } from "node:module";
import "cypress";
import {
    type ConfigData,
    type CypressHtmlValidateOptions,
} from "cypress-html-validate";
import { install } from "cypress-html-validate/plugin";
import { mergeConfig } from "../utils/merge-config";

const require = createRequire(import.meta.url);

let exclude: string[] = [];
try {
    exclude = require("@fkui/vue/htmlvalidate/cypress") as string[];
} catch {
    /* do nothing */
}

const htmlValidateConfig = (): ConfigData => {
    return {
        rules: {
            /* some examples show how to use custom heading levels which often
             * doesn't match the heading outline for the documentation */
            "heading-level": ["off"],

            /* prevents mismatches from disabled rules which does not trigger errors
             * when Cypress tests are running but would yield errors during normal
             * validation */
            "no-unused-disable": "off",

            /* we cannot use native progressbar element due to SLA */
            "prefer-native-element": [
                "error",
                {
                    exclude: ["progressbar"],
                },
            ],

            /* sadly we dont use SRI at FK */
            "require-sri": "off",
        },
    };
};

const htmlValidateOptions = (): CypressHtmlValidateOptions => {
    return {
        include: [
            /* Cypress component tests */
            "#__cy_vue_root > div",
            /* @forsakringskassan/docs-generator examples */
            ".code-preview__preview",
            /* @forsakringskassan/docs-live-example examples */
            ".live-example__example",
        ],
        exclude,
    };
};

/**
 * Preconfigured `cypress-html-validate` plugin.
 *
 * @public
 * @since %version%
 * @param on - Cypress `on` callback from `setupNodeEvents`.
 * @param cypressConfig - Cypress `config` parameter from `setupNodeEvents`.
 * @param userConfig - Custom configuration to pass to `html-validate`.
 * @param userOptions - Custom options to pass to `cypress-html-validate`.
 * @returns A promise resolved with the updated cypress configuration.
 */
export function htmlValidatePlugin(
    on: Cypress.PluginEvents,
    cypressConfig: Cypress.PluginConfigOptions,
    userConfig?: ConfigData,
    userOptions?: CypressHtmlValidateOptions,
): Promise<Cypress.PluginConfigOptions> {
    const config = mergeConfig(htmlValidateConfig(), userConfig);
    const options = mergeConfig(htmlValidateOptions(), userOptions);
    install(on, config, options);
    return Promise.resolve(cypressConfig);
}
