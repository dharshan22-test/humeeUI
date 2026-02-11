const { test } = require('@playwright/test');
const { loginPage } = require('../../pages/loginPage');
const { conversationPage } = require('../../pages/conversationPage');

const phoneNumber = "8622595064";

test.describe("Smoke Test - Conversation", () => {
    test("Verifying conversation page is opening without any issues", async ({ page }) => {

        const conversation = new conversationPage(page);
        const login = new loginPage(page);

        // Go to Dashboard
        await login.login(phoneNumber)

        // Click link icon of required Humee
        await conversation.gotoConversation();

    });
});
