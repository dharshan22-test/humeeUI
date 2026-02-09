const { test } = require('@playwright/test');
const { createHumeeSection } = require('../../pages/createHumeeSection');
const { humeeConversation } = require('../../pages/humeeConversation');

const humeeName = process.env.HUMEE_NAME;
const humeeRole = process.env.HUMEE_ROLE;
const introText = "Hi, How can I help you";
const nameQuestion = "What is your name?";
const nameAnswer = humeeName;

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

        // Click link icon of required Humee
        await createHumee.clickLinkIcon(humeeRole);

        // Get the conversation link from the humee
        const humeeLink = await createHumee.getHumeeLink();

        // Connect with the call in Humee
        await conversation.connectToCallWithLink(humeeLink);

        // Verify call is started
        await conversation.verifyCallStarted();

        // Had conversation using transcript
        await conversation.conversationWithTranscript(introText, nameQuestion, nameAnswer);

        // Verify Call duration is working as expected
        await conversation.verifyCallTimerIsReducing();

        // End conversation
        await conversation.endConversation();

        // Close popup
        await createHumee.closeCopyLinkPopup();

    });   

});