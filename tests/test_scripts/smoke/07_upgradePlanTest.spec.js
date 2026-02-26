const { test } = require('../../utils/fixtures/myFixtures');
const { upgradePlan } = require('../../pages/upgradePlanPage');
const { loginPage } = require('../../pages/loginPage');

const phoneNumber = "8622595064";

test.describe("Smoke Test - Upgrade Plan Section", () => {
    test("Verifying Upgrade plan page is opening correctly", async ({ page }) => {

        const upgrade = new upgradePlan(page);
        const login = new loginPage(page);

        // Go to Dashboard
        await login.login(phoneNumber)

        // Click Profile Menu > Usage
        await upgrade.gotoUpgradePlan();

    });
});
