describe("Navigation", () => {
  it("should navigate to Tuesday", () => {
    cy.visit("/");
    cy.contains("[data-testid=day]", "Tuesday")
      .click()
      .should("have.a", "day-list__item--selected");
  });
});


