const { expect } = require('@playwright/test');

async function getPublicIp() {
    const res = await fetch('https://api.ipify.org?format=json');
    const { ip } = await res.json();
    return ip;
}

exports.conversationPage = class coversationPage {

    /**
     * @param {import('@playwright/test').Page} page
     */

    constructor(page) {
        this.page = page;
    }

    // Go to Conversation
    async gotoConversation() {
        await this.page.locator("span.nav-menu-text").filter({ hasText: "Conversations" }).click();
        await expect(this.page.locator("div.conversations-table>div.table-body")).toBeVisible();
    }

    // Verifying Conversation Table
    async verifyConversationTable(humeeName, date, customerName, customerMobile, email, ip, status) {

        await expect(this.page.locator(`//div[@class='conversations-table']//div[contains(text(),'${humeeName}')]/../div[text()='${date}']`).nth(0)).toBeVisible();
        await expect(this.page.locator(`//div[@class='conversations-table']//div[contains(text(),'${humeeName}')]/../div[text()='${customerName}']`).nth(0)).toBeVisible();
        await expect(this.page.locator(`//div[@class='conversations-table']//div[contains(text(),'${humeeName}')]/../div[text()='${customerMobile}']`).nth(1)).toBeVisible();
        await expect(this.page.locator(`//div[@class='conversations-table']//div[contains(text(),'${humeeName}')]/../div[text()='${email}']`).nth(2)).toBeVisible();
        await expect(this.page.locator(`//div[@class='conversations-table']//div[contains(text(),'${humeeName}')]/../div[text()='${ip}']`).nth(0)).toBeVisible();
        await expect(this.page.locator(`//div[@class='conversations-table']//div[contains(text(),'${humeeName}')]/../div/span[text()='${status}']`).nth(0)).toBeVisible();

        // if (status == 'active') {
        //     await expect(this.page.locator(`//div[text()='${date}']/following-sibling::div[text()='${humeeName}']`).nth(0)).not.toBeEnabled();
        // } if (status == 'ended') {
        //     await expect(this.page.locator(`//div[text()='${date}']/following-sibling::div[text()='${humeeName}']`).nth(0)).toBeEnabled();
        // }
    }

    // Click the required conversation to open
    async openConversation(date, humeeName) {
        await this.page.locator(`//div[text()='${date}']/following-sibling::div[text()='${humeeName}']`).nth(0).click();
    }

    // Get Conversation ID
    async verifyConvId() {
        await expect(this.page.locator("//span[@class='detail-value-convo' and text()='Twin-1764752031504']")).toBeVisible();
        const convID = await this.page.locator("//div[@class='chat-history-sidebar']/div/div/span[text()='ID:']/following-sibling::span").textContent();
        // console.log("convID", convID);
        await expect(this.page.locator(`//span[contains(@class,'conversation-id-header') and contains(normalize-space(.),'${convID}')]`)).toBeVisible();
    }

    // Verifying Conversation info is displayed as expected
    async verifyConversationDetails(convName, humeeName, twinName, ip, status, created) {

        const expectedTexts = [
            convName, humeeName, twinName, ip, status, created
        ];

        for (const text of expectedTexts) {
            await expect(this.page.locator(`//div[@class='chat-history-sidebar']/div/div/span[text()='${text}']`)).toBeVisible();
        }
    }

    // Verifying the conversation text from user and AI reply
    async verifyConvText(humeeName) {
        await expect(this.page.locator("//div[@class='message user']/div/div[text()='What is your name?']")).toBeVisible();
        await expect(this.page.locator(`//div[@class='message assistant']/div/div[contains(text(),'${humeeName}')]`)).toBeVisible();
    }

    // Verify recording link is there in conversation tab
    async verifyRecordedVideo() {
        const videoLink = await this.page.locator("//div[@class='video-player-section']/div/video").getAttribute('src');
        expect(videoLink).toContain('amazonaws.com');

        // Open in a new tab
        const newPage = await this.page.context().newPage();
        await newPage.goto(videoLink);
        await expect(newPage.locator("body>video[name='media']")).toBeVisible();
        await newPage.close();
    }

    // Click back button from conversation tab
    async clickBackButton() {
        await this.page.locator("button.back-btn-details").click();
        await expect(this.page.locator("div.conversations-header-row>h2").filter({ hasText: "My Conversations List" })).toBeVisible();
    }

    // Enter search input in conversation
    async enterConversationSearch(humeeName) {
        await this.page.locator("div.conversation-search-section>div>input").pressSequentially(humeeName);
    }

    // Verify all rows are showing only the searched text
    async verifySearchFunction(humeeName) {
        // We have to wait before using ocunt method, looking for perfect loaders, until then, having 3 sec timeout
        await this.page.waitForTimeout(3000);
        const rowCount = await this.page.locator("//div[@class='table-row ']").count();

        for (let i = 1; i <= rowCount; i++) {
            await expect(this.page.locator(`(//div[@class='table-cell persona_name'])[${i}]`)).toContainText(humeeName);
        }

    }

    // Getting the ip address
    async getPublicIp() {
        return await getPublicIp();
    }

}