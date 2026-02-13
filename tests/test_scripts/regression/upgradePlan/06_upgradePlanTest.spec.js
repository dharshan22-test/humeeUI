const { test, expect } = require('@playwright/test');
const { usagePage } = require('../../../pages/usage');
const { stripePage } = require('../../../pages/stripePage');
const { loginPage } = require('../../../pages/loginPage');
const { upgradePlan } = require('../../../pages/upgradePlanPage');

const userPhoneNumber = "8622595064";

test.describe.serial("Upgrade Plan Tests", () => {
    test("Upgrade to Legacy or Small Business Plan", async ({ page }) => {

        const usage = new usagePage(page);
        const stripe = new stripePage(page);
        const login = new loginPage(page);
        const upgrade = new upgradePlan(page);

        // Go to Dashboard
        await login.login(userPhoneNumber)

        // Go to Usage Section
        await usage.gotoUsage();

        // Get the plan name
        const planNameUsage = await usage.getPlanName();

        // Go to upgrade plan page
        await upgrade.gotoUpgradePlan();

        // Get Current Plan Name
        const planNameUpgradePlan = await upgrade.getCurrentPlan();

        // Validating plan name in usage section is as equal to plan name in upgrade section
        expect(planNameUsage).toContain(planNameUpgradePlan);

        // Upgrade Plan
        const {planName, cost} = await upgrade.selectRequiredPlan();

        // Select required Twin
        await usage.selectRequiredTwin();

        // Click Stripe Page
        await stripe.verifySandbox();

        // Verify amount is displayed correctly in Stripe page
        await stripe.verifyAmount(cost);

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

        // Get the plan name
        const finalPlanNameUsage = await usage.getPlanName();

        // Go to upgrade plan page
        await upgrade.gotoUpgradePlan();

        // Get Current Plan Name
        const finalPlanNameUpgradePlan = await upgrade.getCurrentPlan();

        // Validating plan name in usage section is as equal to plan name in upgrade section
        expect(finalPlanNameUsage).toContain(finalPlanNameUpgradePlan);
        expect(finalPlanNameUsage).toContain(planName);

    });

});
