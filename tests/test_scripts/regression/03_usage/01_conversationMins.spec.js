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

        const timeout = 180000; // 3 minutes
        const interval = 15000; // 15 seconds
        const start = Date.now();

        let latestMail = null;

        while (Date.now() - start < timeout) {

            const mail = await waitForLatestEmail({
                since: mailCheckStartedAt,
                timeoutMs: 15000,
                pollIntervalMs: 5000,
                subjectContains: "Feature Purchase Successful"
            });

            if (mail) {

                if (new Date(mail.date) >= mailCheckStartedAt &&
                    mail.text.includes(totalAmount)) {

                    latestMail = mail;
                    break;
                }

                console.log("Old or unrelated email detected. Waiting for correct one...");
            }

            await new Promise(r => setTimeout(r, interval));
        }

        if (!latestMail) {
            throw new Error("Correct billing email not received within 3 minutes");
        }

        console.log("Correct billing email received:", latestMail.subject);

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
