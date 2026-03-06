const { test } = require('../../../utils/fixtures/myFixtures');
const { loginPage } = require('../../../pages/loginPage');
const { userActivity } = require('../../../pages/userActivity');
const { usagePage } = require('../../../pages/usage');

const userPhoneNumber = "6464646464";
const random4DigitNumber = Math.floor(1000 + Math.random() * 9000);
const phoneNumber = `999999${random4DigitNumber}`;
const firstName = `newFirst${random4DigitNumber}`;
const lastName = `newLast${random4DigitNumber}`;
const emailAddress = `em${random4DigitNumber}@testmail.com`;
const legacyPlan = "68f2362c78ec338db7d0c540";
const smallBusinessPlan = "68f2362c78ec338db7d0c542";
const fullName = `${firstName} ${lastName}`;


test.describe.serial("User Activity Tests", () => {
    test("Create a new user with admin login", async ({ page }) => {

        const activity = new userActivity(page);
        const login = new loginPage(page);
        const usage = new usagePage(page);

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

        // Click created user
        await activity.clickCreatedUser(firstName, firstName);

        // Verify user details
        await usage.verifyPlanName("Legacy Plan");

        // Go to User Activity
        await activity.gotoUserActivity();

        // Verify User is created
        await activity.enterSearchName(fullName, emailAddress, phoneNumber, "Legacy Plan");

        // Logout
        await login.clickProfileOption();
        await login.clickLogout();

        // Login as User
        await login.strictLogin(phoneNumber);

        // Go to Usage
        await usage.gotoUsage();

        // Verify Plan Name
        await usage.verifyPlanName("Legacy Plan");

        // Logout
        await login.clickProfileOption();
        await login.clickLogout();

        // Go to Dashboard with admin login
        await login.strictAdminLogin(userPhoneNumber, "true")

        // Go to User Activity
        await activity.gotoUserActivity();

        // Upgrade plan for created user
        await activity.upgradePlan(firstName, smallBusinessPlan)

        // Click created user
        await activity.clickCreatedUser(firstName);

        // Verify user details
        await usage.verifyPlanName("Small Business Plan");

        // Go to User Activity
        await activity.gotoUserActivity();

        // Verify User is updated
        await activity.enterSearchName(fullName, emailAddress, phoneNumber, "Small Business Plan");

        // Logout
        await login.clickProfileOption();
        await login.clickLogout();

        // Login as User
        await login.strictLogin(phoneNumber);

        // Go to Usage
        await usage.gotoUsage();

        // Verify Plan Name
        await usage.verifyPlanName("Small Business Plan");

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
