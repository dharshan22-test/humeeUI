const { test } = require('../../../utils/fixtures/myFixtures');
const { createHumeeSection } = require('../../../pages/createHumeeSection');
const { loginPage } = require('../../../pages/loginPage');

const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../../../utils/testData/humeeNames.json');
const phoneNumber = "8622595064";

const timeStamp = Date.now();

// All humee data
const twinName = "Twin-1764752031504";
const twinNameWOHypen = "Twin 1764752031504";

const humeeName = `HumeeN${timeStamp}`;

const humeeRole = `HumeeR${timeStamp}`;
const editHumeeRole = `Humee RoleEditted-${timeStamp}`;

const systemPrompt = "You are detail oriented and analytical software test engineer, helping users ensure software quality and reliability. Assist them with test planning, test case creation, manual and automated testing strategies, defect identification, bug reporting and regression testing. Communicate clearly, be precise and provide structured, actional guidance.";
const editSystemPrompt = "Yes, You are detail oriented and analytical software test engineer, helping users ensure software quality and reliability. Assist them with test planning, test case creation, manual and automated testing strategies, defect identification, bug reporting and regression testing. Communicate clearly, be precise and provide structured, actional guidance.";

const humeeContext = "Your goal is to help users identify defects, improve test coverage and ensure stable, high-quality software releases.";
const editHumeeContext = "Yes, Your goal is to help users identify defects, improve test coverage and ensure stable, high-quality software releases.";

const humeeCompany = `HumeeC${timeStamp}`;
const editHumeeCompany = `HumeeCE-${timeStamp}`;

const humeeIntroMsg = `Hi welcome to ${humeeRole}, click connect now button to get started`;
const humeeIntroMsgEditted = `Hi welcome to New ${humeeRole}, click connect now button to get started`;

const tagLine = `TagLine-${timeStamp}`;
const tagLineEditted = `TagLine-${timeStamp}-New`;

const emailAddress = "ydtest223@gmail.com"
const editHumeeSignatureName = `HumeeNameEditted`;
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

const cloneHumeeName = `CloneNa${timeStamp}`;
const cloneHumeeRole = `CloneR${timeStamp}`;

test.describe.serial('create Humee', () => {

    test('Storing all Humee fields', async ({ }) => {
        // Storing data in JSON file (which is in utils > testData > humeeNames.json)
        fs.writeFileSync(
            dataPath,
            JSON.stringify(
                {
                    twinName,
                    twinNameWOHypen,
                    humeeName,
                    humeeRole,
                    editHumeeRole,
                    systemPrompt,
                    editSystemPrompt,
                    humeeContext,
                    editHumeeContext,
                    humeeCompany,
                    editHumeeCompany,
                    humeeIntroMsg,
                    humeeIntroMsgEditted,
                    tagLine,
                    tagLineEditted,
                    emailAddress,
                    editHumeeSignatureName,
                    humeeAddress,
                    widgetTitle,
                    widgetDescription,
                    widgetColor,
                    cloneHumeeName,
                    cloneHumeeRole
                },
                null,
                2
            )
        );
    })

    test('Create Humee with all fields', async ({ page }) => {

        const createHumee = new createHumeeSection(page);
        const login = new loginPage(page);


        // Go to Dashboard
        await login.login(phoneNumber)

        // Select required Twin
        await createHumee.selectRequiredTwin(twinName);

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

});
