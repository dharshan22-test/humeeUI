const { test, expect } = require('@playwright/test');
const { usagePage } = require('../../../pages/usage');
const { stripePage } = require('../../../pages/stripePage');
const { loginPage } = require('../../../pages/loginPage');

const userPhoneNumber = "8622595064";

test.describe.serial("Usage page Tests", () => {
    test("Purchasing Conversation minutes", async ({ page }) => {

        const usage = new usagePage(page);
        const stripe = new stripePage(page);
        const login = new loginPage(page);

        // Go to Dashboard
        await login.login(userPhoneNumber)

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
        await stripe.clickPay();

        // Verify login page is displayed
        await login.verifyLoginPage();

        // Go to dashboard again
        await login.login(userPhoneNumber)

        // Go to Usage
        await usage.gotoUsage();

        // Get Allowed Conversation Minutes count
        const finalConvMins = await usage.getCount("Conversational minutes per month", "Allowed");

        // Verify Converssation mins is increased 
        await usage.validateConversationMinutesIncrement(initialConvMins, finalConvMins, 10);

    });

    test("Purchasing Custom Training", async ({ page }) => {

        const usage = new usagePage(page);
        const stripe = new stripePage(page);
        const login = new loginPage(page);

        // Go to Dashboard
        await login.login(userPhoneNumber)

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
        await stripe.clickPay();

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

    test("Purchasing Concurrent sessions", async ({ page }) => {

        const usage = new usagePage(page);
        const stripe = new stripePage(page);
        const login = new loginPage(page);

        // Go to Dashboard
        await login.login(userPhoneNumber)

        // Go to Usage Section
        await usage.gotoUsage();

        // Get Allowed Concurrent sessions
        const initialCount = await usage.getCount("Concurrent sessions", "Allowed");
        // console.log("initial Count", initialCount);

        // Click buy more button
        await usage.clickBuyMoreButton("Concurrent sessions");

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
        await stripe.clickPay();

        // Verify login page is displayed
        await login.verifyLoginPage();

        // Go to dashboard again
        await login.login(userPhoneNumber)

        // Go to Usage
        await usage.gotoUsage();

        // Get Allowed Conversation Minutes count
        const finalCount = await usage.getCount("Concurrent sessions", "Allowed");

        // Verify Converssation mins is increased 
        expect(Number(finalCount)).toEqual(Number(initialCount) + 2)

    });

    test("Purchasing Video recordings with transcripts", async ({ page }) => {

        const usage = new usagePage(page);
        const stripe = new stripePage(page);
        const login = new loginPage(page);

        // Go to Dashboard
        await login.login(userPhoneNumber)

        // Go to Usage Section
        await usage.gotoUsage();

        // Get Video recordings with transcripts
        const initialCount = await usage.getCount("Video recordings with transcripts", "Allowed");
        // console.log("initial Count", initialCount);

        // Click buy more button
        await usage.clickBuyMoreButton("Video recordings with transcripts");

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
        await stripe.clickPay();

        // Verify login page is displayed
        await login.verifyLoginPage();

        // Go to dashboard again
        await login.login(userPhoneNumber)

        // Go to Usage
        await usage.gotoUsage();

        // Get Allowed Conversation Minutes count
        const finalCount = await usage.getCount("Video recordings with transcripts", "Allowed");

        // Verify Converssation mins is increased 
        expect(Number(finalCount)).toEqual(Number(initialCount) + 2)
    });

    test("Purchasing Humee twin", async ({ page }) => {

        const usage = new usagePage(page);
        const stripe = new stripePage(page);
        const login = new loginPage(page);

        // Go to Dashboard
        await login.login(userPhoneNumber)

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
