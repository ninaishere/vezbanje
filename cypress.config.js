const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "https://cypress.vivifyscrum-stage.com/",
    api: "https://cypress-api.vivifyscrum-stage.com/api/v2",
    env: {
      VALID_USER_EMAIL: "ninasamsung2001@gmail.com",
      VALID_USER_PASSWORD: "test123456",
    },
  },
});
