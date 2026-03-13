const { expect } = require('@playwright/test');

exports.notificationPage = class NotificationPage {

    /**
     * @param {import('@playwright/test').Page} page
     */

    constructor(page) {
        this.page = page;
    }

    // Click Notification Icon
    async clickNotificationIcon() {
        await this.page.locator("button.notification-bell-button ").click();
    }

    // Enter notification info
    async enterNotificationInfo(
        notificationTitle,
        notificationMessage,
        notificationType,
        blockType,
        targetAudience,
        specificUsers = []
    ) {
        await this.page.getByPlaceholder("Enter notification title").fill(notificationTitle);
        await this.page.getByPlaceholder("Enter notification message").fill(notificationMessage);
        await this.page.locator("//label[text()='Type']/../div/select").selectOption(notificationType);
        await this.page.locator("//label[text()='Block Type']/../div/select").selectOption(blockType);
        await this.page.locator("//label[text()='Target Audience ']/../div/select").selectOption(targetAudience);

        if (targetAudience === "Specific Users") {
            await this.page.locator("div.user-select-input").click();

            const count = specificUsers.length;

            for (let i = 0; i < count; i++) {
                const firstName = specificUsers[i];
                await this.page.locator(`//span[@class='user-name' and contains(text(),'${firstName}')]/../input`).check();
            }
        }
    }



}