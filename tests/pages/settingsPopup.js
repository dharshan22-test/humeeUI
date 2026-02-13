const { expect } = require('@playwright/test');

exports.settingsPopup = class settingsPopup {

    /**
     * @param {import('@playwright/test').Page} page
     */

    constructor(page) {
        this.page = page;
    }

    // Go to Usage
    async gotoSettings() {
        await this.page.locator("div.profile-container").click();
        await this.page.locator("button.settings-btn").click();
        await expect(this.page.locator("//div[@class='settings-modal-header']/h2[text()='Profile Settings']")).toBeVisible();
    }

    // Upload Profile Picture
    async uploadProfilePic() {
        await this.page.locator(".profile-upload-btn>input").setInputFiles("tests/utils/uploadfiles/jpgFile.jpg");
        await expect(this.page.locator(".profile-preview")).toBeVisible();
        const profilePicURL = await this.page.locator(".profile-preview").getAttribute("src");
        expect(profilePicURL).toContain(".jpg")
    }

    // Verifying Phone Number and email address input is not editable
    async nonEditableFields() {
        await expect(this.page.locator("input.settings-input-phone")).not.toBeEditable();
        await expect(this.page.locator("input[type='email']")).not.toBeEditable();
    }

    // Enter First Name and Last Name
    async enterName(firstName, lastName) {
        await this.page.getByPlaceholder("Enter first name").fill(firstName);
        await this.page.getByPlaceholder("Enter last name").fill(lastName);
    }

    // Click save changes button
    async clickSaveChanges() {
        await this.page.locator("button.settings-save-btn").click();
        await expect(this.page.locator("div[class='toast-notification toast-success']>span"))
            .toHaveText("Profile updated successfully!")
    }

    // Remove profile picture
    async removeProfilePic() {
        if (await this.page.locator("button.profile-delete-btn").isVisible()) {
            await this.page.locator("button.profile-delete-btn").click();
            await expect(this.page.locator(".profile-upload-btn>input")).not.toHaveAttribute('src');
        }
    }

    // Verify name is displayed after updaing
    async verifyName(firstName, lastName){
        const fullName = `${firstName} ${lastName}`;
        await expect(this.page.locator("span.user-greeting-name")).toHaveText(fullName);
    }

    // Verify image is displayed correctly
    async verifyImage(){
        const getURL = await this.page.locator("div.user-info>img").getAttribute('src');
        expect(getURL).toContain(".jpg")
    }


}