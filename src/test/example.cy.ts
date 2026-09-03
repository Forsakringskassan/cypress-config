it("should mount component", () => {
    cy.mount({
        template: /* HTML */ ` <p>lorem ipsum</p> `,
    });
    cy.get("p").should("have.text", "lorem ipsum");
});
