/* eslint-disable sonarjs/no-debug-commands-in-ui-tests -- want to pause for the developer to see the results */

import { defineComponent } from "vue";

const TestComponent = defineComponent({
    template: /* HTML */ `
        <h1>Emulated media test</h1>
        <div class="box">
            <p data-prefers-color-scheme="light">
                In light mode this page should have a light background with dark
                colored text.
            </p>
            <p data-prefers-color-scheme="dark">
                In dark mode this page should have a dark background with light
                colored text.
            </p>
            <dl>
                <dt><code>prefers-color-scheme</code></dt>
                <dd data-prefers-color-scheme="light">light</dd>
                <dd data-prefers-color-scheme="dark">dark</dd>
                <dt><code>forced-colors</code></dt>
                <dd data-forced-colors="active">active</dd>
                <dd data-forced-colors="none">none</dd>
            </dl>
        </div>
    `,
});

it("light mode", () => {
    cy.mount(TestComponent);
    cy.prefersColorScheme("light");
    cy.get("dd[data-prefers-color-scheme=light]").should("be.visible");
    cy.get("dd[data-prefers-color-scheme=dark]").should("not.be.visible");
    cy.get("dd[data-forced-colors=active]").should("not.be.visible");
    cy.get("dd[data-forced-colors=none]").should("be.visible");
    cy.pause();
});

it("light + forced mode", () => {
    cy.mount(TestComponent);
    cy.prefersColorScheme("light");
    cy.forcedColors("active");
    cy.get("dd[data-prefers-color-scheme=light]").should("be.visible");
    cy.get("dd[data-prefers-color-scheme=dark]").should("not.be.visible");
    cy.get("dd[data-forced-colors=active]").should("be.visible");
    cy.get("dd[data-forced-colors=none]").should("not.be.visible");
    cy.pause();
});

it("dark mode", () => {
    cy.mount(TestComponent);
    cy.prefersColorScheme("dark");
    cy.get("dd[data-prefers-color-scheme=light]").should("not.be.visible");
    cy.get("dd[data-prefers-color-scheme=dark]").should("be.visible");
    cy.get("dd[data-forced-colors=active]").should("not.be.visible");
    cy.get("dd[data-forced-colors=none]").should("be.visible");
    cy.pause();
});

it("dark + forced mode", () => {
    cy.mount(TestComponent);
    cy.prefersColorScheme("dark");
    cy.forcedColors("active");
    cy.get("dd[data-prefers-color-scheme=light]").should("not.be.visible");
    cy.get("dd[data-prefers-color-scheme=dark]").should("be.visible");
    cy.get("dd[data-forced-colors=active]").should("be.visible");
    cy.get("dd[data-forced-colors=none]").should("not.be.visible");
    cy.pause();
});

it("none", () => {
    cy.mount(TestComponent);
    cy.get("dd[data-prefers-color-scheme=light]").should("be.visible");
    cy.get("dd[data-prefers-color-scheme=dark]").should("not.be.visible");
    cy.get("dd[data-forced-colors=active]").should("not.be.visible");
    cy.get("dd[data-forced-colors=none]").should("be.visible");
    cy.pause();
});
