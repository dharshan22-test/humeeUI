const { test } = require('../../../utils/fixtures/myFixtures');
const { expect } = require('@playwright/test');
const { usagePage } = require('../../../pages/usage');
const { stripePage } = require('../../../pages/stripePage');
const { loginPage } = require('../../../pages/loginPage');

const userPhoneNumber = "8622595064";

test.describe("Usage page Tests", () => {

    test("Purchasing Humee twin", async ({ page }) => {

        const usage = new usagePage(page);
        const stripe = new stripePage(page);
        const login = new loginPage(page);

        // Go to Dashboard
        await login.strictLogin(userPhoneNumber)

        // Go to Usage Section
        await usage.gotoUsage();

        // Get Humee twin Count
        const initialCount = await usage.getTwinCount();
        // console.log("initial Count", initialCount);

        // Click buy more button
        await usage.clickBuyMoreButton("Humee twin");

        // Click the + icon to increase the purchasing unit
        await usage.clickIncreaseQuanity(1);

        // Verify calculated amount
        const totalAmount = await usage.verifyCardCalculation();

        // Click Purchase Now button
        await usage.clickPurchase(totalAmount);

        // Select required twin
        await usage.selectRequiredTwin();

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
        await login.login(userPhoneNumber)

        // Go to Usage
        await usage.gotoUsage();

        // Verify final twin count
        const finalCount = await usage.getTwinCount();

        // Verify Converssation mins is increased 
        expect(Number(finalCount)).toEqual(Number(initialCount) + 2)        

    });
});
