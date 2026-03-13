const { test } = require('../../../utils/fixtures/myFixtures');
const { loginPage } = require('../../../pages/loginPage');
const { userActivity } = require('../../../pages/userActivity');
const { usagePage } = require('../../../pages/usage');
const { waitForLatestEmail } = require('../../../utils/helper/gmailHelper');

const userPhoneNumber = "6464646464";
const random4DigitNumber = Math.floor(1000 + Math.random() * 9000);
const phoneNumber = `999999${random4DigitNumber}`;
const firstName = `newFirst${random4DigitNumber}`;
const lastName = `newLast${random4DigitNumber}`;
const emailAddress = "ydtest22@gmail.com";
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

        // Time starts to get the latest mail after this point as the mail for new user creation will be triggered after this step
        const mailCheckStartedAt = new Date();

        // Enter user info
        await activity.enterNewUserInfo(firstName, lastName, emailAddress, phoneNumber, legacyPlan);

        // Wait until page gets reloaded
        await activity.waitTillTableReloads();

        // Verifying mail is received for successful purchase with correct amount
        const latestMail = await waitForLatestEmail({
            dateNow: mailCheckStartedAt,
            subjectContains: "Payment Successful! Your Subscription is Active!",
            bodyContains: `Hi ${firstName}`
        });
        // console.log("Correct billing email received:", latestMail.subject);

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

        // Time starts to get the latest mail after this point as the mail for new user creation will be triggered after this step
        const mailCheckStartedAtTwo = new Date();

        // Upgrade plan for created user
        await activity.upgradePlan(firstName, smallBusinessPlan)

        // Verifying mail is received for successful purchase with correct amount
        const latestMailTwo = await waitForLatestEmail({
            dateNow: mailCheckStartedAtTwo,
            subjectContains: "Subscription is Upgraded",
            bodyContains: "Small Business Plan"
        });
        console.log("Correct billing email received:", latestMailTwo.subject);

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
