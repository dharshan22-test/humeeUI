const { expect } = require('@playwright/test');
const QrDecoder = require('../utils/helper/qrDecoder');
const path = require('path');
const fs = require('fs');

exports.createHumeeSection = class createHumeeSection {

    /**
     * @param {import('@playwright/test').Page} page
     */

    constructor(page) {
        this.page = page;
        this.qrDecoder = new QrDecoder();
    }

    //Select Required Twin
    async selectRequiredTwin(twinID) {
        await this.page.locator(".PersonaCreate-replica-selector ").click();
        await this.page.locator("div[class='replica-card ']>h4").filter({ hasText: twinID }).click();
        await this.page.locator("div[class='modal-footer2']>button.select-btn").click();
    }

    // Enter Humee Name
    async enterHumeeName(name) {
        await this.page.locator(".humee-name-section").locator("input").pressSequentially(name);
    }

    // Select Humee Role
    async enterHumeeRole(role) {
        const humeeRoleLocator = this.page.locator(".persona-role-section>div>input");

        await humeeRoleLocator.clear();
        await humeeRoleLocator.click();
        await expect(humeeRoleLocator).toBeEditable();
        await humeeRoleLocator.fill(role);
    }

    // Edit System Prompt
    async enterSystemPrompt(systemPrompt) {
        await this.page.locator("div.system-prompt-section>textarea").pressSequentially(systemPrompt, { delay: 10 });
    }

    // Edit Humee Context
    async enterHumeeContext(humeeContext) {
        await this.page.locator("div.persona-context-section>textarea").pressSequentially(humeeContext, { delay: 10 });
    }

    // clear Humee Role
    async clearHumeeRole() {
        await this.page.locator(".persona-role-section>div>input").clear();
    }

    // clear System Prompt
    async clearSystemPrompt() {
        await this.page.locator("div.system-prompt-section>textarea").clear();
    }

    // clear Humee Context
    async clearHumeeContext() {
        await this.page.locator("div.persona-context-section>textarea").clear();
    }

    // Add PDF in Knowledge Base
    async uploadKnowledgeBaseFileUsingFileUploadWindow(filePath) {
        await this.page.locator("div.layer-content").click();
        await this.page.locator("input#knowledgeBaseUpload").click();
        const fileChooserPromise = this.page.waitForEvent('filechooser');
        await this.page.locator("input#knowledgeBaseUpload").click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(path.join(filePath));
        await expect(this.page.locator("button.knowledge-base-btn-primary")).toBeEnabled();
        await this.page.locator("button.knowledge-base-btn-primary").click();
    }

    // Add PDF in Knowledge Base
    async uploadKnowledgeBaseFile(filePath) {
        await this.page.locator("div.layer-content").click();
        await this.page.locator("input#knowledgeBaseUpload").setInputFiles(filePath)
        await this.page.locator("button.knowledge-base-btn-primary").click();
    }

    // Remove exiting file from knowledge base
    async removeKnowledgeBaseFile(oldFileName) {
        await this.page.locator("div.layer-content").click();

        const knowledgeBaseFile = this.page.locator("div.knowledge-base-document-name").filter({ hasText: oldFileName });

        if (await knowledgeBaseFile.isVisible()) {
            await this.page.locator("button.knowledge-base-remove-btn").click();
            await this.page.locator("button.conversation-delete-confirm-btn").click();
            await expect(knowledgeBaseFile).not.toBeVisible();
        }
        await this.page.locator("button.knowledge-base-close-btn").click();
    }

    // Click Create Humee Button
    async clickCreateHumee() {
        await this.page.locator("button.create-persona-btn").click();
        await expect(this.page.locator("div.modal-header-Success")).toBeVisible({ timeout: 60000 });
    }

    // Click update buton
    async clickUpdateHumee() {
        await this.page.locator("button.create-persona-btn").click();
    }

    // Click Skip Button
    async clickSkipButtonOnPopup() {
        await this.page.locator("button.skip-btn").click();
    }

    // Click Configure Button
    async clickConfigureButton() {
        await this.page.locator("button.configure-btn").click();

    }

    // Setup Intraining
    async setupTraining() {
        await expect(this.page.locator("div.card-body").locator("h3").filter({ hasText: "Enable Training Mode" })).toBeVisible();
        await this.clickConfigureButton();
        await this.page.locator("button.daily-join-button").click();
        await this.page.locator("button[class='call-control-btn end-call-btn']").click({ timeout: 60000 });
    }

    // Go to Intro Message 
    async clickIntroMessage() {
        await expect(this.page.locator("div.card-body").locator("h3").filter({ hasText: "Welcome Message" })).toBeVisible();
        await this.clickConfigureButton();
    }

    // Writing Intro Message
    async writeIntroMessage(intro, message) {
        await this.page.locator("div.SetupIntro-container").locator("input").fill(intro);
        await this.page.locator("div.SetupIntro-container").locator("textarea").fill(message);
        await this.page.locator("button.generate-btn-setup").click();
    }

    // Clicl Email Notification
    async clickEmailNotification() {
        await expect(this.page.locator("div.card-body").locator("h3").filter({ hasText: "Setup email notification" })).toBeVisible({ timeout: 180000 });
        await this.clickConfigureButton();
    }

    // Setup Email Notification
    async setupEmailNotification(emailAddress) {
        const emailInput = this.page.locator("input#email");
        const toggleLabel = this.page.locator("span.toggle-label-inquiry");
        const toggleSlider = this.page.locator(".toggle-slider-inquiry");

        await emailInput.clear();
        await emailInput.fill(emailAddress);

        const currentState = await toggleLabel.textContent();

        if (currentState?.trim() !== "Enabled") {
            await expect(this.page.locator("div.warning-message > span"))
                .toHaveText("Email setup are currently disabled");
            await toggleSlider.click();
            await expect(toggleLabel).toHaveText("Enabled");
        }

        await this.page.locator("button.submit-btn-inquiry").click();
    }


    // Click Branding Designer
    async clickBrandingDesigner() {
        await expect(this.page.locator("div.card-body").locator("h3").filter({ hasText: "Branding Designer" })).toBeVisible();
        await this.clickConfigureButton();
    }

    // LinkedIn Profile Picture upload method
    async linkedInProfilePicture(profilePicPath) {
        await this.page.locator("input#profileUrl").setInputFiles(profilePicPath);
        await expect(this.page.locator("div[class='profile-logo-section']>div>div>img[alt='Uploaded profile photo']")).toBeVisible();
    }

    // LinkedIn Logo picture upload method
    async linkedInLogoUpload(logoPicPath) {
        await this.page.locator("input#logoUrl").setInputFiles(logoPicPath);
        await expect(this.page.locator("div[class='default-image-container']>img[alt='Uploaded profile photo']")).toBeVisible();
    }

    // Create Linkedin tagline
    async linkedInTagLine(tagLine) {
        await this.page.getByPlaceholder("Your subtitle").fill(tagLine);
    }

    // turn on AI generate toggle
    async turnOnAIGenerateToggle(aiOption) {
        const aiGeneratorToggle = this.page.locator("select.form-input.custom-select");
        const slider = this.page.locator(".slider");

        if (!(await aiGeneratorToggle.isVisible())) {
            await slider.click();
        }

        await aiGeneratorToggle.selectOption(aiOption);
    }


    // Click LinkedIn Banner Generate Button
    async clickGenerateButtonInBanner() {
        await this.page.locator("button.generate-button").click();
        await expect(this.page.locator("img[alt='Generated LinkedIn Banner']")).toBeVisible({ timeout: 300000 });
    }

    // Click Create Button in Branding Designer
    async clickCreateButton() {
        await this.page.locator("button[class='submit-brand-tool-btn']").click();
    }

    // Upload profile picture in Email Signature
    async emailSignatureProfilePicture() {
        const fileChooserPromise = page.waitForEvent('filechooser');
        await this.page.locator("//div[@class='email-signature-form-group']//label[@for='profileUrl']").click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(path.join(profilePicPath));
        await expect(this.page.locator("//div[@class='email-signature-form-group']//img[@alt='Uploaded profile photo']")).toBeVisible();
    }

    // Write full name in Email Signature 
    async emailSignatureName(fullName) {
        await this.page.locator("input#name").clear();
        await this.page.locator("input#name").pressSequentially(fullName)
    }

    // Write company name in Email Signature 
    async emailSignatureCompanyName(companyname) {
        await this.page.locator("input#companyName").clear();
        await this.page.locator("input#companyName").pressSequentially(companyname)
    }

    // Write Job Title in Email Signature 
    async emailSignatureJobTitle(jobTitle) {
        await this.page.locator("input#jobTitle").clear();
        await this.page.locator("input#jobTitle").fill(jobTitle)
    }

    // Write email address in Email Signature 
    async emailSignatureEmailAddress(emailAddress) {
        await this.page.locator("input#email").clear();
        await this.page.locator("input#email").pressSequentially(emailAddress)
    }

    // Write Website URL in Email Signature 
    async emailSignatureWebsiteURL(websiteURL) {
        await this.page.locator("input#websiteUrl").clear();
        await this.page.locator("input#websiteUrl").pressSequentially(websiteURL)
    }

    // Write Email Signature phone number
    async emailSignaturePhoneNumber(countryCode, phoneNumber) {
        await this.page.locator("div.phone-input-container2>div.country-selector2").click();
        await this.page.locator("div[class='country-option2']>span[class='country-code']").filter({ hasText: countryCode }).click();
        await expect(this.page.locator("div[class='country-selector2']>span[class='country-code2']")).toHaveText(countryCode);
        await this.page.locator("input.phone-number-input").clear();
        await this.page.locator("input.phone-number-input").pressSequentially(String(phoneNumber));
    }

    // Enter Address for Email Signature
    async emailSignatureAddress(address) {
        await this.page.locator("textarea#address").clear();
        await this.page.locator("textarea#address").pressSequentially(address);
    }

    // Enter Facebook details in Email signature
    async emailSignatureFacebookDetails() {
        await this.page.locator("button.add-social-btn").filter({ hasText: "Facebook" }).click();
        await this.page.locator("//input[contains(@placeholder,'facebook')]").clear();
        await this.page.locator("//input[contains(@placeholder,'facebook')]").pressSequentially("www.facebook.com");
    }

    // Enter Instagram details in Email signature
    async emailSignatureInstagramDetails() {
        await this.page.locator("button.add-social-btn").filter({ hasText: "Instagram" }).click();
        await this.page.locator("//input[contains(@placeholder,'instagram')]").clear();
        await this.page.locator("//input[contains(@placeholder,'instagram')]").pressSequentially("www.instagram.com");
    }

    // Enter YouTube details in Email signature
    async emailSignatureYouTubeDetails() {
        await this.page.locator("button.add-social-btn").filter({ hasText: "YouTube" }).click();
        await this.page.locator("//input[contains(@placeholder,'youtube')]").clear();
        await this.page.locator("//input[contains(@placeholder,'youtube')]").pressSequentially("www.youtube.com");
    }

    // Enter LinkedIn details in Email signature
    async emailSignatureLinkedInDetails() {
        await this.page.locator("button.add-social-btn").filter({ hasText: "LinkedIn" }).click();
        await this.page.locator("//input[contains(@placeholder,'linkedin')]").clear();
        await this.page.locator("//input[contains(@placeholder,'linkedin')]").pressSequentially("www.linkedin.com");
    }

    // Enter X (Twitter) details in Email signature
    async emailSignatureXDetails() {
        await this.page.locator("button.add-social-btn").filter({ hasText: "X (Twitter)" }).click();
        await this.page.locator("//input[contains(@placeholder,'x')]").clear();
        await this.page.locator("//input[contains(@placeholder,'x')]").pressSequentially("www.x.com");
    }

    // Click Widget Icon
    async clickWidget() {
        await this.page.locator("i[class='fas fa-code']").click();
    }

    // Click Configure Widget button
    async configureWidget() {
        await expect(this.page.locator("div.card-body").locator("h3").filter({ hasText: "Create your Humee widgets and links" })).toBeVisible();
        await this.page.locator("button.configure-btn").filter({ hasText: "Setup" }).click();
        await expect(this.page.locator(".default-widget-image")).toBeVisible();
    }

    // Enter Greeting Message
    async enterGreetingMessage(greetingMessage) {
        await this.page.locator("textarea#greetingMessage").clear();
        await this.page.locator("textarea#greetingMessage").pressSequentially(greetingMessage);
    }

    // Click Generate Button
    async clickGenerateButton() {
        await this.page.locator("button.generate-btn").click();
    }

    // Verify settings page is displayed
    async verifySettingsPage() {
        await expect(this.page.locator("div[class='persona-component-modal-content']>div>div[class='settings-header']>h1")).toBeVisible();
    }

    // Verifying created Humee is displayed in the list
    async verifyCreatedHumee(humeeName) {
        await expect(this.page.locator(".personas-list").locator(".item-info").filter({ hasText: humeeName })).toBeVisible();
    }

    // Verify Humee status is completed (poll every 30s, max 5 min)
    async verifyHumeeStatus(humeeRole) {
        const statusLocator = this.page.locator(
            `//h4[normalize-space(text())='${humeeRole}']/../span[normalize-space(text())='Completed']`
        );

        const timeoutMs = 5 * 60 * 1000; // 5 minutes
        const intervalMs = 30 * 1000;   // 30 seconds
        const startTime = Date.now();

        let isCompleted = 0;

        while (Date.now() - startTime < timeoutMs) {
            await expect(this.page.locator(".personas-list").locator(".item-info").filter({ hasText: humeeRole })).toBeVisible();
            if (await statusLocator.isVisible()) {
                await expect(statusLocator).toBeVisible();
                isCompleted = 1;
            }

            if (isCompleted == 1) {
                break;
            }

            await this.page.waitForTimeout(intervalMs);
            await this.page.reload({ waitUntil: 'domcontentloaded' });


        }
    }

    // Click Edit Icon
    async clickEditIcon(humeeRole) {
        const editIcon = `//h4[text()='${humeeRole}']/../../div/button[@title='Edit humee']`
        await this.page.locator(editIcon).click();
    }

    // Verify all inputs are displaying correctly in Update Humee Section
    async verifyHumeeInfo(twinID, name, role, systemPrompt, humeeContext, fileName) {
        await expect(this.page.locator(`img[alt='${twinID}']`)).toBeVisible();
        await expect(this.page.locator(".humee-name-section").locator("input")).toHaveValue(name);
        await expect(this.page.locator(".persona-role-section>div>input")).toHaveValue(role);
        await expect(this.page.locator("div.system-prompt-section>textarea")).toHaveText(systemPrompt);
        await expect(this.page.locator("div.persona-context-section>textarea")).toHaveText(humeeContext);

        if (fileName) {
            await this.page.locator("div.layer-content").click();
            await expect(this.page.locator("div.knowledge-base-document-name")).toHaveText(fileName)
            await this.page.locator("button.knowledge-base-close-btn").click();
        }
    }

    // Click skip button in update humee section
    async clickSkipButton() {
        await this.page.locator("button.skip-btn-footer").click();
        await expect(this.page.locator("div.settings-header")).toBeVisible();
    }

    // Intro message click update button
    async clickSetupIntroUpdate() {
        await this.page.locator("//img[@alt='Setup Intro']/../..//button").click();
    }

    // Verify Intro Video is displayed
    async verifyIntroVideo(){
        const introVideoLocator = "//div[@class='video-container-centered']/video[contains(@src,'https://meet-humee.s3.us-west-1.amazonaws.com/processed-videos/')]";
        await expect(this.page.locator(introVideoLocator)).toBeVisible();
    }

    // Delete existing introduction
    async deleteExistingIntroduction() {
        await this.verifyIntroVideo();
        await this.page.locator("button.delete-video-btn-centered").click();
        await this.page.locator("button.conversation-delete-confirm-btn").click();
        await expect(this.page.locator("div[class='training-header']>h1").filter({ hasText: "Setup Intro" })).toBeVisible();
    }

    // Click update button in email notification
    async clickUpdateEmailNotification() {
        await this.page.locator("//img[@alt='3rd Party Config']/../..//button").click();
    }

    // Verify exiting email id in setup intro
    async verifyEmailId(oldEmail) {
        await expect(this.page.locator("input#email")).toHaveValue(oldEmail);
    }

    // Click update button in Brand Designer
    async clickUpdateBrandDesigner() {
        await this.page.locator("//img[contains(@src,'Branding_Designer')]/../..//button").click();
    }

    // Remove exiting profile picture
    async removeLinkedInPictures() {
        const uploadedPhoto = this.page.locator("img[alt='Uploaded profile photo']");
        await expect(this.page.locator(".upload-area-widget").nth(0)).toBeVisible();
        if (await uploadedPhoto.isVisible()) {
            await this.page.locator("//img[@alt='Uploaded profile photo']/..//button").click();
            await this.page.locator("div[class='swal2-actions']>button").filter({ hasText: 'Delete' }).click();
            await expect(this.page.locator("img[alt='Uploaded profile photo']")).not.toBeVisible();
        }
    }

    // Remove exiting brand logo
    async removeBrandLogo() {
        const uploadedPhoto = this.page.locator("img[alt='Uploaded company logo']");
        await expect(this.page.locator(".upload-area-widget").nth(0)).toBeVisible();
        if (await uploadedPhoto.isVisible()) {
            await this.page.locator("//img[@alt='Uploaded company logo']/..//button").click();
            await this.page.locator("div[class='swal2-actions']>button").filter({ hasText: 'Delete' }).click();
            await expect(this.page.locator("img[alt='Uploaded company logo']")).not.toBeVisible();
        }
    }

    // Click update button in widget 
    async clickWidgetUpdate() {
        await this.page.locator("//img[contains(@src,'widget')]/../..//button").click();
    }

    // Edit theme color in Widget
    async editThemeColor(themeColor) {
        await this.page.locator("input#hexColor").fill(themeColor);
    }

    // Verify conversation default option
    async conversationDefaultOption() {
        await expect(this.page.locator("//span[contains(text(),'Mobile Authentication')]/../input")).toBeChecked();
        await expect(this.page.locator("//span[contains(text(),'Intro Video Loop')]/../input")).not.toBeChecked();
        await expect(this.page.locator("//span[contains(text(),'Multiple Language Support')]/../input")).not.toBeChecked();

    }

    // Edit info in widget section
    async editConversationOption(durationLimit) {

        await this.page.locator("//span[contains(text(),'Mobile Authentication')]/../span[@class='checkbox-custom']").uncheck();
        await expect(this.page.locator("//span[contains(text(),'Mobile Authentication')]/../input")).not.toBeChecked();


        await this.page.locator("//span[contains(text(),'Intro Video Loop')]/../span[@class='checkbox-custom']").check();
        await expect(this.page.locator("//span[contains(text(),'Intro Video Loop')]/../input")).toBeChecked();


        await this.page.locator("//span[contains(text(),'Multiple Language Support')]/../span[@class='checkbox-custom']").check();
        await expect(this.page.locator("//span[contains(text(),'Multiple Language Support')]/../input")).toBeChecked();


        await this.page.locator("input#durationLimit").fill(durationLimit);
    }

    // Edit widget type and description
    async editWidgetTypeDescription(widgetTitle, widgetDescription, textColor) {
        await this.page.locator("input#widgetTitle").fill(widgetTitle);
        await this.page.locator("textarea#widgetDescription").fill(widgetDescription)
        await this.page.locator("input#textColorHex").fill(textColor);
    }

    // Edit conversation instructions
    async editConversationInstructions(conversationInstruction) {
        const conversationInput = this.page.locator("textarea#conversationInstruction");
        if (!(await conversationInput.isEnabled())) {
            await this.page.locator("label[for='conversationInstructionsToggle']>span").click();
            await this.page.locator("textarea#conversationInstruction").fill(conversationInstruction);
        }
    }

    // Edit Widget Styling
    async editWidgetStyling(size) {
        await this.page.locator("input#marginLeft").fill(size);
        await this.page.locator("input#marginBottom").fill(size);
        await this.page.locator("input#marginRight").fill(size);
        await this.page.locator("input#borderWidth").fill(size);

        await this.page.locator("div.widget-radius-select").click();
        await this.page.locator("//div[contains(@class,'widget-radius-option ') and contains(text(),'Large')]").click();

        await expect(this.page.locator("//div[@class='preview-size-item']//img[contains(@src,'.gif')]")).toBeVisible();
    }

    // click close button in widget section
    async clickClose() {
        await this.page.locator("button.persona-component-modal-close").click();
    }

    // Click copy link icon
    async clickLinkIcon(humeeRole) {
        await this.page.locator(`//div[@class='item-info']/h4[text()='${humeeRole}']/../../div/button[@title='Copy link']`).click();
    }

    // Get Humee Click
    async getHumeeLink() {
        await this.page.locator("div[class='popup-box']>div>button>i[class='fas fa-link']").click();
        await expect(this.page.locator("button[class='popup-tab active']").filter({ hasText: 'Link' })).toBeVisible();
        await this.page.locator("div.link-box-wrapper>button[title='Copy Link']").click();
        const copiedHumeeLink = await this.page.evaluate(() => navigator.clipboard.readText());
        return copiedHumeeLink
    }

    // Getting URL from the QR Code
    async getQrUrlFromCanvas() {
        const qrCanvas = this.page.locator('canvas.custom-qr-canvas');
        await expect(qrCanvas).toBeVisible();
        const qrPath = path.resolve('test-results/qr-code.png');
        await qrCanvas.screenshot({ path: qrPath });
        const qrUrl = this.qrDecoder.decodeQRCodeFromImage(qrPath);
        return qrUrl;
    }

    // Click linked in banner
    async clickLinkedInBanner() {
        await this.page.locator("div[class='popup-box']>div>button>i[class='fab fa-linkedin']").click();
        await expect(this.page.locator("button[class='popup-tab active']").filter({ hasText: 'LinkedIn Banner' })).toBeVisible();
    }

    // Get the LinkedIn Banner image URL
    async getLinkedInImageURL() {
        const imageURL = await this.page.locator("img.preview-image").getAttribute("src");

        if (!imageURL) {
            throw new Error('Image URL not found');
        }

        const context = this.page.context();
        this.secondPage = await context.newPage();
        await this.secondPage.goto(imageURL);
        await this.secondPage.waitForTimeout(5000); //5 secs to render the image in the page

        const qrCanvas = this.secondPage.locator("body>img");
        await expect(qrCanvas).toBeVisible();
        const qrPath = path.resolve('test-results/linkedin-qr-code.png');
        await qrCanvas.screenshot({ path: qrPath });
        const qrUrl = this.qrDecoder.decodeQRCodeFromImage(qrPath);
        await this.secondPage.close();
        return qrUrl;

    }

    // Click Email Signature
    async clickEmailSignature() {
        await this.page.locator("div[class='popup-box']>div>button>i[class='fas fa-envelope']").click();
        await expect(this.page.locator("button[class='popup-tab active']").filter({ hasText: 'Email Signature' })).toBeVisible();
    }

    // Verify data in Email Signature
    async verifyEmailSignature(humeeName, job, company, phoneNumber, address, email, website) {
        const tableData = this.page.locator(`//div[@class='signature-preview']//tbody//tr/td/`);

        await expect(this.page.locator("//div[@class='signature-preview']//tbody//tr/td/img[contains(@src,'images')]")).toBeVisible();

        await expect(this.page.locator(`//div[@class='signature-preview']//tbody//tr/td[text()='${humeeName}']`)).toBeVisible();
        await expect(this.page.locator(`//div[@class='signature-preview']//tbody//tr/td[text()='${job}']`)).toBeVisible();
        await expect(this.page.locator(`//div[@class='signature-preview']//tbody//tr/td[text()='${company}']`)).toBeVisible();
        await expect(this.page.locator(`//div[@class='signature-preview']//tbody//tr/td[text()='${phoneNumber}']`)).toBeVisible();
        await expect(this.page.locator(`//div[@class='signature-preview']//tbody//tr/td[text()='${address}']`)).toBeVisible();
        await expect(this.page.locator(`//div[@class='signature-preview']//tbody//tr/td/a[text()='${email}']`)).toBeVisible();
        await expect(this.page.locator(`//div[@class='signature-preview']//tbody//tr/td/a[text()='${website}']`)).toBeVisible();
        await expect(this.page.locator("//div[@class='signature-preview']//tbody//tr/td/img[contains(@src,'qr')]")).toBeVisible();

    }

    // Return QR URL from the image of Email Signature
    async getEmailSignQRURL() {
        const qrImageURL = await this.page.locator("//div[@class='signature-preview']//tbody//tr/td/img[contains(@src,'qr')]").getAttribute('src');
        // Check this in free time, same code used in get linked in image url, so try to create a new method of it
        if (!qrImageURL) {
            throw new Error('Image URL not found');
        }

        const context = this.page.context();
        this.secondPage = await context.newPage();
        await this.secondPage.goto(qrImageURL);
        await this.secondPage.waitForTimeout(5000); //5 secs to render the image in the page

        const qrCanvas = this.secondPage.locator("body>img");
        await expect(qrCanvas).toBeVisible();
        const qrPath = path.resolve('test-results/email-qr-code.png');
        await qrCanvas.screenshot({ path: qrPath });
        const qrUrl = this.qrDecoder.decodeQRCodeFromImage(qrPath);
        await this.secondPage.close();
        return qrUrl;
    }

    // Close copy link popup
    async closeCopyLinkPopup() {
        await this.page.locator("button.popup-close").click();
    }

    // Click logo and verify homepage is displayed correctly
    async clickLogo() {
        await this.page.locator("div.headerTop>div>img.header-logo").click();
        await expect(this.page.locator("div.tab-navigation2>button").nth(0)).toBeVisible();
    }

    // Verify search input in dashboard page
    async verifySearch(humeeRole) {
        await this.page.locator("div.search-overlay-content>div>input").pressSequentially(humeeRole);

        await expect(this.page.locator("div.skeleton-loader-container")).toBeVisible();
        await expect(this.page.locator("div.skeleton-loader-container")).not.toBeVisible();

        await expect(this.page.locator("//div[@class='item-info']")).toBeVisible();
        await expect(this.page.locator("//div[@class='item-info']")).toHaveCount(1);

        await expect(this.page.locator("//div[@class='item-info']/h4")).toHaveText(humeeRole);


    }

    // Click Edit Widget Icon icon
    async clickEditWidgetIcon(humeeRole) {
        await this.page.locator(`//div[@class='item-info']/h4[text()='${humeeRole}']/../../div/button[@title='Edit widget']`).click();
        await expect(this.page.locator("div.settings-page>div.settings-content")).toBeVisible();
        await expect(this.page.locator("img[alt='In Training']")).toBeVisible();
        await expect(this.page.locator("img[alt='Setup Intro']")).toBeVisible();
        await expect(this.page.locator("img[alt='3rd Party Config']")).toBeVisible();
        await expect(this.page.locator("img[alt='Generate Widget']").nth(0)).toBeVisible();
        await expect(this.page.locator("img[alt='Generate Widget']").nth(1)).toBeVisible();
    }

    // Click clone icon
    async clickCloneIcon(humeeRole) {
        await this.page.locator(`//div[@class='item-info']/h4[text()='${humeeRole}']/../../div/button[@title='Clone humee']`).click();
        await expect(this.page.locator("div.loader-small")).toBeVisible();
        await expect(this.page.locator("div.loader-small")).not.toBeVisible();
        await expect(this.page.locator("//div[@class='section-header']/h3[text()='Clone Humee']")).toBeVisible();
    }


}