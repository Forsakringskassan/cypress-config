describe("component-index.html", () => {
    it("should have teleport target", () => {
        cy.get("#teleport").should("exist");
    });
});
