const { test } = require('@playwright/test');
const { conversationPage } = require('../../pages/conversationPage');

test.describe("Smoke Test - Conversation", () => {
    test("Verifying conversation page is opening without any issues", async ({ page }) => {

        const conversation = new conversationPage(page);

        // Go to Dashboard
        await page.goto('/dashboard');

        // Click link icon of required Humee
        await conversation.gotoConversation();

    });
});
