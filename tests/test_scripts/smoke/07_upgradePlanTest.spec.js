const { test } = require('@playwright/test');
const { upgradePlan } = require('../../pages/upgradePlanPage');

test.describe("Smoke Test - Upgrade Plan Section", () => {
    test("Verifying Upgrade plan page is opening correctly", async ({ page }) => {

        const upgrade = new upgradePlan(page);

        // Go to Dashboard
        await page.goto('/dashboard');

        // Click Profile Menu > Usage
        await upgrade.gotoUpgradePlan();

    });
});
