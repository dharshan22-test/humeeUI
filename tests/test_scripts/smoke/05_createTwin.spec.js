const { test } = require('@playwright/test');
const { createTwinPage } = require('../../pages/createTwin');

test.describe("Smoke Test - Create Twin", () => {
    test("Verifying Create Twin page is opening without any issues", async ({ page }) => {

        const twin = new createTwinPage(page);

        // Go to Dashboard
        await page.goto('/dashboard');

        // Click link icon of required Humee
        await twin.gotoCreateTwin();

    });
});
