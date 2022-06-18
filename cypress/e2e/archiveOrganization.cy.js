/// <reference types="Cypress" />

import { archive } from "../page_objects/archive";
import { login } from "../page_objects/login";
import { createOrganization } from "../page_objects/createOrganization";

describe("Archive organization test", () => {
  let orgId;
  beforeEach("visit my organizations page", () => {
    cy.visit("/login");
    login.login("ninasamsung2001@gmail.com", "test123456");
    cy.wait(3000);
    cy.visit("/my-organizations");
    cy.url().should("include", "/my-organizations");
  });

  it("archive organization", () => {
    cy.intercept({
      method: "POST",
      url: "https://cypress-api.vivifyscrum-stage.com/api/v2/organizations",
    }).as("create");

    createOrganization.create("Nina");

    cy.wait("@create").then((interception) => {
      orgId = interception.response.body.id;
      expect(interception.response.statusCode).eq(201);

      it("archive organization", () => {
        cy.intercept({
          method: "PUT",
          url: `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${orgId}/status`,
        }).as("archive");

        cy.get(".vs-c-icon--archive")
          .first()
          .invoke("show")
          .click({ force: true });
        cy.get(".vs-u-text--right > button").last().click();

        cy.wait("@archive").then((interception) => {
          expect(interception.response.statusCode).eq(200);
        });
      });
    });
  });
});
