const { test } = require('@playwright/test');
const { usagePage } = require('../../pages/usage');

test.describe("Smoke Test - Usage Section", () => {
    test("Verifying Usage page is opening correctly", async ({ page }) => {

        const usage = new usagePage(page);

        // Go to Dashboard
        await page.goto('/dashboard');

        // Click Profile Menu > Usage
        await usage.gotoUsage();

    });
});