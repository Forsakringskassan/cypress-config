import { createRequire } from "node:module";
import { type defineConfig } from "cypress";

type ConfigOptions = Parameters<typeof defineConfig>[0];

const require = createRequire(import.meta.url);

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

    component: {
        devServer: {
            framework: "vue",
            bundler: "vite",
        },
        indexHtmlFile: require.resolve("#assets/component-index.html"),
    },
} satisfies ConfigOptions);
