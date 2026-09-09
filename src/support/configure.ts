import {
    type UseEmulatedMedia,
    useEmulatedMedia,
} from "../utils/use-emulated-media";

function resetEmulatedMedia(emulatedMedia: UseEmulatedMedia): void {
    if (!emulatedMedia.isEnabled()) {
        return;
    }
    emulatedMedia.reset();
    const event = "remote:debugger:protocol";
    cy.wrap(Cypress.automation(event, emulatedMedia.cdp()), {
        log: false,
    });
}

/**
 * Configure plugins.
 *
 * @public
 * @since v1.1.0
 */
export function configure(options: {
    /** When enabled, any emulated CSS media features will be reset between runs */
    resetEmulatedMedia: boolean;

    afterEach: {
        htmlvalidate: boolean;
    };
}): void {
    if (options.afterEach.htmlvalidate) {
        afterEach(() => {
            cy.htmlvalidate();
        });
    }

    if (options.resetEmulatedMedia) {
        const emulatedMedia = useEmulatedMedia();
        afterEach(() => {
            resetEmulatedMedia(emulatedMedia);
        });
        beforeEach(() => {
            resetEmulatedMedia(emulatedMedia);
        });
    }
}
