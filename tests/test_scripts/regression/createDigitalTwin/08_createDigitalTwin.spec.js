const { test, expect } = require('@playwright/test');
const { loginPage } = require('../../../pages/loginPage');
const { createTwinPage } = require('../../../pages/createTwin');
const { upgradePlan } = require('../../../pages/upgradePlanPage');
const { stripePage } = require('../../../pages/stripePage');
const { log } = require('node:console');

const userPhoneNumber = "8622595064";

test.describe.serial("Create Twin page tests", () => {

    test("Buy a digital Twin to create one", async ({ page }) => {

        const login = new loginPage(page);
        const createTwin = new createTwinPage(page);
        const upgrade = new upgradePlan(page);
        const stripe = new stripePage(page);

        // Go to Dashboard
        await login.login(userPhoneNumber);

        // Go to Create Twin
        await createTwin.gotoCreateTwin();

        // Click get started
        await createTwin.clickGetStarted();

        // Buy humee digital twin
        await upgrade.clickBuyNowTwin();

        // Click Stripe Page
        await stripe.verifySandbox();

        // Verify amount is displayed correctly in Stripe page
        await stripe.verifyAmount('2,500');

        // Enter card information
        await stripe.enterCardInformation();

        // Click pay button
        await stripe.clickPay();

        // Verify login page is displayed
        await login.verifyLoginPage();


    })
    test("Creating twin by upload S3 URL", async ({ page }) => {

        const login = new loginPage(page);
        const createTwin = new createTwinPage(page);

        // Go to Dashboard
        await login.strictLogin(userPhoneNumber);

        // Go to Create Twin
        await createTwin.gotoCreateTwin();
        await page.waitForTimeout(5000);

        // Click Option
        await createTwin.clickOption();

        // Scroll to the bottom of the container
        await createTwin.scrollToBottomOfTwinList();

        // Get the twin count
        const initialCount = await createTwin.getDigitalTwinCount();

        // Click get started
        await createTwin.clickGetStarted();

        // Upload Consent Video
        await createTwin.uploadConsentVideo();

        // Verify Consent Video is uploaded
        await createTwin.verifyConsentVideo();

        // Check all Checkbox
        await createTwin.checkAllVideoRequirement();

        // Confirm consent video
        await createTwin.confirmUploadConsentVideo();

        // Wait till the loader disappears
        await createTwin.waitUntilLoader();

        // Upload training Video
        await createTwin.uploadTrainingVideo();

        // Check all Checkbox
        await createTwin.checkAllVideoRequirement();

        // Confirm training video
        await createTwin.confirmUploadTrainingVideo();

        // Wait for the loader
        await createTwin.waitUntilLoader();

        // Confirm twin upload
        await createTwin.confirmTwin();

        // Wait till the loader
        await createTwin.waitUntilLoader();

        // get the replicate value
        const twinId = await createTwin.getTwinValue();

        // Go to Create Twin
        await createTwin.gotoCreateTwin();

        // Get count
        await createTwin.clickOption();

        // Scroll to the bottom of the container
        await createTwin.scrollToBottomOfTwinList();

        // Get Final twin count
        const finalTwinCount = await createTwin.getDigitalTwinCount();

        // Verify final twin count is one more than inital twin
        expect(finalTwinCount).toEqual(initialCount+1);

    });

});
