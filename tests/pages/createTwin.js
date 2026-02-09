const { expect } = require('@playwright/test');

exports.createTwinPage = class createTwinPage {

    /**
     * @param {import('@playwright/test').Page} page
     */

    constructor(page) {
        this.page = page;
    }

    // Go to Create Twin
    async gotoCreateTwin() {
        await this.page.locator("span.nav-menu-text").filter({ hasText: "Create Twin" }).click();
        await expect(
            this.page.locator("//main[@class='main-content']//h2[text()='Get started with your Twin in 3 simple steps']"))
            .toBeVisible();
    }

    

}