import { createRequire } from "node:module";
import { type defineConfig } from "cypress";

type ConfigOptions = Parameters<typeof defineConfig>[0];

const require = createRequire(import.meta.url);
const isGithub = Boolean(process.env["GITHUB_ACTION"]);

/**
 * Version specific configuration for Cypress major versions.
 */
const versionConfig = Object.freeze({
    "15": {
        /* @ts-expect-error until we drop support for cypress 15 we still want to set this option (removed in cypress 16 and later) */
        allowCypressEnv: false as const,
    },
} satisfies Record<string, ConfigOptions | undefined>);

function hasVersionConfig(
    key: string | undefined,
): key is keyof typeof versionConfig {
    return Boolean(key && Object.hasOwn(versionConfig, key));
}

/**
 * Default cypress configuration.
 *
 * @public
 * @since v1.1.0
 */
/* eslint-disable-next-line @typescript-eslint/explicit-function-return-type -- we want implicit typing on this function */
export function defaultConfig(cypressMajor: string | undefined) {
    return Object.freeze({
        ...(hasVersionConfig(cypressMajor) && versionConfig[cypressMajor]),

        /* disable video recording, it is to slow both on remote machines and on
         * CI/CD testing. */
        video: false,

        /* use chrome instead of electron as default browser */
        defaultBrowser: "chrome",

        /* reporter configuration */
        reporter: require.resolve("mocha-multi-reporters"),
        reporterOptions: {
            reporterEnabled: isGithub
                ? "spec, github-actions, mocha-junit-reporter"
                : "spec, mocha-junit-reporter",
            mochaJunitReporterReporterOptions: {
                mochaFile: "test-results/cypress-test-output_[hash].xml",
            },
        },

        component: {
            devServer: {
                framework: "vue",
                bundler: "vite",
            },
            indexHtmlFile: require.resolve("#assets/component-index.html"),
        },
    } satisfies ConfigOptions);
}
