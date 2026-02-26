const { test } = require('../../../utils/fixtures/myFixtures');
const { usagePage } = require('../../pages/usage');
const { loginPage } = require('../../pages/loginPage');

const phoneNumber = "8622595064";

test.describe("Smoke Test - Usage Section", () => {
    test("Verifying Usage page is opening correctly", async ({ page }) => {

        const usage = new usagePage(page);
        const login = new loginPage(page);

        // Go to Dashboard
        await login.login(phoneNumber)

        // Click Profile Menu > Usage
        await usage.gotoUsage();

    });
});