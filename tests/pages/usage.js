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
        await expect(this.page.locator("div.usage-dashboard-header-content>h1").filter({ hasText: "Usage Dashboard" })).toBeVisible();
    }

    // Verify Active Users  Count
    async verifyActiveUsersCount(usageCount) {
        const usageCountLocator = "div.usage-dashboard-header-content>div[class='usage-concurrent-users clickable']>span";
        await expect(this.page.locator(usageCountLocator)).toHaveText(usageCount);
    }

    // Verify Plan Name
    async verifyPlanName(planName) {
        await expect(this.page.locator("div.usage-subscription-info>span")).toHaveText(planName);
    }

    // Get plan name
    async getPlanName() {
        const planName = await this.page.locator("div.usage-subscription-info>span").textContent();;
        return planName
    }

    // Verify Count any actions for any card in usage section
    async getCount(cardName, cardAction) {
        const cardLocator = `//div/h3[text()='${cardName}']/../../div[@class='usage-chart-content']//span[text()='${cardAction}:']/following-sibling::span`;
        const cardText = await this.page.locator(cardLocator).textContent();
        // console.log(cardText);
        return cardText;
    }

    // Get Twin Count
    async getTwinCount() {
        const twinLocator = "//div/h3[text()='Humee twin']/../../div[@class='usage-chart-content']//span[@class='usage-stat-value']";
        const twinCount = await this.page.locator(twinLocator).textContent();
        return twinCount;
    }

    // Click buy more button for any card in usage section
    async clickBuyMoreButton(cardName) {
        const buyMoreButtonLocator = `//div/h3[text()='${cardName}']/../../div[@class='usage-chart-actions']/button`;
        await this.page.locator(buyMoreButtonLocator).click();
    }

    // Verify Content in buymore popup
    async verifyBuyMore(heading, count) {
        await expect(this.page.locator("div.purchase-modal-header>h2")).toHaveText(heading);
        await expect(this.page.locator("div.feature-usage-info>div>p")).toHaveText(count);

    }

    // Click decrease quantity
    async clickDecreaseQuanity(decreaseBy) {

        const initialQuantity = await this.page.locator("div.quantity-controls>input.quantity-input").getAttribute('value');
        await this.page.locator("div.quantity-controls>button[aria-label='Decrease quantity']").click();
        await this.page.waitForTimeout(1000); // not instantaneous so giving 1 secs 
        const finalQuantity = await this.page.locator("div.quantity-controls>input.quantity-input").getAttribute('value');
        await expect(this.page.locator("div.price-row>span").filter({ hasText: new RegExp(`^${finalQuantity}$`) })).toBeVisible();
        // console.log("initial Quantity ", initialQuantity);
        // console.log("final quantity ", finalQuantity);

        expect(Number(finalQuantity)).toEqual(Number(initialQuantity) - Number(decreaseBy));
    }

    // Click Increase quantity
    async clickIncreaseQuanity(increaseBy) {

        const initialQuantity = await this.page.locator("div.quantity-controls>input.quantity-input").getAttribute('value');
        await this.page.locator("div.quantity-controls>button[aria-label='Increase quantity']").click();
        await this.page.waitForTimeout(1000); // not instantaneous so giving 1 secs 
        const finalQuantity = await this.page.locator("div.quantity-controls>input.quantity-input").getAttribute('value');
        await expect(this.page.locator("div.price-row>span").filter({ hasText: new RegExp(`^${finalQuantity}$`) })).toBeVisible();

        // console.log("initial Quantity ", initialQuantity);
        // console.log("final quantity ", finalQuantity);

        expect(Number(finalQuantity)).toEqual(Number(initialQuantity) + Number(increaseBy));
    }

    // Verify card calculation value is showing correctly
    async verifyCardCalculation() {

        const unitPriceText = await this.page
            .locator("//div[@class='price-row']/span[text()='Unit Price:']/following-sibling::span")
            .textContent();

        const quantityText = await this.page
            .locator("//div[@class='price-row']/span[@class='text-capitalize']/following-sibling::span")
            .textContent();

        const totalText = await this.page
            .locator("//div[@class='price-row total']/span[text()='Total:']/following-sibling::span")
            .textContent();

        // Extract values
        const unitPrice = Number(unitPriceText.match(/[\d.]+/)[0]);
        const quantity = Number(quantityText.match(/\d+/)[0]);

        const displayedTotalText = totalText.match(/[\d.]+/)[0]; // "3.50"
        const displayedTotalNumber = Number(displayedTotalText); // 3.5

        // Calculate expected
        const calculatedTotalNumber = Number((unitPrice * quantity).toFixed(2));
        const calculatedTotalText = calculatedTotalNumber.toFixed(2); // "3.50"

        // Assertion 1: numeric correctness
        expect(displayedTotalNumber).toBe(calculatedTotalNumber);

        // Assertion 2: formatting (exactly 2 decimals)
        expect(displayedTotalText).toBe(calculatedTotalText);
        expect(displayedTotalText).toMatch(/^\d+\.\d{2}$/);



        return displayedTotalText;
    }


    // click purchase button
    async clickPurchase(totalValue) {
        await expect(this.page.locator("button[title='Proceed to checkout']")).toContainText(totalValue);
        await this.page.locator("button[title='Proceed to checkout']").click();
    }

    // Verify last updated date is displayed correctly
    async verifylastUpdatedDate(date) {
        await expect(this.page.locator("//div[@class='usage-last-updated' and contains(text(),'Last Updated')]")).toHaveText(date);
    }

    // Verify expired date is displayed correctly
    async verifyExpiryDate(date) {
        await this.page.locator("//div[@class='usage-last-updated' and contains(text(),'Expiry Date')]").toHaveText(date);
    }

    // Verify reload button
    async clickReload() {
        await this.page.locator("button.refresh-button").click();
    }

    // Click cancel plan button
    async clickCancelPlan() {
        await this.page.locator("button[class='plan-button-modern cancel-btn-red']").click();
        await this.page.locator("div.enquiry-modal-actions>button[class='plan-button-modern cancel-btn-red']").click();
    }


    /**
     * Validates that conversation time increased by expected minutes
     * Supports h, m, s (e.g. "1h 49m 10s", "0m 50s", "25h 20m")
     *
     * @param {string} initialTime
     * @param {string} finalTime
     * @param {number} incrementMinutes
     */
    async validateConversationMinutesIncrement(initialTime, finalTime, incrementMinutes) {

        const toSeconds = (time) => {
            const h = time.match(/(\d+)\s*h/);
            const m = time.match(/(\d+)\s*m/);
            const s = time.match(/(\d+)\s*s/);

            return (
                (h ? parseInt(h[1]) * 3600 : 0) +
                (m ? parseInt(m[1]) * 60 : 0) +
                (s ? parseInt(s[1]) : 0)
            );
        };

        const initialSeconds = toSeconds(initialTime);
        const finalSeconds = toSeconds(finalTime);

        const expectedSeconds = initialSeconds + (incrementMinutes * 60);

        // console.log({
        //     initialTime,
        //     finalTime,
        //     incrementMinutes,
        //     initialSeconds,
        //     finalSeconds,
        //     expectedSeconds
        // });

        expect(finalSeconds).toBe(expectedSeconds);
    }

    // Select all Twin
    async selectRequiredTwin() {
        await this.page.locator("div.replica-selection-info>button").click();
        await this.page.locator("div.replica-footer-btn-wrapper>button.btn-confirm").click();
    }


}