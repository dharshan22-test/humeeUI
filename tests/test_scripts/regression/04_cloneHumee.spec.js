const { test, expect } = require('@playwright/test');
const { createHumeeSection } = require('../../pages/createHumeeSection');
const timeStamp = Date.now();

const humeeRole = process.env.HUMEE_ROLE;
const systemPrompt = "Yes, You are detail oriented and analytical software test engineer, helping users ensure software quality and reliability. Assist them with test planning, test case creation, manual and automated testing strategies, defect identification, bug reporting and regression testing. Communicate clearly, be precise and provide structured, actional guidance.";
const humeeContext = "Yes, Your goal is to help users identify defects, improve test coverage and ensure stable, high-quality software releases.";
const cloneHumeeName = `CloneNa${timeStamp}`;
const cloneHumeeRole = `CloneR${timeStamp}`;
const emailAddress = "ydtest223@gmail.com";

test.describe("Edit Widget Icon", () => {
    test("Click Edit Widget Icon and verify edit widget page opened correctly", async ({ page }) => {

        const createHumee = new createHumeeSection(page);

        // Go to Dashboard
        await page.goto('/dashboard');

        // // Click link icon of required Humee
        // await createHumee.clickCloneIcon(humeeRole);

        // // Enter Widget Name and Widget Role
        // await createHumee.enterHumeeName(cloneHumeeName);

        // // Enter Humee widget
        // await createHumee.enterHumeeRole(cloneHumeeRole);

        // // Click clone button
        // await createHumee.clickUpdateHumee();

        // // Wait until process become completed
        // await createHumee.verifyHumeeStatus(cloneHumeeRole);

        // Click Edit Icon
        await createHumee.clickEditIcon("CloneR1770638338720");

        // Verify Humee Info
        await createHumee.verifyHumeeInfo("Twin 1764752031504", "CloneNa1770638338720", "CloneR1770638338720", systemPrompt, humeeContext);

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
        await createHumee.clickLinkIcon("CloneR1770638338720");

        // Clicked LinkedIn Banner
        await createHumee.clickLinkedInBanner();

        // Scan the QR and get the URL from the LinkedIn Banner, passing the path where image is stored
        const humeeLink = await createHumee.getLinkedInImageURL();
        expect(humeeLink).toBeTruthy();

        // Clicked Email Signature
        await createHumee.clickEmailSignature();

        // Verify Info in Email Signature
        await createHumee.verifyEmailSignature("HumeeNameEditted-", "Software Test Engineer", "HumeeCompanyEditted-1770297852", "+91 (998) 889-9988", "HumeeAddressB1770297852887", "ydtest222@gmail.com", "www.humee.com/v2");
    });
});
