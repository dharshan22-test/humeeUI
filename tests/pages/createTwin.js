const { expect } = require('@playwright/test');

exports.createTwinPage = class createTwinPage {

    /**
     * @param {import('@playwright/test').Page} page
     */

    constructor(page) {
        this.page = page;
        this.videoLink = "https://meet-humee.s3.us-west-1.amazonaws.com/videos/Joel+01.mp4";
    }

    // Go to Create Twin
    async gotoCreateTwin() {
        await this.page.locator("span.nav-menu-text").filter({ hasText: "Create Twin" }).click();
        await expect(
            this.page.locator("//main[@class='main-content']//h2[text()='Get started with your Twin in 3 simple steps']"))
            .toBeVisible();
    }

    // Click Get startd button in Create Twin
    async clickGetStarted() {
        await this.page.locator("button.btn-primary-Twin").click();
    }

    // Upload consent video
    async uploadConsentVideo() {
        await this.page.locator("div[class='step-item active collapsed collapsed ']>div>div>h3").filter({ hasText: "Consent Video" }).click();
        await this.page.locator("button.tab-btn >i[class='fas fa-upload']").click();
        await this.page.locator("input#videoUrl").fill(this.videoLink);
        await this.page.locator("button.url-submit-btn").click();
    }

    // Verify consent video is uploaded
    async verifyConsentVideo() {
        const consentURL = await this.page.locator("div.preview-actions+video").getAttribute('src');
        expect(consentURL).toEqual(this.videoLink);
    }

    //check checkall video in required section
    async checkAllVideoRequirement() {
        await this.page.locator("input#uploadCheckAll").check();

        await expect(this.page.locator("input#uploadClearVoice")).toBeChecked();
        await expect(this.page.locator("input#uploadNoHands")).toBeChecked();
        await expect(this.page.locator("//input[contains(@id,'uploadHead')]")).toBeChecked();
        await expect(this.page.locator("//input[contains(@id,'uploadClothes')]")).toBeChecked();
    }

    // Click confirm button in upload video
    async confirmUploadConsentVideo() {
        await this.page.locator("button.btn-primary-CreateHumee").click();
    }

    // Wait until video gets uploaded
    async waitUntilLoader() {
        try {
            await expect(this.page.locator("p.loader-message")).toBeVisible();
            await expect(this.page.locator("p.loader-message")).toBeHidden({ timeout: 300000 }); // 5 mins timeout
        } catch (error) { }
    }

    // Upload training video
    async uploadTrainingVideo() {
        await this.page.locator("div[class='step-item active collapsed collapsed ']>div>div>h3").filter({ hasText: "Training Video" }).click();
        await this.page.locator("button.training-tab-btn >i[class='fas fa-upload']").click();
        await this.page.locator("input#videoUrl").fill(this.videoLink);
        await this.page.locator("button.url-submit-btn").click();
    }

    // Confirm upload training Video
    async confirmUploadTrainingVideo() {
        await this.page.locator("button.btn-primary").click();
    }

    // Confirm creating humee twin
    async confirmTwin() {
        await this.page.locator("button[class='btn-primary-CreateHumee submit-btn']").click();
    }

    // Get Replicate Value
    async getTwinValue() {
        const replicaValue = await this.page.locator("span.replica-id-value").textContent();
        await this.page.locator("button[class='btn-primary-CreateHumee finish-btn']").click();
        return replicaValue;
    }

    // Verify created digital twin is displayed in the options
    async verifyTwinInOptions(twinID) {
        const twinFullID = `Twin-${twinID}`;
        await expect(this.page.locator("button[title='View Twin List']")).toBeVisible();
        await expect(this.page.locator("div.item-info>h4").filter({ hasText: twinFullID })).toBeVisible();
        await expect(this.page.locator(`//h4[text()='twinFullID']/following-sibling::span[text()='training']`)).toBeVisible();
    }

    // Get Humee count
    async getDigitalTwinCount() {
        await expect(this.page.locator("button[title='View Twin List']")).toBeVisible();
        const twincount = await this.page.locator("div.item-info>h4").count();
        await this.page.locator("button.close-btn-TwinList").click();
        return twincount;
    }

    // Click options
    async clickOption() {
        try {
            await expect(this.page.locator("button.close-btn-TwinList")).toBeVisible({ timeout: 8000 });
        } catch {
            await this.page.locator("button.floating-twin-list-btn").click();
        }
    }

    // Scroll to the bottom of the container
    async scrollToBottomOfTwinList(maxScrolls = 10) {
        const items = this.page.locator('.replicas-list-TwinList .list-item');

        let prevCount = 0;

        for (let i = 0; i < maxScrolls; i++) {
            await this.page.waitForTimeout(3000);
            const count = await items.count();
            if (count === prevCount) break;

            prevCount = count;
            await items.last().scrollIntoViewIfNeeded();
            await this.page.waitForTimeout(400);
        }
    }

    

}