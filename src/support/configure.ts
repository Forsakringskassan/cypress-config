/**
 * Configure plugins.
 *
 * @public
 * @since %version%
 */
export function configure(options: {
    afterEach: { htmlvalidate: boolean };
}): void {
    if (options.afterEach.htmlvalidate) {
        afterEach(() => {
            cy.htmlvalidate();
        });
    }
}
