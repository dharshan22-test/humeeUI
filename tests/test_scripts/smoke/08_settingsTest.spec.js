const { test } = require('@playwright/test');
const { settingsPopup } = require('../../pages/settingsPopup');

test.describe("Smoke Test - Settings Section", () => {
    test("Verifying Settings popup page is opening correctly", async ({ page }) => {

        const settings = new settingsPopup(page);

        // Go to Dashboard
        await page.goto('/dashboard');

        // Click Profile Menu > Usage
        await settings.gotoSettings();

    });
});
