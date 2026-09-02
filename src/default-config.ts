import { createRequire } from "node:module";
import { type defineConfig } from "cypress";

type ConfigOptions = Parameters<typeof defineConfig>[0];

const require = createRequire(import.meta.url);

const isGithub = Boolean(process.env["GITHUB_ACTION"]);

/**
 * Default cypress configuration.
 *
 * @public
 * @since v1.1.0
 */
export const defaultConfig = Object.freeze({
    allowCypressEnv: false,

    /* disable video recording, it is to slow both on remote machines and on
     * CI/CD testing. */
    video: false,

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
