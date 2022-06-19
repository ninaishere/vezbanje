class Edit {
  get nameInput() {
    return cy.get("[name='name']");
  }

  get updateBtn() {
    return cy.get("[type='submit']").first();
  } //for new name

  get workdays() {
    return cy.get(".vs-c-checkbox-check");
  }

  get vacDays() {
    return cy.get("[name='vacationDays']");
  }

  get workingMonths() {
    return cy.get("[name='numOfWorkingMonthsForAdditionalDays']");
  }

  get additionalVacDays() {
    return cy.get("[name='additionalVacationDays']");
  }

  get secondUpdateBtn() {
    return cy.get("[type='submit']").eq(1);
  } //for vacation days

  get deleteBtn() {
    return cy.get(".vs-c-btn--warning");
  }

  get passwordInput() {
    return cy.get("[type='password']");
  }

  get yesBtn() {
    return cy.get("[name='save-btn']");
  }

  get addProjectBtn() {
    return cy.get(".vs-c-btn--primary").first();
  }

  get nextBtn() {
    return cy.get("[name='next_btn']");
  }

  get OKbtn() {
    return cy.get("[name='close-new-board-modal-btn']");
  }

  get addBoardBtn() {
    return cy.get(".vs-c-organization-boards__item--add-new");
  }

  get boardType() {
    return cy.get("[name='type_kanban']");
  }

  get archiveBtn() {
    return cy.get(".vs-c-btn--success");
  }

  get reopenBtn() {
    return cy.get(".vs-c-btn--primary");
  }

  editName(newName) {
    this.nameInput.clear();
    this.nameInput.type(newName);
    this.updateBtn.click();
  }

  markCheckbox(number) {
    this.workdays.eq(number).click();
  }

  vacationDays(num1, num2, num3) {
    this.vacDays.clear().type(num1);
    this.workingMonths.clear().type(num2);
    this.additionalVacDays.clear().type(num3);
    this.secondUpdateBtn.click();
  }

  delete(password) {
    this.deleteBtn.click();
    this.passwordInput.type(password);
    this.yesBtn.click();
  }

  deleteArchived(password) {
    this.OKbtn.click();
    this.deleteBtn.click();
    this.passwordInput.type(password);
    this.yesBtn.click();
  }

  reopenOrg() {
    this.OKbtn.click();
    this.reopenBtn.click();
    this.yesBtn.click();
  }

  addProject(name) {
    this.OKbtn.click();
    this.addProjectBtn.click();
    this.nameInput.type(name);
    this.nextBtn.click();
    this.nextBtn.click();
  }

  addBoard(name) {
    this.OKbtn.click();
    cy.wait(3000);
    this.addBoardBtn.click();
    this.nameInput.type(name);
    this.nextBtn.click();
    this.boardType.click();
    this.nextBtn.click();
    this.nextBtn.click();
    this.nextBtn.click();
    this.nextBtn.click();
  }

  archive() {
    this.archiveBtn.click();
    this.yesBtn.click();
  }
}

export const edit = new Edit();
