const { test } = require('../../../utils/fixtures/myFixtures');
const { expect } = require('@playwright/test');
const { usagePage } = require('../../../pages/usage');
const { stripePage } = require('../../../pages/stripePage');
const { loginPage } = require('../../../pages/loginPage');
const { waitForLatestEmail } = require('../../../utils/helper/gmailHelper');

const userPhoneNumber = "8622595064";

test.describe("Usage page Tests", () => {

    test("Purchasing Custom Training", async ({ page }) => {

        const usage = new usagePage(page);
        const stripe = new stripePage(page);
        const login = new loginPage(page);

        // Go to Dashboard
        await login.strictLogin(userPhoneNumber)

        // Go to Usage Section
        await usage.gotoUsage();

        // Get Allowed Custom training sessions
        const initialCount = await usage.getCount("Custom training sessions", "Allowed");
        // console.log("initial Count", initialCount);

        // Click buy more button
        await usage.clickBuyMoreButton("Custom training sessions");

        // Click the + icon to increase the purchasing unit
        await usage.clickIncreaseQuanity(1);

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
        const mailCheckStartedAt = new Date();
        await stripe.clickPay();

        // Verifying mail is received for successful purchase with correct amount
        const latestMail = await waitForLatestEmail({
            dateNow: mailCheckStartedAt,
            subjectContains: "Feature Purchase Successful",
            bodyContains: "custom training sessions"
        });

        // console.log("Correct billing email received:", latestMail.subject);

        // Verify login page is displayed
        await login.verifyLoginPage();

        // Go to dashboard again
        await login.login(userPhoneNumber)

        // Go to Usage
        await usage.gotoUsage();

        // Get Allowed Conversation Minutes count
        const finalCount = await usage.getCount("Custom training sessions", "Allowed");

        expect(Number(finalCount)).toEqual(Number(initialCount) + 2)

    });

});
