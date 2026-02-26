const { test } = require('../../../utils/fixtures/myFixtures');
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


    });

});
