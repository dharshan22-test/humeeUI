const { expect } = require('@playwright/test');
const { lstatSync } = require('node:fs');

exports.website = class website {
    /**
     * @param {import('@playwright/test').Page} page
     */

    constructor(page) {
        this.page = page;
    }

    
    // Go to Humee Website
    async gotoHumeeWebsite(){
        await this.page.goto(process.env.APPLICATION_URL);
    }

    // Connect with Humee in the home page
    async connectWithHumee(){
        await this.page.click("(//div/a[contains(@href,'https://chat')])[1]");
    }

    // Click Pricing 
    async clickPricing(){
        await this.page.click("//div[@id='showcase']//div/button[text()='Pricing']");
    }

    // Click the first enquire now button
    async clickEnquireNow(){
        await this.page.locator("//h3[text()='Family Legacy Website']/../..//button[text()='Enquire Now']").nth(0).click();
    }

    // Enter Enquiry Info
    async fillEnquiryForm(){
        await this.page.fill("input[name='firstName']",firstName);
        await this.page.locator("input[name='lastName']").fill(lastName);
        await this.page.locator("input[name='workEmail']").fill(emailAddress);
        await this.page.locator("input[name='companyName']").fill(companyName);
        await this.page.locator("input[name='mobileNumber']").fill(moblieNumber);
        await this.page.locator("textarea[name='message']").fill(message);
        await this.page.locator("//button[text()='Submit Enquiry']").click();
        await expect(this.page.locator("//h2[text()='Enquiry Submitted Successfully!']")).toBeVisible();
        await this.page.locator("//button[text()='OK']").click();
    }



    
}
