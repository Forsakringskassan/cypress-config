import "@forsakringskassan/cypress-axe/support";
import { type mount as cypressMount } from "cypress/vue";
import "cypress-html-validate/commands";

declare global {
    /* eslint-disable-next-line @typescript-eslint/no-namespace -- module augmentation */
    namespace Cypress {
        interface Chainable {
            mount: typeof cypressMount;
        }
    }
}
