const { test } = require('@playwright/test');
const { createHumeeSection } = require('../../pages/createHumeeSection');

const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../../utils/testData/humeeNames.json');

const humeeData = JSON.parse(
    fs.readFileSync(dataPath, 'utf-8')
);

const { humeeRole } = humeeData;

test.describe("Edit Widget Icon", () => {
    test("Click Edit Widget Icon and verify edit widget page opened correctly", async ({ page }) => {

        const createHumee = new createHumeeSection(page);

        // Go to Dashboard
        await page.goto('/dashboard');

        // Click link icon of required Humee
        await createHumee.clickEditWidgetIcon(humeeRole);

    });
});
