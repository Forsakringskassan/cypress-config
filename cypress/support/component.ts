import { configure } from "@forsakringskassan/cypress-config/support";
import { mount } from "cypress/vue";

configure({
    afterEach: {
        htmlvalidate: true,
    },
});

declare global {
    /* eslint-disable-next-line @typescript-eslint/no-namespace -- module augmentation */
    namespace Cypress {
        interface Chainable {
            mount: typeof mount;
        }
    }
}

Cypress.Commands.add("mount", mount);
