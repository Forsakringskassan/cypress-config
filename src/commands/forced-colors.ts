import { useEmulatedMedia } from "../utils/use-emulated-media";

/** module augmentation:support.d.ts */
declare global {
    /* eslint-disable-next-line @typescript-eslint/no-namespace -- module augmentation */
    namespace Cypress {
        interface Chainable {
            /**
             * Emulate CSS media feature `forced-colors`.
             *
             * @example
             * ```ts
             * cy.forcedColors("active");
             * ```
             *
             * @since %version%
             * @param mode - "active" to enable, "none" to disable.
             */
            forcedColors(mode: "none" | "active"): Cypress.Chainable<void>;
        }
    }
}

const emulatedMedia = useEmulatedMedia();

/* eslint-disable-next-line unicorn/no-top-level-side-effects -- cypress commands are added as side-effects */
Cypress.Commands.add("forcedColors", (mode) => {
    emulatedMedia.forcedColors(mode);
    const event = "remote:debugger:protocol";
    cy.wrap(Cypress.automation(event, emulatedMedia.cdp()), { log: false });
});

export {};
