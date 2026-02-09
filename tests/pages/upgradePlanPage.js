const { expect } = require('@playwright/test');

exports.upgradePlan = class upgradePlan {

    /**
     * @param {import('@playwright/test').Page} page
     */

    constructor(page) {
        this.page = page;
    }

    // Go to Upgrade Plan
    async gotoUpgradePlan() {
        await this.page.locator("div.profile-container").click();
        await this.page.locator("button.Price-btn").click();
        await expect(this.page.locator("section.plan-section>div.plan-section-header>h2.plan-section-title")).toBeVisible(); 
    }

    

}