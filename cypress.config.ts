import {
    defineConfig,
    htmlValidatePlugin,
} from "@forsakringskassan/cypress-config";

export default defineConfig({
    component: {
        async setupNodeEvents(on, config) {
            config = await htmlValidatePlugin(on, config);
            return config;
        },
    },
});
