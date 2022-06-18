class CreateOrganization {
  get newOrganiaztionBtn() {
    return cy.get(".vs-c-my-organization--add-new");
  }

  get nameInput() {
    return cy.get("[type='text']");
  }

  get nextBtn() {
    return cy.get("[type='button']").last();
  }

  get uploadImageBtn() {
    return cy.get(".el-upload-dragger");
  }

  create(name) {
    this.newOrganiaztionBtn.click();
    this.nameInput.type(name);
    this.nextBtn.click();
    this.nextBtn.click();
  }

  // createWithImage(name) {
  //   this.newOrganiaztionBtn.click();
  //   this.nameInput.type(name);
  //   this.nextBtn.click();
  //   this.uploadImageBtn.click();
  //   this.createBtn.click();
  // }
}

export const createOrganization = new CreateOrganization();
