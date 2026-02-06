const { test } = require('@playwright/test');
const { createHumeeSection } = require('../pages/createHumeeSection');

const timeStamp = Date.now();

// All humee data
const humeeName = `HumeeN${timeStamp}`;

const humeeRole = `HumeeR${timeStamp}`;
const editHumeeRole = `HumeeRoleEditted-${timeStamp}`;

const systemPrompt = "You are detail oriented and analytical software test engineer, helping users ensure software quality and reliability. Assist them with test planning, test case creation, manual and automated testing strategies, defect identification, bug reporting and regression testing. Communicate clearly, be precise and provide structured, actional guidance.";
const editSystemPrompt = "Yes, You are detail oriented and analytical software test engineer, helping users ensure software quality and reliability. Assist them with test planning, test case creation, manual and automated testing strategies, defect identification, bug reporting and regression testing. Communicate clearly, be precise and provide structured, actional guidance.";

const humeeContext = "Your goal is to help users identify defects, improve test coverage and ensure stable, high-quality software releases.";
const editHumeeContext = "Yes, Your goal is to help users identify defects, improve test coverage and ensure stable, high-quality software releases.";

const humeeCompany = `HumeeC${timeStamp}`;
const editHumeeCompany = `HumeeCompanyEditted-${timeStamp}`;

const humeeIntroMsg = `Hi welcome to ${humeeRole}, click connect now button to get started`;
const humeeIntroMsgEditted = `Hi welcome to New ${humeeRole}, click connect now button to get started`;

const tagLine = `TagLine-${timeStamp}`;
const tagLineEditted = `TagLine-${timeStamp}-New`;

const emailAddress = "ydtest22@gmail.com"
const editHumeeSignatureName = `HumeeNameEditted-${timeStamp}`;
const humeeAddress = `HumeeAddressB${timeStamp}`;

// Widget Data
const widgetTitle = `Title-${timeStamp}`;
const widgetDescription = `Description-${timeStamp}`;
const widgetColor = "#f6ea3b";

// File upload paths
const profilePic = "tests/utils/uploadfiles/jpgFile.jpg";
const profilePicTwo = "tests/utils/uploadfiles/jpgFileTwo.jpg";

const companyLogo = "tests/utils/uploadfiles/pngFile.png";
const companyLogoTwo = "tests/utils/uploadfiles/pngFileTwo.png";

const knowledgeBaseDocPath = "tests/utils/uploadfiles/docFile.docx";
const knowledgeBasePDFPath = "tests/utils/uploadfiles/pdfFile.pdf";

test.describe('create Humee', () => {

    test('Create Humee with mandatory fields', async ({ page }) => {

        const createHumee = new createHumeeSection(page);

        const timeStamp = Date.now();
        const humeeName = `HumeeNA${timeStamp}`;
        const humeeRole = `HumeeRA${timeStamp}`;

        // Go to Dashboard
        await page.goto('/dashboard');

        // Select required Twin
        await createHumee.selectRequiredTwin("Twin-1764752031504");

        // Enter Humee Name
        await createHumee.enterHumeeName(humeeName);

        // Enter Humee Role
        await createHumee.enterHumeeRole(humeeRole);

        // Enter system prompt
        await createHumee.enterSystemPrompt(systemPrompt);

        // Enter Humee context
        await createHumee.enterHumeeContext(humeeContext);

        // click create humee
        await createHumee.clickCreateHumee();

        // Go to Widget
        await createHumee.clickWidget();

        // Click configure widget
        await createHumee.configureWidget();

        // Enter Greetings Message
        await createHumee.enterGreetingMessage("Hi");

        // Click Generate Button
        await createHumee.clickGenerateButton();

        // Verify Created Humee
        await createHumee.verifyCreatedHumee(humeeRole);

        // Verify Humee Role is in complete status
        await createHumee.verifyHumeeStatus(humeeRole);

        // Click Edit Icon
        await createHumee.clickEditIcon(humeeRole);

        // Verify Humee Info
        await createHumee.verifyHumeeInfo("Twin 1764752031504", humeeName, humeeRole, systemPrompt, humeeContext);


    });

    test('Create Humee with all fields', async ({ page }) => {

        const createHumee = new createHumeeSection(page);

        // Go to Dashboard
        await page.goto('/dashboard');

        // Select required Twin
        await createHumee.selectRequiredTwin("Twin-1764752031504");

        // Enter Humee Name
        await createHumee.enterHumeeName(humeeName);

        // Enter Humee Role
        await createHumee.enterHumeeRole(humeeRole);

        // Enter system prompt
        await createHumee.enterSystemPrompt(systemPrompt);

        // Enter Humee context
        await createHumee.enterHumeeContext(humeeContext);

        // Upload knowledge base file
        await createHumee.uploadKnowledgeBaseFile(knowledgeBasePDFPath);

        // click create humee
        await createHumee.clickCreateHumee();

        // // click setup in intraining mode
        // await createHumee.setupTraining();
        await createHumee.clickSkipButtonOnPopup();

        // Click Intro Message
        await createHumee.clickIntroMessage();

        // Write intro message
        await createHumee.writeIntroMessage("Introduction", humeeIntroMsg);

        // Click email notification
        await createHumee.clickEmailNotification();

        // Setup Email Notification
        await createHumee.setupEmailNotification(emailAddress);

        // Click Branding Instructions
        await createHumee.clickBrandingDesigner();

        // upload linkedIn profile picture
        await createHumee.linkedInProfilePicture(profilePic);

        // upload company logo
        await createHumee.linkedInLogoUpload(companyLogo);

        // enter tag line
        await createHumee.linkedInTagLine(tagLine)

        // Turn on AI generated toogle
        await createHumee.turnOnAIGenerateToggle("ocean");

        // Click generate AI Banner
        await createHumee.clickGenerateButtonInBanner();

        // Click create button
        await createHumee.clickCreateButton();

        // Enter Email Signature
        await createHumee.emailSignatureName(humeeName);

        // Enter company name
        await createHumee.emailSignatureCompanyName(humeeCompany);

        // Enter Job Title
        await createHumee.emailSignatureJobTitle("Software Tester");

        // Enter Email Signature
        await createHumee.emailSignatureEmailAddress(emailAddress);

        // enter Website URL
        await createHumee.emailSignatureWebsiteURL("www.humee.com");

        // Enter phone number
        await createHumee.emailSignaturePhoneNumber("+1", timeStamp);

        // Enter email signature address
        await createHumee.emailSignatureAddress(humeeAddress);

        // Click create button
        await createHumee.clickCreateButton();

        // Go to Widget
        await createHumee.clickWidget();

        // Click configure widget
        await createHumee.configureWidget();

        // Verify default conversation option
        await createHumee.conversationDefaultOption();

        // Enter Greetings Message
        await createHumee.enterGreetingMessage("Hi");

        // Click Generate Button
        await createHumee.clickGenerateButton();

        // Verify Created Humee
        await createHumee.verifyCreatedHumee(humeeRole);

        // Verify Humee Role is in complete status
        await createHumee.verifyHumeeStatus(humeeRole);

        // Click Edit Icon
        await createHumee.clickEditIcon(humeeRole);

        // Verify Humee Info
        await createHumee.verifyHumeeInfo("Twin 1764752031504", humeeName, humeeRole, systemPrompt, humeeContext, "pdfFile.pdf");

    });

    test('Edit Humee with basic fields', async ({ page }) => {

        const createHumee = new createHumeeSection(page);

        // Go to Dashboard
        await page.goto('/dashboard');

        // Click Edit Icon
        await createHumee.clickEditIcon(humeeRole);

        // Enter Humee Role
        await createHumee.clearHumeeRole();
        await createHumee.enterHumeeRole(editHumeeRole);

        // Enter system prompt
        await createHumee.clearSystemPrompt();
        await createHumee.enterSystemPrompt(editSystemPrompt);

        // Enter Humee context
        await createHumee.clearHumeeContext();
        await createHumee.enterHumeeContext(editHumeeContext);

        // Remove Knowledge Base content
        await createHumee.removeKnowledgeBaseFile("pdfFile.pdf");

        // Reupload different file in knowledge base
        await createHumee.uploadKnowledgeBaseFile(knowledgeBaseDocPath)

        // click update humee
        await createHumee.clickUpdateHumee();

        // Verify Created Humee
        await createHumee.verifyCreatedHumee(editHumeeRole);

        // Verify Humee Role is in complete status
        await createHumee.verifyHumeeStatus(editHumeeRole);

        // Click Edit Icon
        await createHumee.clickEditIcon(editHumeeRole);

        // Verify Humee Info
        await createHumee.verifyHumeeInfo("Twin 1764752031504", humeeName, editHumeeRole, editSystemPrompt, editHumeeContext, "docFile.docx");


    });

    test('Edit Humee Widget Fields', async ({ page }) => {

        const createHumee = new createHumeeSection(page);

        // Go to Dashboard
        await page.goto('/dashboard');

        // Click Edit Icon
        await createHumee.clickEditIcon(editHumeeRole);

        // Click Skip button
        await createHumee.clickSkipButton();

        // Click Setup Intro update button
        await createHumee.clickSetupIntroUpdate();

        // Delete exiting introduction
        await createHumee.deleteExistingIntroduction();

        // Write intro message
        await createHumee.writeIntroMessage("Introduction V2", humeeIntroMsgEditted);

        // Click update in email notification
        await createHumee.clickUpdateEmailNotification();

        // Verify exiting email address
        await createHumee.verifyEmailId(emailAddress);

        // Setup Email Notification
        await createHumee.setupEmailNotification("ydtest223@gmail.com");

        // Click update Branding Instructions
        await createHumee.clickUpdateBrandDesigner();

        // removed exiting linkedin profile picture
        await createHumee.removeLinkedInPictures();

        // remove brand logo
        await createHumee.removeBrandLogo();

        // upload linkedIn profile picture
        await createHumee.linkedInProfilePicture(profilePicTwo);

        // upload company logo
        await createHumee.linkedInLogoUpload(companyLogoTwo);

        // enter tag line
        await createHumee.linkedInTagLine(tagLineEditted)

        // Turn on AI generated toogle
        await createHumee.turnOnAIGenerateToggle("minimal");

        // Click generate AI Banner
        await createHumee.clickGenerateButtonInBanner();

        // Click create button
        await createHumee.clickCreateButton();

        // Enter Email Signature
        await createHumee.emailSignatureName(editHumeeSignatureName);

        // Enter company name
        await createHumee.emailSignatureCompanyName(editHumeeCompany);

        // Enter Job Title
        await createHumee.emailSignatureJobTitle("Software Test Engineer");

        // Enter Email Signature
        await createHumee.emailSignatureEmailAddress("ydtest222@gmail.com");

        // enter Website URL
        await createHumee.emailSignatureWebsiteURL("www.humee.com/v2");

        // Enter phone number
        await createHumee.emailSignaturePhoneNumber("+91", "9988899988");

        // Enter email signature address
        await createHumee.emailSignatureAddress(humeeAddress);

        // Click create button
        await createHumee.clickCreateButton();

        // Click Widget
        await createHumee.clickWidgetUpdate();

        // Edit theme color in Widget
        await createHumee.editThemeColor("#3b82f6");

        // Edit Conversation Duration
        await createHumee.editConversationOption('9');

        // Edit Widget Type Description
        await createHumee.editWidgetTypeDescription(widgetTitle, widgetDescription, widgetColor);

        // Edit conversation instructions
        await createHumee.editConversationInstructions("Be polite and Humble");

        // Edit Widget Size
        await createHumee.editWidgetStyling('22');

        // Enter Greetings Message
        await createHumee.enterGreetingMessage("Hi, How can I help you");

        // Click Generate Button
        await createHumee.clickGenerateButton();

        // Verify settings page is displayed
        await createHumee.verifySettingsPage();

        // Click close button
        await createHumee.clickClose();

        // Verify Created Humee
        await createHumee.verifyCreatedHumee(editHumeeRole);

        // Verify Humee Role is in complete status
        await createHumee.verifyHumeeStatus(editHumeeRole);

    })

});
