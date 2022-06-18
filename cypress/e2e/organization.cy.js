/// <reference types="Cypress" />

import { login } from "../page_objects/login";
import { createOrganization } from "../page_objects/createOrganization";
import { edit } from "../page_objects/edit";
const faker = require("faker");

describe("Login test", () => {
  let loginData = {
    email: "ninasamsung2001@gmail.com",
    password: "test123456",
  };
  let organizationData = {
    name: faker.name.firstName(),
    newName: "new Name",
  };
  let orgId;

  beforeEach("visit login page", () => {
    cy.visit("/login");
    cy.url().should("include", "/login");
  });

  it.skip("valid login", () => {
    cy.intercept({
      method: "POST",
      url: "https://cypress-api.vivifyscrum-stage.com/api/v2/login",
    }).as("login");

    login.login(loginData.email, loginData.password);

    cy.wait("@login").then((interception) => {
      expect(interception.response.statusCode).eq(200);
      cy.url().should("not.include", "/login");
    });
  });

  it("create organization without image", () => {
    cy.intercept({
      method: "POST",
      url: "https://cypress-api.vivifyscrum-stage.com/api/v2/organizations",
    }).as("create");
    login.login(loginData.email, loginData.password);
    cy.wait(3000);
    cy.visit("/my-organizations");
    cy.url().should("include", "/my-organizations");
    createOrganization.create(organizationData.name);

    cy.wait("@create").then((interception) => {
      orgId = interception.response.body.id;
      expect(interception.response.statusCode).eq(201);
    });
  });

  it("edit organization", () => {
    cy.intercept({
      method: "GET",
      url: `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${orgId}/vacation-days`,
    }).as("editPage");

    login.login(loginData.email, loginData.password);
    cy.wait(3000);
    cy.visit(
      `https://cypress.vivifyscrum-stage.com/organizations/${orgId}/settings`
    );

    cy.wait("@editPage").then((interception) => {
      expect(interception.response.statusCode).eq(200);
      cy.intercept({
        method: "PUT",
        url: `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${orgId}`,
      }).as("editName");

      edit.editName(organizationData.newName);

      cy.wait("@editName").then((interception) => {
        expect(interception.response.statusCode).eq(200);
      });
    });
  });
});
