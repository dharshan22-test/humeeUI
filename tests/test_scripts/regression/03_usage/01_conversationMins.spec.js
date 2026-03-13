const { test } = require('../../../utils/fixtures/myFixtures');
const { usagePage } = require('../../../pages/usage');
const { stripePage } = require('../../../pages/stripePage');
const { loginPage } = require('../../../pages/loginPage');
const { waitForLatestEmail } = require('../../../utils/helper/gmailHelper');

const userPhoneNumber = "8622595064";

test.describe("Usage page Tests", () => {

    test("Purchasing Conversation minutes", async ({ page }) => {

        const usage = new usagePage(page);
        const stripe = new stripePage(page);
        const login = new loginPage(page);

        // Go to Dashboard
        await login.strictLogin(userPhoneNumber)

        // Go to Usage Section
        await usage.gotoUsage();

        // Get Allowed Conversation Minutes count
        const initialConvMins = await usage.getCount("Conversational minutes per month", "Allowed");
        // console.log("initial conv mins", initialConvMins);

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
        const mailCheckStartedAt = new Date();
        await stripe.clickPay();

        // Verifying mail is received for successful purchase with correct amount
        const latestMail = await waitForLatestEmail({
            dateNow: mailCheckStartedAt,
            subjectContains: "Feature Purchase Successful",
            bodyContains: "conversational minutes per month"
        });

        // console.log("Correct billing email received:", latestMail.subject);

        // Verify login page is displayed
        await login.verifyLoginPage();

        // Go to dashboard again
        await login.login(userPhoneNumber)

        // Go to Usage
        await usage.gotoUsage();

        // Get Allowed Conversation Minutes count
        const finalConvMins = await usage.getCount("Conversational minutes per month", "Allowed");
        // console.log(finalConvMins);

        // Verify Converssation mins is increased 
        await usage.validateConversationMinutesIncrement(initialConvMins, finalConvMins, 10);

    });

});
