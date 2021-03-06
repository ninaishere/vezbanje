/// <reference types="Cypress" />

import { login } from "../page_objects/login";
import { createOrganization } from "../page_objects/createOrganization";
import { edit } from "../page_objects/edit";
import { profile } from "../page_objects/profile";
const faker = require("faker");

describe("Login test", () => {
  let loginData = {
    email: "raickovic2001@gmail.com",
    password: "test123456",
    newPassword: "test654321",
  };
  let organizationData = {
    name: faker.name.firstName(),
    newName: "new Name",
  };
  let orgId;
  let token;
  let userId;
  let orgNumber;

  beforeEach("visit login page", () => {
    cy.visit("/login");
    cy.url().should("include", "/login");
  });

  it("valid login", () => {
    cy.intercept({
      method: "POST",
      url: "https://cypress-api.vivifyscrum-stage.com/api/v2/login",
    }).as("login");

    login.login(loginData.email, loginData.password);

    cy.wait("@login").then((interception) => {
      expect(interception.response.statusCode).eq(200);
      expect(interception.response.body.token).to.exist;
      token = interception.response.body.token;
      expect(interception.response.body.user.id).to.exist;

      cy.url().should("not.include", "/login");
    });
  });

  // ————————————————————————————————————————————————————————————————————————————————————
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
      expect(interception.response.body.id).to.exist;
      expect(interception.response.body.status).eq("active");
      expect(interception.response.body.name).eq(organizationData.name);
      cy.url().should("include", "/boards");
    });
  });

  // ————————————————————————————————————————————————————————————————————————————————————
  it("archive organization", () => {
    cy.intercept({
      method: "PUT",
      url: `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${orgId}/status`,
    }).as("archive");

    login.login(loginData.email, loginData.password);
    cy.wait(3000);
    cy.visit(
      `https://cypress.vivifyscrum-stage.com/organizations/${orgId}/settings`
    );

    edit.archive();

    // Arhiviranje sa pocetne strane:
    // cy.visit("/my-organizations");
    // cy.get(".vs-c-icon--archive").first().invoke("show").click({ force: true });
    // cy.get(".vs-u-text--right > button").last().click();

    cy.wait("@archive").then((interception) => {
      expect(interception.response.statusCode).eq(200);
      expect(interception.response.body.status).eq("archived");
    });
  });

  // ————————————————————————————————————————————————————————————————————————————————————
  it("edit organization", () => {
    //ovo dole ti je link za edit page organizacije
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
    });

    // promena imena
    cy.intercept({
      method: "PUT",
      url: `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${orgId}`,
    }).as("editName");

    edit.editName(organizationData.newName);

    cy.wait("@editName").then((interception) => {
      expect(interception.response.statusCode).eq(200);
      expect(interception.response.body.name).eq(organizationData.newName);
    });

    // selektuj workdays, odnosno ucheckuj petak
    cy.intercept({
      method: "PUT",
      url: `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${orgId}/workdays`,
    }).as("workdays");

    edit.markCheckbox(4); //uncheck Friday

    cy.wait("@workdays").then((interception) => {
      expect(interception.response.statusCode).eq(200);
    });

    //upisi vacation days
    cy.intercept({
      method: "PUT",
      url: `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${orgId}/vacation-days`,
    }).as("vacDays");

    edit.vacationDays(1, 2, 3);

    cy.wait("@vacDays").then((interception) => {
      expect(interception.response.statusCode).eq(200);
      expect(interception.response.body.days_per_year).eq(1);
      expect(interception.response.body.additional_months_for_days).eq(2);
      expect(interception.response.body.additional_days).eq(3);
    });

    //obrisi organizaciju
    cy.intercept({
      method: "POST",
      url: `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${orgId}`,
    }).as("delete");

    edit.delete(loginData.password);

    cy.wait("@delete").then((interception) => {
      expect(interception.response.statusCode).eq(201);
      cy.url().should("not.include", `/organizations/${orgId}/settings`);
    });
  });

  // ————————————————————————————————————————————————————————————————————————————————————
  // staviti only na create
  it("add project", () => {
    cy.intercept({
      method: "POST",
      url: `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${orgId}/projects`,
    }).as("addProject");

    login.login(loginData.email, loginData.password);
    cy.wait(3000);
    cy.visit(
      `https://cypress.vivifyscrum-stage.com/organizations/${orgId}/projects`
    );

    edit.addProject("projekat");

    cy.wait("@addProject").then((interception) => {
      expect(interception.response.statusCode).eq(201);
      expect(interception.response.body.name).eq("projekat");
    });
  });

  // it("create org than add new board", () => {
  //   cy.intercept({
  //     method: "POST",
  //     url: "https://cypress-api.vivifyscrum-stage.com/api/v2/organizations",
  //   }).as("create");

  //   login.login(loginData.email, loginData.password);
  //   cy.wait(3000);
  //   cy.visit("/my-organizations");
  //   cy.url().should("include", "/my-organizations");

  //   createOrganization.create(organizationData.name);

  //   cy.wait("@create").then((interception) => {
  //     orgId = interception.response.body.id;
  //     expect(interception.response.statusCode).eq(201);

  //     cy.intercept({
  //       method: "POST",
  //       url: `https://cypress-api.vivifyscrum-stage.com/api/v2/boards`,
  //     }).as("addBoard");

  //     //   cy.visit(
  //     //     `https://cypress.vivifyscrum-stage.com/organizations/${orgId}/boards`
  //     //   );

  //     edit.addBoard(organizationData.name);

  //     cy.wait("@addBoard").then((interception) => {
  //       expect(interception.response.statusCode).eq(201);
  //     });
  //   });
  // });

  // ————————————————————————————————————————————————————————————————————————————————————
  it("add new board", () => {
    cy.intercept({
      method: "POST",
      url: `https://cypress-api.vivifyscrum-stage.com/api/v2/boards`,
    }).as("addBoard");

    login.login(loginData.email, loginData.password);
    cy.wait(3000);

    cy.visit(
      `https://cypress.vivifyscrum-stage.com/organizations/${orgId}/boards`
    );

    edit.addBoard("new board");

    cy.wait("@addBoard").then((interception) => {
      expect(interception.response.statusCode).eq(201);
      expect(interception.response.body.name).eq("new board");
    });
  });

  // ————————————————————————————————————————————————————————————————————————————————————
  // it.only("delete active organization", () => {
  //   cy.intercept({
  //     method: "POST",
  //     url: `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${orgId}`,
  //   }).as("delete");

  //   login.login(loginData.email, loginData.password);
  //   cy.wait(3000);
  //   cy.visit(
  //     `https://cypress.vivifyscrum-stage.com/organizations/${orgId}/settings`
  //   );

  //   edit.delete(loginData.password);

  //   cy.wait("@delete").then((interception) => {
  //     expect(interception.response.statusCode).eq(201);
  //     cy.url().should("not.include", `/organizations/${orgId}/settings`);
  //   });
  // });

  // ————————————————————————————————————————————————————————————————————————————————————
  //stavi only na archive organization
  it("delete archived organization", () => {
    cy.intercept({
      method: "POST",
      url: `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${orgId}`,
    }).as("deleteArchived");

    login.login(loginData.email, loginData.password);
    cy.wait(3000);
    cy.visit(
      `https://cypress.vivifyscrum-stage.com/organizations/${orgId}/boards`
    );

    edit.deleteArchived(loginData.password);

    cy.wait("@deleteArchived").then((interception) => {
      expect(interception.response.statusCode).eq(201);
      cy.url().should("not.include", `/organizations/${orgId}/boards`);
    });
  });

  // ————————————————————————————————————————————————————————————————————————————————————
  //mora da ima only na create i na archive
  // U N A R C H I V E
  it("reopen organization after archiving", () => {
    cy.intercept({
      method: "PUT",
      url: `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${orgId}/status`,
    }).as("reopen");

    login.login(loginData.email, loginData.password);
    cy.wait(3000);
    cy.visit(
      `https://cypress.vivifyscrum-stage.com/organizations/${orgId}/boards`
    );

    edit.reopenOrg();

    cy.wait("@reopen").then((interception) => {
      expect(interception.response.statusCode).eq(200);
      expect(interception.response.body.status).eq("active");
    });
  });

  // ————————————————————————————————————————————————————————————————————————————————————
  it("logout", () => {
    cy.intercept({
      method: "POST",
      url: "https://cypress-api.vivifyscrum-stage.com/api/v2/logout",
    }).as("logout");

    login.login(loginData.email, loginData.password);
    cy.wait(3000);
    // cy.visit("https://cypress.vivifyscrum-stage.com/account/settings");

    profile.logout();

    cy.wait("@logout").then((interception) => {
      expect(interception.response.statusCode).eq(201);
      expect(interception.response.body.message).eq("Successfully logged out");
    });
  });

  // ————————————————————————————————————————————————————————————————————————————————————
  //promena imena PROFILA
  it("change first and last name of the account", () => {
    cy.intercept({
      method: "PUT",
      url: `https://cypress-api.vivifyscrum-stage.com/api/v2/users`,
    }).as("changeName");

    login.login(loginData.email, loginData.password);
    cy.wait(3000);

    profile.personalInfo("nina", "r");

    cy.wait("@changeName").then((interception) => {
      expect(interception.response.statusCode).eq(200);
      expect(interception.response.body.first_name).eq("nina");
      expect(interception.response.body.last_name).eq("r");
    });
  });

  // ————————————————————————————————————————————————————————————————————————————————————
  it("change email", () => {
    cy.intercept({
      method: "PUT",
      url: `https://cypress-api.vivifyscrum-stage.com/api/v2/users`,
    }).as("changeEmail");

    login.login(loginData.email, loginData.password);
    cy.wait(3000);

    profile.changeEmail(loginData.email, loginData.password);

    cy.wait("@changeEmail").then((interception) => {
      expect(interception.response.statusCode).eq(400);
    });
  });

  // ————————————————————————————————————————————————————————————————————————————————————
  it("change password", () => {
    cy.intercept({
      method: "POST",
      url: `https://cypress-api.vivifyscrum-stage.com/api/v2/update-password`,
    }).as("changePassword");

    login.login(loginData.email, loginData.password);
    cy.wait(3000);

    profile.changePassword(loginData.password, loginData.newPassword);

    cy.wait("@changePassword").then((interception) => {
      expect(interception.response.statusCode).eq(200);
    });
  });

  // ————————————————————————————————————————————————————————————————————————————————————
  it("bring back old password", () => {
    cy.intercept({
      method: "POST",
      url: `https://cypress-api.vivifyscrum-stage.com/api/v2/update-password`,
    }).as("changePassword");

    login.login(loginData.email, loginData.newPassword);
    cy.wait(3000);

    profile.bringBackOldPassword(loginData.newPassword, loginData.password);

    cy.wait("@changePassword").then((interception) => {
      expect(interception.response.statusCode).eq(200);
    });
  });

  // ————————————————————————————————————————————————————————————————————————————————————
  //promeni da pocinje od ponedeljka a ne od nedelje
  //stavi only na create
  it("calendar start day", () => {
    cy.intercept({
      method: "PUT",
      url: `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${orgId}/calendar-starting-day`,
    }).as("startDay");

    login.login(loginData.email, loginData.password);
    cy.wait(3000);
    cy.visit(
      `https://cypress.vivifyscrum-stage.com/organizations/${orgId}/settings`
    );

    profile.changeCalendarStartDay();

    cy.wait("@startDay").then((interception) => {
      expect(interception.response.statusCode).eq(200);
      expect(interception.response.body.calendar_starting_day).eq(1);
    });
  });

  // ————————————————————————————————————————————————————————————————————————————————————
  it.only("change theme", () => {
    cy.intercept({
      method: "PUT",
      url: `https://cypress-api.vivifyscrum-stage.com/api/v2/user-theme`,
    }).as("theme");

    login.login(loginData.email, loginData.password);
    cy.wait(3000);

    profile.changeTheme();

    cy.wait("@theme").then((interception) => {
      expect(interception.response.statusCode).eq(200);
      expect(interception.response.body.theme).eq("dark");
    });
  });
});
