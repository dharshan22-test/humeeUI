const { test } = require('../../../utils/fixtures/myFixtures');
const { loginPage } = require('../../../pages/loginPage');
const { userActivity } = require('../../../pages/userActivity');

const userPhoneNumber = "6464646464";
const random4DigitNumber = Math.floor(1000 + Math.random() * 9000);
const phoneNumber = Math.floor(1e9 + Math.random() * 9e9);
const firstName = `newFirst${random4DigitNumber}`;
const lastName = `newLast${random4DigitNumber}`;
const emailAddress = `em${random4DigitNumber}@testmail.com`;
const legacyPlan = "68f2362c78ec338db7d0c540";
const fullName = `${firstName} ${lastName}`;


test.describe.serial("User Activity Tests", () => {
    test("Create a new user with admin login", async ({ page }) => {

        const activity = new userActivity(page);
        const login = new loginPage(page);

        // Go to Dashboard with admin login
        await login.strictAdminLogin(userPhoneNumber, "true")

        // Go to User Activity
        await activity.gotoUserActivity();

        // click create new User
        await activity.clickCreateUser();

        // Enter user info
        await activity.enterNewUserInfo(firstName, lastName, emailAddress, phoneNumber, legacyPlan);

        // Wait until page gets reloaded
        await activity.waitTillTableReloads();

        // Verify User is created
        await activity.enterSearchName(fullName, emailAddress, phoneNumber, "Legacy Plan");
        await page.pause();
        // Logout
        await login.clickProfileOption();
        await login.clickLogout();

        // Login as User
        await login.login(phoneNumber);

        // Logout
        await login.clickProfileOption();
        await login.clickLogout();

        // Go to Dashboard with admin login
        await login.strictAdminLogin(userPhoneNumber, "true")

        // Go to User Activity
        await activity.gotoUserActivity();

        // Delete User
        await activity.deleteUser(firstName);

        // Clear Search
        await activity.clearSearch();

        // Verify user name is not displayed
        await activity.nameRemoved(fullName, emailAddress, phoneNumber, "Legacy Plan");

    });

});
