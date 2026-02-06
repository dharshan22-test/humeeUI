const { test } = require('@playwright/test');
const { createHumeeSection } = require('../pages/createHumeeSection');
const { humeeConversation } = require('../pages/humeeConversation');

const humeeName = process.env.HUMEE_NAME;
const humeeRole = process.env.HUMEE_ROLE;
const humeeType = process.env.HUMEE_TYPE;
const humeeDescription = process.env.HUMEE_DESCRIPTION;

const introText = "Hi, How can I help you";
const nameQuestion = "What is your name?";
const nameAnswer = humeeName;
// const questionTwo = "Tell me about your self"
// const answerTwo = "Software Tester"
const emailAddress = "test@teset.com";
const phoneNumber = 9382738297;
const emailSubject = "This is for test purpsoe";
const message = "This is for test purpose, If you got this message, which means you are an alien";

test.describe('Conversation Test', () => {

    test('Connect conversation using link', async ({ page }) => {

        const createHumee = new createHumeeSection(page);
        const conversation = new humeeConversation(page);

        await page.context().grantPermissions(
            ['clipboard-read', 'clipboard-write'],
            { origin: 'https://dashboardstaging.humee.io' }
        );

        // Go to Dashboard
        await page.goto('/dashboard');

        // Verify Humee is displayed in the page
        await createHumee.verifyCreatedHumee(humeeRole);

        // Get the conversation link from the humee
        const humeeLink = await createHumee.getHumeeLink();

        // Connect with the call in Humee
        await conversation.connectToCallWithLink(humeeLink, humeeType, humeeDescription);

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

    });

    test('Connect conversation using QR', async ({ page }) => {

        const createHumee = new createHumeeSection(page);
        const conversation = new humeeConversation(page);

        await page.context().grantPermissions(
            ['clipboard-read', 'clipboard-write'],
            { origin: 'https://dashboardstaging.humee.io' }
        );

        // Go to Dashboard
        await page.goto('/dashboard');

        // Verify Humee is displayed in the page
        await createHumee.verifyCreatedHumee(humeeRole);

        // Click link icon of required Humee
        await createHumee.clickLinkIcon(humeeRole);

        // Get the conversation link from the humee
        const humeeLink = await createHumee.getQrUrlFromCanvas();

        // Connect with the call in Humee
        await conversation.connectToCallWithLink(humeeLink, humeeType, humeeDescription);

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

    });

    test.only('Connect conversation using LinkedIn QR', async ({ page }) => {

        const createHumee = new createHumeeSection(page);
        const conversation = new humeeConversation(page);

        await page.context().grantPermissions(
            ['clipboard-read', 'clipboard-write'],
            { origin: 'https://dashboardstaging.humee.io' }
        );

        // Go to Dashboard
        await page.goto('/dashboard');

        // Verify Humee is displayed in the page
        await createHumee.verifyCreatedHumee(humeeRole);

        // Click link icon of required Humee
        await createHumee.clickLinkIcon(humeeRole);

        // Clicked LinkedIn Banner
        await createHumee.clickLinkedInBanner();

        // Scan the QR and get the URL from the LinkedIn Banner, passing the path where image is stored
        const humeeLink = await createHumee.getLinkedInImageURL("tests/utils/uploadfiles");

        // Connect with the call in Humee
        await conversation.connectToCallWithLink(humeeLink, humeeType, humeeDescription);

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

    });

    test('Connect conversation using Email Signature', async ({ page }) => {

        const createHumee = new createHumeeSection(page);
        const conversation = new humeeConversation(page);

        await page.context().grantPermissions(
            ['clipboard-read', 'clipboard-write'],
            { origin: 'https://dashboardstaging.humee.io' }
        );

        // Go to Dashboard
        await page.goto('/dashboard');

        // Verify Humee is displayed in the page
        await createHumee.verifyCreatedHumee(humeeRole);

        // Click link icon of required Humee
        await createHumee.clickLinkIcon(humeeRole);

        // Clicked Email Signature
        await createHumee.clickEmailSignature();

        // Verify Info in Email Signature
        await createHumee.verifyEmailSignature("HumeeNameEditted-", "Software Test Engineer", )

        // Scan the QR and get the URL from the LinkedIn Banner, passing the path where image is stored
        const humeeLink = await createHumee.getLinkedInImageURL("tests/utils/uploadfiles");

        // Connect with the call in Humee
        await conversation.connectToCallWithLink(humeeLink, humeeType, humeeDescription);

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

    });

});