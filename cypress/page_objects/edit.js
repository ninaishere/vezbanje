class Edit {
  get nameInput() {
    return cy.get("[name='name']");
  }

  get updateBtn() {
    return cy.get("[type='submit']").first();
  }

  editName(newName) {
    this.nameInput.clear();
    this.nameInput.type(newName);
    this.updateBtn.click();
  }
}

export const edit = new Edit();
