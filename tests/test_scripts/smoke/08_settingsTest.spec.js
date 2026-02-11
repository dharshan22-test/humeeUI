const { test } = require('@playwright/test');
const { settingsPopup } = require('../../pages/settingsPopup');
const { loginPage } = require('../../pages/loginPage');

const phoneNumber = "8622595064";

test.describe("Smoke Test - Settings Section", () => {
    test("Verifying Settings popup page is opening correctly", async ({ page }) => {

        const settings = new settingsPopup(page);
        const login = new loginPage(page);

        // Go to Dashboard
        await login.login(phoneNumber)

        // Click Profile Menu > Usage
        await settings.gotoSettings();

    });
});
