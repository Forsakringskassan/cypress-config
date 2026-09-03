/**
 * Configure plugins.
 *
 * @public
 * @since v1.1.0
 */
export function configure(options: {
    afterEach: {
        htmlvalidate: boolean;
    };
}): void {
    if (options.afterEach.htmlvalidate) {
        afterEach(() => {
            cy.htmlvalidate();
        });
    }
}
