const { expect } = require('@playwright/test');

exports.userActivity = class userActivity {

    /**
     * @param {import('@playwright/test').Page} page
     */

    constructor(page) {
        this.page = page;
    }

    // Go to User Activity
    async gotoUserActivity() {
        await this.page.locator("div.profile-container").click();
        await this.page.locator("button.activity-btn").click();
        await expect(this.page.locator("div.stats-cards-container")).toBeVisible();
    }

    // Click create user button
    async clickCreateUser() {
        await this.page.locator("button.create-user-btn").click();
    }

    // Enter New User details
    async enterNewUserInfo(firstName, lastName, email, phoneNumber, planName) {
        await this.page.locator("//label[contains(text(),'First')]/following-sibling::input").fill(firstName);
        await this.page.locator("//label[contains(text(),'Last')]/following-sibling::input").fill(lastName);
        await this.page.fill("//label[contains(text(),'Email')]/following-sibling::input", email);
        await this.page.fill("input.phone-input", String(phoneNumber));
        await this.page.locator("div.user-form-group>select").selectOption(planName);
        await this.page.click("button.btn-submit");
        await expect(this.page.locator("div#swal2-html-container")).toHaveText("User created successfully!");
        await this.page.locator("//button[text()='OK']").click();
    }

    // Fill search name in search input
    async enterSearchName(searchName, emailAddress, mobileNumber, planName) {
        const phoneNumber = await this.usFormatting(mobileNumber);
        const tableLocator = "div.table-container>div>table>tbody>tr>td";
        await this.page.locator("div.search-controls>div>input").pressSequentially(searchName, { delay: 100 });
        await expect(this.page.locator("div.table-container>div>table>tbody>tr")).toHaveCount(1);

        await expect(this.page.locator(tableLocator).filter({ hasText: emailAddress })).toBeVisible();
        await expect(this.page.locator(tableLocator).filter({ hasText: phoneNumber })).toBeVisible();
        await expect(this.page.locator(tableLocator).filter({ hasText: planName })).toBeVisible();
        await expect(this.page.locator(tableLocator).filter({ hasText: searchName })).toBeVisible();
    }

    // Verify search name is not visible
    async nameRemoved(searchName, emailAddress, mobileNumber, planName) {
        const phoneNumber = await this.usFormatting(mobileNumber);
        const tableLocator = "div.table-container>div>table>tbody>tr>td";
        await this.page.locator("div.search-controls>div>input").pressSequentially(searchName, { delay: 100 });
        await expect(this.page.locator("div.table-container>div>table>tbody>tr")).toHaveCount(0);

        await expect(this.page.locator(tableLocator).filter({ hasText: emailAddress })).not.toBeVisible();
        await expect(this.page.locator(tableLocator).filter({ hasText: phoneNumber })).not.toBeVisible();
        await expect(this.page.locator(tableLocator).filter({ hasText: planName })).not.toBeVisible();
        await expect(this.page.locator(tableLocator).filter({ hasText: searchName })).not.toBeVisible();
    }

    // Clear the search input
    async clearSearch() {
        await this.page.locator("div.search-controls>div>input").clear();
    }

    // Delete User
    async deleteUser(firstName) {
        await this.page.click(`//td[text()='${firstName}']/..//button[@class='delete-user-btn']`);
        await this.page.locator("button.conversation-delete-confirm-btn").click();
        await this.page.locator("div.swal2-actions>button").filter({ hasText: 'OK' }).click();
        await this.waitTillTableReloads();
        await expect(this.page.locator(`//td[text()='${firstName}']/..//button[@class='delete-user-btn']`)).not.toBeVisible();
    }

    // Click Visitors
    async clickVisitors() {
        await this.page.locator("//button[text()='Visitors Details']").click();
    }

    // Wait until table gets reloaded
    async waitTillTableReloads() {
        try {
            await expect(this.page.locator("div.table-container")).toBeVisible({ timeout: 6000 });
            await expect(this.page.locator("div.table-container")).toBeHidden({ timeout: 6000 });
            await expect(this.page.locator("div.table-container")).toBeVisible({ timeout: 6000 });
        } catch { }
    }

    // Formatting the plan 10 digit number to US format
    async usFormatting(number) {
        const digits = String(number).replace(/\D/g, '');

        if (digits.length !== 10) {
            throw new Error('Input must be a 10-digit number');
        }

        return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }

    // Click created user
    async clickCreatedUser(firstName) {
        await this.page.locator(`//div[@class='table-container']//tr//td[text()='${firstName}']`).click();
        await expect(this.page.locator("span.user-selector-label")).toContainText(firstName);
    }

    // Upgrade plan for created user
    async upgradePlan(firstName, planName) {
        const upgradeButtonLocator = `//div[@class='table-container']//td[text()='${firstName}']/following-sibling::td//button[@class='upgrade-btn-premium purple-theme']`;
        await this.page.locator(upgradeButtonLocator).click();
        await this.page.locator("select.upgrade-plan-dropdown ").selectOption(planName);
        await this.page.locator("button.upgrade-confirm-btn").click();
        await this.page.locator("button.swal2-confirm").click();
        await expect(this.page.locator(upgradeButtonLocator)).toBeVisible();    
    }

}