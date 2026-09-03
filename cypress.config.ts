import {
    axePlugin,
    defineConfig,
    htmlValidatePlugin,
} from "@forsakringskassan/cypress-config";

export default defineConfig(import.meta.dirname, {
    component: {
        async setupNodeEvents(on, config) {
            config = await axePlugin(on, config);
            config = await htmlValidatePlugin(on, config);
            return config;
        },
    },
});
