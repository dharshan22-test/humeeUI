const { test } = require('../../../utils/fixtures/myFixtures');
const { createHumeeSection } = require('../../../pages/createHumeeSection');
const { humeeConversation } = require('../../../pages/humeeConversation');
const {loginPage} = require('../../../pages/loginPage');

const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../../../utils/testData/humeeNames.json');

const humeeData = JSON.parse(
    fs.readFileSync(dataPath, 'utf-8')
);

const { humeeName, editHumeeRole, widgetTitle, widgetDescription, editHumeeCompany, editHumeeSignatureName, humeeAddress } = humeeData;

const introText = "Hi, How can I help you";
const nameQuestion = "What is your name?";
const nameAnswer = humeeName;
const emailAddress = "test@teset.com";
const phoneNumber = 9382738297;
const emailSubject = "This is for test purpsoe";
const message = "This is for test purpose, If you got this message, which means you are an alien";
const userPhoneNumber = "8622595064";

test.describe.serial('Conversation Test', () => {

    test('Connect conversation using Email Signature', async ({ page }) => {

        const createHumee = new createHumeeSection(page);
        const conversation = new humeeConversation(page);
        const login = new loginPage(page);


        await page.context().grantPermissions(
            ['clipboard-read', 'clipboard-write'],
            { origin: 'https://dashboardstaging.humee.io' }
        );

        // Go to Dashboard
        await login.login(userPhoneNumber)

        // Verify Humee is displayed in the page
        await createHumee.verifyCreatedHumee(editHumeeRole);

        // Click link icon of required Humee
        await createHumee.clickLinkIcon(editHumeeRole);

        // Clicked Email Signature
        await createHumee.clickEmailSignature();

        // Verify Info in Email Signature
        await createHumee.verifyEmailSignature(editHumeeSignatureName, "Software Test Engineer", editHumeeCompany, "+91 (998) 889-9988", humeeAddress, "ydtest222@gmail.com", "www.humee.com/v2")

        // Scan the QR and get the URL from the Email Signature
        const humeeLink = await createHumee.getEmailSignQRURL();

        // Connect with the call in Humee
        await conversation.connectToCallWithLink(humeeLink, widgetTitle, widgetDescription, "yes");

        // Verify call is started
        await conversation.verifyCallStarted();

        // Had conversation using transcript
        await conversation.conversationWithTranscript(introText, nameQuestion, nameAnswer);

        // Verify Call duration is working as expected
        await conversation.verifyCallTimerIsReducing();

        // End conversation
        await conversation.endConversation();

        // Fill details in busines collab
        await conversation.businessCollab(emailAddress, phoneNumber, emailSubject, message);

        // Switch back to parent class
        await conversation.switchBackToParentPage();

        // Close popup
        await createHumee.closeCopyLinkPopup();

    });

});