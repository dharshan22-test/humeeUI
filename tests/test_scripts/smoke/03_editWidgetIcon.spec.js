const { test } = require('@playwright/test');
const { loginPage } = require('../../pages/loginPage');
const { createHumeeSection } = require('../../pages/createHumeeSection');

const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../../utils/testData/humeeNames.json');
const phoneNumber = "8622595064";

const humeeData = JSON.parse(
    fs.readFileSync(dataPath, 'utf-8')
);

const { humeeRole } = humeeData;

test.describe("Edit Widget Icon", () => {
    test("Click Edit Widget Icon and verify edit widget page opened correctly", async ({ page }) => {

        const createHumee = new createHumeeSection(page);
        const login = new loginPage(page);

        // Go to Dashboard
        await login.login(phoneNumber)

        // Click link icon of required Humee
        await createHumee.clickEditWidgetIcon(humeeRole);

    });
});
