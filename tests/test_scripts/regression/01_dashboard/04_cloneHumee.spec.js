
const { test } = require('../../../utils/fixtures/myFixtures');
const { expect} = require('@playwright/test');
const { createHumeeSection } = require('../../../pages/createHumeeSection');
const {loginPage} = require('../../../pages/loginPage');
const timeStamp = Date.now();

const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname, '../../../utils/testData/humeeNames.json');
const userPhoneNumber = "8622595064";

const humeeData = JSON.parse(
    fs.readFileSync(dataPath, 'utf-8')
);

const { twinNameWOHypen, editHumeeRole, editSystemPrompt, editHumeeContext, editHumeeCompany, humeeAddress, cloneHumeeName, cloneHumeeRole } = humeeData;

const emailAddress = "ydtest22@gmail.com";

test.describe("Clone Widget Icon", () => {
    test("Click Clone Widget Icon and verify clone widget page opened correctly", async ({ page }) => {

        const createHumee = new createHumeeSection(page);
        const login = new loginPage(page);

        // Go to Dashboard
        await login.login(userPhoneNumber)

        // Click link icon of required Humee
        await createHumee.clickCloneIcon(editHumeeRole);

        // Enter Widget Name and Widget Role
        await createHumee.cloneHumeeName(cloneHumeeName);

        // Enter Humee widget
        await createHumee.cloneHumeeRole(cloneHumeeRole);

        // Click clone button
        await createHumee.clickCloneButton();

        // Wait until process become completed
        await createHumee.verifyHumeeStatus(cloneHumeeRole);

        // Click Edit Icon
        await createHumee.clickEditIcon(cloneHumeeRole);

        // Verify Humee Info
        await createHumee.verifyHumeeInfo( twinNameWOHypen, cloneHumeeName, cloneHumeeRole, editSystemPrompt, editHumeeContext);

        // Click Skip button
        await createHumee.clickSkipButton();

        // Click Intro Video button
        await createHumee.clickSetupIntroUpdate();

        // Verify Intro video is displyed
        await createHumee.verifyIntroVideo();

        // Close intro video
        await createHumee.clickClose();

        // Click update in email notification
        await createHumee.clickUpdateEmailNotification();

        // Verify exiting email address
        await createHumee.verifyEmailId(emailAddress);

        // Close twice Email notification popup then edit widget
        await createHumee.clickClose();
        await createHumee.clickClose();

        // Click link icon of required Humee
        await createHumee.clickLinkIcon(cloneHumeeRole);

        // Clicked LinkedIn Banner
        await createHumee.clickLinkedInBanner();

        // Scan the QR and get the URL from the LinkedIn Banner, passing the path where image is stored
        const humeeLink = await createHumee.getLinkedInImageURL();
        expect(humeeLink).toBeTruthy();

        // Clicked Email Signature
        await createHumee.clickEmailSignature();

        // Verify Info in Email Signature
        await createHumee.verifyEmailSignature("HumeeNameEditted", "Software Test Engineer", editHumeeCompany, "+91 (998) 889-9988", humeeAddress, "ydtest222@gmail.com", "www.humee.com/v2");
    });
});
