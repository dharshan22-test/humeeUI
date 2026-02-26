const { test } = require('../../utils/fixtures/myFixtures');
const { createHumeeSection } = require('../../pages/createHumeeSection');
const {loginPage} = require('../../pages/loginPage');

const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../../utils/testData/humeeNames.json');
const phoneNumber = "8622595064";

test.describe('create Humee', () => {

    test('Create Humee with mandatory fields', async ({ page }) => {

        const createHumee = new createHumeeSection(page);
        const login = new loginPage(page);

        const timeStamp = Date.now();
        const humeeName = `HumeeNA${timeStamp}`;
        const humeeRole = `HumeeRA${timeStamp}`;
        const humeeTwin = "Twin-1764752031504";
        const humeeTwinWOHypen = "Twin 1764752031504";
        const systemPrompt = "You are detail oriented and analytical software test engineer, helping users ensure software quality and reliability. Assist them with test planning, test case creation, manual and automated testing strategies, defect identification, bug reporting and regression testing. Communicate clearly, be precise and provide structured, actional guidance.";
        const humeeContext = "Your goal is to help users identify defects, improve test coverage and ensure stable, high-quality software releases.";
        const introText = "Hi, How can I help you";

        // Go to Dashboard
        await login.login(phoneNumber)

        // Select required Twin
        await createHumee.selectRequiredTwin(humeeTwin);

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
        await createHumee.enterGreetingMessage(introText);

        // Edit conversation checkbox
        await createHumee.editConversationOption("5");

        // Click Generate Button
        await createHumee.clickGenerateButton();

        // Verify Created Humee
        await createHumee.verifyCreatedHumee(humeeRole);

        // Verify Humee Role is in complete status
        await createHumee.verifyHumeeStatus(humeeRole);

        // Click Edit Icon
        await createHumee.clickEditIcon(humeeRole);

        // Verify Humee Info
        await createHumee.verifyHumeeInfo(humeeTwinWOHypen, humeeName, humeeRole, systemPrompt, humeeContext);

        // Storing data in JSON file (which is in utils > testData > humeeNames.json)
        fs.writeFileSync(
            dataPath,
            JSON.stringify(
                {
                    humeeName,
                    humeeRole,
                    humeeTwin,
                    humeeTwinWOHypen,
                    systemPrompt,
                    humeeContext,
                    introText
                },
                null,
                2
            )
        );

    });

});
