class Profile {
  get accountBtn() {
    return cy.get(".el-dropdown-link");
  } //with user avatar

  get profileBtn() {
    return cy.get(".vs-c-site-logo").last();
  }

  get logoutBtn() {
    return cy.get(".vs-c-btn--danger");
  }

  clickLogoutBtn() {
    this.logoutBtn.click();
  }

  get firstName() {
    return cy.get("[name='first_name']");
  }

  get lastName() {
    return cy.get("[name='last_name']");
  }

  get updateProfileInfoBtn() {
    return cy.get(".vs-c-btn-auth--top-gap").first();
  }

  get newEmailInput() {
    return cy.get("[name='email']");
  }

  get changeEmailPasswordInput() {
    return cy.get("[name='password']").first();
  }

  get updateEmailBtn() {
    return cy.get(".vs-c-btn-auth--top-gap").eq(1);
  }

  get currentPasswordInput() {
    return cy.get("[name='currentpassword']").first();
  }

  get newPasswordInput() {
    return cy.get("[name='newpassword']").first();
  }

  get newPasswordInput2() {
    return cy.get("[name='repeatnewpassword']").first();
  }

  get updatePasswordBtn() {
    return cy.get(".vs-c-btn-auth--top-gap").eq(2);
  }

  get calendarStartDayBtn() {
    return cy.get(".el-dropdown").first();
  }

  get monday() {
    return cy.get(".vs-c-task-modal-type-dropdown__item-name").eq(1);
  }

  get themeDropdown() {
    return cy.get(".el-dropdown");
  }

  get lightTheme() {
    return cy.get(".vs-c-icon--lg").eq(1);
  }

  get darkTheme() {
    return cy.get(".vs-c-icon--lg").eq(2);
  }

  get logout() {
    this.accountBtn.click();
    this.profileBtn.click();
    this.logoutBtn.click();
  }

  personalInfo(firstName, lastName) {
    this.accountBtn.click();
    this.profileBtn.click();
    this.firstName.clear().type(firstName);
    this.lastName.clear().type(lastName);
    this.updateProfileInfoBtn.click();
  }

  changeEmail(newEmail, password) {
    this.accountBtn.click();
    this.profileBtn.click();
    this.newEmailInput.clear().type(newEmail);
    this.changeEmailPasswordInput.type(password);
    this.updateEmailBtn.click();
  }

  changePassword(oldPassword, newPassword) {
    this.accountBtn.click();
    this.profileBtn.click();
    this.currentPasswordInput.type(oldPassword);
    this.newPasswordInput.type(newPassword);
    this.newPasswordInput2.type(newPassword);
    this.updatePasswordBtn.click();
  }

  bringBackOldPassword(newPassword, oldPassword) {
    this.accountBtn.click();
    this.profileBtn.click();
    this.currentPasswordInput.type(newPassword);
    this.newPasswordInput.type(oldPassword);
    this.newPasswordInput2.type(oldPassword);
    this.updatePasswordBtn.click();
  }

  changeCalendarStartDay() {
    this.calendarStartDayBtn.click();
    this.monday.click();
  }

  changeTheme() {
    this.accountBtn.click();
    this.profileBtn.click();
    this.themeDropdown.click();
    this.darkTheme.click();
  }
}

export const profile = new Profile();
