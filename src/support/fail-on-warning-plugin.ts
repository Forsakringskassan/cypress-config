import { type Plugin } from "vue";

/**
 * Fails Cypress test if a Vue warning is encountered.
 *
 * @public
 * @since v1.10.0
 */
export function failOnWarningPlugin(): Plugin {
    return {
        install(app) {
            const originalHandler = app.config.warnHandler;
            app.config.warnHandler = (err, vm, info) => {
                if (originalHandler) {
                    originalHandler(err, vm, info);
                }
                assert.fail([err, info].join("\n"));
            };
        },
    };
}
