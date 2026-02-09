const { test } = require('@playwright/test');
const { createHumeeSection } = require('../../pages/createHumeeSection');

const humeeRole = process.env.HUMEE_ROLE;

test.describe("Edit Widget Icon", () => {
    test("Click Edit Widget Icon and verify edit widget page opened correctly", async ({ page }) => {

        const createHumee = new createHumeeSection(page);

        // Go to Dashboard
        await page.goto('/dashboard');

        // Click link icon of required Humee
        await createHumee.clickEditWidgetIcon(humeeRole);

    });
});
