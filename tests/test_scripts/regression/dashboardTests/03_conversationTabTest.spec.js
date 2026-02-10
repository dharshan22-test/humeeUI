const { test } = require('@playwright/test');
const { createHumeeSection } = require('../../../pages/createHumeeSection');
const { humeeConversation } = require('../../../pages/humeeConversation');
const { conversationPage } = require('../../../pages/conversationPage');

const dayjs = require('dayjs');
const formattedDate = dayjs().format('MM-DD-YYYY');

const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../../utils/testData/humeeNames.json');

const humeeData = JSON.parse(
    fs.readFileSync(dataPath, 'utf-8')
);

const { twinName, humeeName, editHumeeRole, widgetTitle, widgetDescription } = humeeData;

const introText = "Hi, How can I help you";
const nameQuestion = "What is your name?";
const nameAnswer = humeeName;
const emailAddress = "test@teset.com";
const phoneNumber = 9382738297;
const emailSubject = "This is for test purpsoe";
const message = "This is for test purpose, If you got this message, which means you are an alien";

test.describe("Tests in Conversation Tab", () => {
    test("open not ended conversation and verify conversation table", async ({ page }) => {

        const createHumee = new createHumeeSection(page);
        const conversation = new humeeConversation(page);
        const convPage = new conversationPage(page);

        await page.context().grantPermissions(
            ['clipboard-read', 'clipboard-write'],
            { origin: 'https://dashboardstaging.humee.io' }
        );

        // Go to Dashboard
        await page.goto('/dashboard');

        // Get IP address
        const ip = await convPage.getPublicIp();

        // Verify Humee is displayed in the page
        await createHumee.verifyCreatedHumee(editHumeeRole);

        // Click link icon of required Humee
        await createHumee.clickLinkIcon(editHumeeRole);

        // Get the conversation link from the humee
        const humeeLink = await createHumee.getHumeeLink();

        // Connect with the call in Humee
        await conversation.connectToCallWithLink(humeeLink, widgetTitle, widgetDescription, "yes");

        // Verify call is started
        await conversation.verifyCallStarted();

        // Had conversation using transcript
        await conversation.conversationWithTranscript(introText, nameQuestion, nameAnswer);

        // Close the link icon popup
        await createHumee.closeCopyLinkPopup();

        // Go to Conversation page
        await convPage.gotoConversation();

        // Verify all the info in conversation table
        await convPage.verifyConversationTable(humeeName, formattedDate, "N/A", "N/A", "N/A", ip, "active");

        // Click logo
        await createHumee.clickLogo();

        // End conversation
        await conversation.endConversation();

        // Fill details in busines collab
        await conversation.businessCollab(emailAddress, phoneNumber, emailSubject, message);

        // Switch back to parent class
        await conversation.switchBackToParentPage();

        // Go to Conversation page
        await convPage.gotoConversation();

        // Verify all the info in conversation table
        await convPage.verifyConversationTable(humeeName, formattedDate, "N/A", "N/A", "N/A", ip, "ended");

        // Open the conversatio
        await convPage.openConversation(formattedDate, humeeName);

        // Verify conversation ID is an integer only
        await convPage.verifyConvId();

        // Verify the info in conversatio page
        await convPage.verifyConversationDetails("General conversation", humeeName, twinName, ip, "ended", formattedDate);

        // Verifying conversation transcript
        await convPage.verifyConvText(humeeName);

        // Verify Video is there
        await convPage.verifyRecordedVideo();

        // Go to to Conversation list table
        await convPage.clickBackButton();

        // Enter humee name in search input
        await convPage.enterConversationSearch(humeeName);

        // Verify search is working as expected
        await convPage.verifySearchFunction(humeeName);
    });
});
