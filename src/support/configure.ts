import type * as FkuiVue from "@fkui/vue";
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
export async function configure(options: {
    fkuiVue?: typeof FkuiVue;

    /** When enabled, any emulated CSS media features will be reset between runs */
    resetEmulatedMedia: boolean;

    afterEach: {
        htmlvalidate: boolean;
    };
}): Promise<void> {
    const { config } = options.fkuiVue ?? (await import("@fkui/vue"));

    /* When running component tests, configure FKUI to use the default teleport
     * target from `assets/component-index.ts`. When running E2E we assume the
     * application has configured this itself. */
    if (Cypress.testingType === "component") {
        config.teleportTarget = "#teleport";
    }

    if (options.afterEach.htmlvalidate) {
        afterEach(() => {
            cy.htmlvalidate();
        });
    }

    /* eslint-disable-next-line unicorn/prefer-early-return -- for consistency with other options */
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
