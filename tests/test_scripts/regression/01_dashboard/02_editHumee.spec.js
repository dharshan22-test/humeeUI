const { test } = require('../../../utils/fixtures/myFixtures');
const { createHumeeSection } = require('../../../pages/createHumeeSection');
const { loginPage } = require('../../../pages/loginPage');

const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../../../utils/testData/humeeNames.json');
const phoneNumber = "8622595064";

const humeeData = JSON.parse(
    fs.readFileSync(dataPath, 'utf-8')
);

const { humeeRole, humeeName, editHumeeRole, editSystemPrompt, editHumeeContext } = humeeData;

// Humee data File upload paths
const knowledgeBaseDocPath = "tests/utils/uploadfiles/docFile.docx";

test.describe('create Humee', () => {

    test('Edit Humee with basic fields', async ({ page }) => {

        const createHumee = new createHumeeSection(page);
        const login = new loginPage(page);

        // Go to Dashboard
        await login.login(phoneNumber)

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

});
