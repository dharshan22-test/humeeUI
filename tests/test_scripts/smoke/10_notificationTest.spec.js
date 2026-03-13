const { test } = require('../../utils/fixtures/myFixtures');
const { loginPage } = require('../../pages/loginPage');
const { notificationPage } = require('../../pages/notificationPage')

const userPhoneNumber = "6464646464";
const notificationDetails = {
    title: "Test Notification Title",
    message: "This is a test notification message.",
    type: "General",
    blockType: "Non-Sticky",
    targetAudience: "All Users"
};

test.describe("User Activity Tests", () => {
    test("Verifying all the pages in user activity is working as expected", async ({ page }) => {

        const login = new loginPage(page);
        const notification = new notificationPage(page);

        // Go to Dashboard with admin login
        await login.strictAdminLogin(userPhoneNumber, "true")

        // Click Notification Icon
        await notification.clickNotificationIcon();

        // Send Notification to all users
        await notification.enterNotificationInfo(
            notificationDetails.title,
            notificationDetails.message,
            notificationDetails.type,
            notificationDetails.blockType,
            notificationDetails.targetAudience
        );

        // Verify notification toaster is displayed
        await notification.verifyToaster();

        // Verify notification message is displayed
        await notification.verifyNotificationMessage(notificationDetails.message);   

    });

});
