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

    // Get the current plan text
    async getCurrentPlan() {
        const currentPlanLocator = "div.current-plan-badge+div.plan-header-modern>div.plan-title-modern";
        const currentPlan = await this.page.locator(currentPlanLocator).textContent();
        return currentPlan;
    }

    /**
     * Select Plan
     * For the test purpose, We are going to select only 2 plans, Legacy or Small Business Plan
     * If the user is already in legacy plan, then I will go to Small Business Plan
     * Vise-Verca if the user is in Small Business Plan, I will go to legacy plan
     */
    async selectRequiredPlan() {
        let planName;
        let cost;

        const currentPlanName = await this.getCurrentPlan();
        if (currentPlanName == "Small Business Plan") {
            await this.page.locator("div.plan-category-tabs>button").filter({ hasText: "Individual" }).click();
            await this.page.locator("//div[@class='plan-title-modern' and text()='Legacy Plan']/../..//button").click();
            planName = "Small Business Plan";
            cost = "400";
        } else if (currentPlanName == "Legacy Plan") {
            await this.page.locator("div.plan-category-tabs>button").filter({ hasText: "Business" }).click();
            await this.page.locator("//div[@class='plan-title-modern' and text()='Small Business Plan']/../..//button").click();
            planName = "Legacy Plan";
            cost = "64";
        } else {
            await this.page.locator("div.plan-category-tabs>button").filter({ hasText: "Individual" }).click();
            await this.page.locator("//div[@class='plan-title-modern' and text()='Legacy Plan']/../..//button").click();
            planName = "Legacy Plan"
            cost = "64";

        }
        
        return { planName, cost };
    }

    // Click Add-ons
    async clickAddOn(){
        await this.page.locator("//button[text()='Add-on']").click();
    }

    // Click buynow button
    async clickBuyNowTwin(){
        await this.page.locator("button[class='plan-button-modern secondary']").click();
    }



}