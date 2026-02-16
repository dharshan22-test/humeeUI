const { test } = require('@playwright/test');
const { createHumeeSection } = require('../../../pages/createHumeeSection');
const { loginPage } = require('../../../pages/loginPage');

const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../../../utils/testData/humeeNames.json');
const phoneNumber = "8622595064";

const humeeData = JSON.parse(
    fs.readFileSync(dataPath, 'utf-8')
);

const { editHumeeRole, humeeIntroMsgEditted, emailAddress, tagLineEditted, editHumeeSignatureName, editHumeeCompany, humeeAddress, widgetColor, widgetTitle, widgetDescription } = humeeData;

// Humee data File upload paths
const profilePicTwo = "tests/utils/uploadfiles/jpgFileTwo.jpg";
const companyLogoTwo = "tests/utils/uploadfiles/pngFileTwo.png";

test.describe('create Humee', () => {

    test('Edit Humee Widget Fields', async ({ page }) => {

        const createHumee = new createHumeeSection(page);
        const login = new loginPage(page);


        // Go to Dashboard
        await login.login(phoneNumber)

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

    });

});
