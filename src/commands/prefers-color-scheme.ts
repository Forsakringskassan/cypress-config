import { useEmulatedMedia } from "../utils/use-emulated-media";

/** module augmentation:support.d.ts */
declare global {
    /* eslint-disable-next-line @typescript-eslint/no-namespace -- module augmentation */
    namespace Cypress {
        interface Chainable {
            /**
             * Emulate CSS media feature `prefers-color-scheme`.
             *
             * @example
             * ```ts
             * cy.prefersColorScheme("dark");
             * ```
             *
             * @since %version%
             * @param value - "light" or "dark" color mode, "none" will disable.
             */
            prefersColorScheme(
                value: "none" | "dark" | "light",
            ): Cypress.Chainable<void>;
        }
    }
}

const emulatedMedia = useEmulatedMedia();

/* eslint-disable-next-line unicorn/no-top-level-side-effects -- cypress commands are added as side-effects */
Cypress.Commands.add("prefersColorScheme", (value) => {
    emulatedMedia.prefersColorScheme(value);
    const event = "remote:debugger:protocol";
    cy.wrap(Cypress.automation(event, emulatedMedia.cdp()), { log: false });
});

export {};
