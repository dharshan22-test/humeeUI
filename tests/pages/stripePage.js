const { expect } = require('@playwright/test');

exports.stripePage = class stripePage {

    /**
     * @param {import('@playwright/test').Page} page
     */

    constructor(page) {
        this.page = page;
    }

    // Verifying Stripe sandbox page is opened
    async verifySandbox(){
        await expect(this.page.locator("h1[data-testid='business-name']").filter({hasText:"Humee LLC sandbox"})).toBeVisible();
    }

    // Verify total amount is displayed in stripe payment correctly
    async verifyAmount(amount){
        await expect(this.page.locator("span.CurrencyAmount").filter({hasText:amount})).toBeVisible();
    }

    // Enter card information
    async enterCardInformation(){
        await this.page.locator("input#cardNumber").pressSequentially("4242424242424242");
        await this.page.locator("input#cardExpiry").pressSequentially("1169");
        await this.page.locator("input#cardCvc").pressSequentially("123");
        await this.page.locator("input#billingName").fill("testName");
    }

    // Click pay button
    async clickPay(){
        await this.page.locator("div.SubmitButton-IconContainer").click();
    }

}