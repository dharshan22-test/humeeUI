const { test } = require('@playwright/test');
const { createTwinPage } = require('../../pages/createTwin');
const { loginPage } = require('../../pages/loginPage');

const phoneNumber = "8622595064";

test.describe("Smoke Test - Create Twin", () => {
    test("Verifying Create Twin page is opening without any issues", async ({ page }) => {

        const twin = new createTwinPage(page);
        const login = new loginPage(page);

        // Go to Dashboard
        await login.login(phoneNumber)

        // Click link icon of required Humee
        await twin.gotoCreateTwin();

    });
});
