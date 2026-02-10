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

}