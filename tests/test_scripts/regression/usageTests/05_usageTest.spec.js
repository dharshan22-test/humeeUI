const { test, expect } = require('@playwright/test');
const { usagePage } = require('../../../pages/usage');
const { stripePage } = require('../../../pages/stripePage');
const { loginPage } = require('../../../pages/loginPage');

test.describe("Usage page Tests", () => {
    test("Purchasing Conversation minutes", async ({ page }) => {

        const usage = new usagePage(page);
        const stripe = new stripePage(page);
        const login = new loginPage(page);

        // Go to Dashboard
        await page.goto('/dashboard');

        // Go to Usage Section
        await usage.gotoUsage();

        // Get Allowed Conversation Minutes count
        const initialConvMins = await usage.getCount("Conversational minutes per month", "Allowed");

        // Click buy more button
        await usage.clickBuyMoreButton("Conversational minutes per month");

        // Click the + icon to increase the purchasing unit
        await usage.clickIncreaseQuanity(5);

        // Verify calculated amount
        const totalAmount = await usage.verifyCardCalculation();

        // Click Purchase Now button
        await usage.clickPurchase(totalAmount);

        // Click Stripe Page
        await stripe.verifySandbox();

        // Verify amount is displayed correctly in Stripe page
        await stripe.verifyAmount(totalAmount);

        // Enter card information
        await stripe.enterCardInformation();

        // Click pay button
        await stripe.clickPay();

        // Verify login page is displayed
        await login.verifyLoginPage();

        // Go to dashboard again
        await page.goto('/dashboard');

        // Go to Usage
        await usage.gotoUsage();

        // Get Allowed Conversation Minutes count
        const finalConvMins = await usage.getCount("Conversational minutes per month", "Allowed");

        expect(finalConvMins).toEqual(initialConvMins + 5);

    });
});
