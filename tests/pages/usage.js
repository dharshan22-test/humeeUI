const { expect } = require('@playwright/test');

exports.usagePage = class usagePage {

    /**
     * @param {import('@playwright/test').Page} page
     */

    constructor(page) {
        this.page = page;
    }

    // Go to Usage
    async gotoUsage() {
        await this.page.locator("div.profile-container").click();
        await this.page.locator("button.usage-btn").click();
        await expect(this.page.locator("div.usage-dashboard-header-content>h1").filter({hasText:"Usage Dashboard"})).toBeVisible(); 
    }

    

}