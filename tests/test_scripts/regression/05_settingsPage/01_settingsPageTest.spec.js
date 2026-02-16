const { test } = require('@playwright/test');
const { loginPage } = require('../../../pages/loginPage');
const { settingsPopup } = require('../../../pages/settingsPopup');

const userPhoneNumber = "8622595064";

// Generate random name (max length 10)
const generateRandomName = (maxLength = 10) =>
    Math.random().toString(36).replace(/[^a-z]/g, '').slice(0, maxLength);

test.describe.serial("Settings Page Tests", () => {
    test("Update all info in Settings Popup", async ({ page }) => {

        const login = new loginPage(page);
        const settings = new settingsPopup(page);

        const firstName = generateRandomName(10);
        const lastName = generateRandomName(10);

        // Go to Dashboard
        await login.login(userPhoneNumber)

        // open settings
        await settings.gotoSettings();

        // Verify Email ID and Phone number is not editable
        await settings.nonEditableFields();

        // Remove profile picture
        await settings.removeProfilePic();

        // Upload profile picture
        await settings.uploadProfilePic();

        // Enter Name
        await settings.enterName(firstName, lastName);

        // Click save button
        await settings.clickSaveChanges();

        // Verify name is displayed
        await settings.verifyName(firstName, lastName);

        // Verify profile picture
        await settings.verifyImage();

    });

});
