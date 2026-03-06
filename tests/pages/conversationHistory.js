const { expect } = require('@playwright/test');

exports.conversationHistory = class conversationHistory {

    /**
     * @param {import('@playwright/test').Page} page
     */

    constructor(page) {
        this.page = page;
    }

    // Go to Conversation History tab
    async gotoConversationHistory(){
        await this.page.locator("div.nav-tabs-container>button").filter({ hasText: "Conversation History" }).click();
        await expect(this.page.locator("div.table-data-container")).toBeVisible();
    }



}