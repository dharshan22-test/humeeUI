const { expect } = require('@playwright/test');

exports.visitorDetails = class visitorDetails {

    /**
     * @param {import('@playwright/test').Page} page
     */

    constructor(page) {
        this.page = page;
    }

    // Go to Visitors Details tab
    async gotoVisitorsDetails(){
        await this.page.locator("div.nav-tabs-container>button").filter({ hasText: "Visitors Details" }).click();
        await expect(this.page.locator("div.table-data-container")).toBeVisible();
    }



}