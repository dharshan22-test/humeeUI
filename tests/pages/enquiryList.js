const { expect } = require('@playwright/test');

exports.enquiryList = class enquiryList {

    /**
     * @param {import('@playwright/test').Page} page
     */

    constructor(page) {
        this.page = page;
    }

    // Go to Enquiry List tab
    async gotoEnquiryList(){
        await this.page.locator("div.nav-tabs-container>button").filter({ hasText: "Enquiry List" }).click();
        await expect(this.page.locator("div.table-data-container")).toBeVisible();
    }

    // Formatting the plan 10 digit number to US format
    async usFormatting(number) {
        const digits = String(number).replace(/\D/g, '');

        if (digits.length !== 10) {
            throw new Error('Input must be a 10-digit number');
        }

        return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }

    // Fill search name in search input
    async enterSearchName(firstName, lastName, emailAddress, companyName, mobileNumber, message) {
        const phoneNumber = await this.usFormatting(mobileNumber);
        const tableLocator = "div.table-container>div>table>tbody>tr>td";
        await this.page.locator("div.search-controls>div>input").pressSequentially(firstName, { delay: 100 });
        await expect(this.page.locator("div.table-container>div>table>tbody>tr")).toHaveCount(1);

        await expect(this.page.locator(tableLocator).filter({ hasText: firstName })).toBeVisible();
        await expect(this.page.locator(tableLocator).filter({ hasText: lastName })).toBeVisible();
        await expect(this.page.locator(tableLocator).filter({ hasText: emailAddress })).toBeVisible();
        await expect(this.page.locator(tableLocator).filter({ hasText: companyName })).toBeVisible();
        await expect(this.page.locator(tableLocator).filter({ hasText: phoneNumber })).toBeVisible();
        await expect(this.page.locator(tableLocator).filter({ hasText: message })).toBeVisible();
        await expect(this.page.locator(tableLocator).filter({ hasText: "Family Legacy Website" })).toBeVisible();
    }



}