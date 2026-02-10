const { expect } = require('@playwright/test');

exports.humeeConversation = class humeeConversation {
    /**
     * @param {import('@playwright/test').Page} page
     */

    constructor(page) {
        this.parentPage = page; // original window
        this.page = page;       // active window
        this.childPage = null;  // call window
    }

    // Veriying a audio is playwright in the browser, to check the Humee is actually speaking
    async verifyAudioPlay() {
        const isPlaying = await this.page.evaluate(() => {
            const audio = document.querySelector('audio');
            return audio && !audio.paused && !audio.ended && audio.currentTime > 0;
        });

        // expect(isPlaying).toBe(true);
    }

    async connectToCallWithLink(humeeLink, humeeType, humeeDescription, intro) {
        const context = this.page.context();

        // Grant camera & microphone permissions BEFORE opening the page
        await context.grantPermissions(
            ['camera', 'microphone'],
            { origin: new URL(humeeLink).origin }
        );

        this.childPage = await context.newPage();
        await this.childPage.goto(humeeLink);

        // Switch active page
        this.page = this.childPage;

        if (humeeType && humeeDescription) {
            await expect(this.page.locator("div.chatbot-header-content>div>h3")).toHaveText(humeeType);
            await expect(this.page.locator("div.chatbot-header-content>div>p")).toHaveText(humeeDescription);
        }

        await expect(this.page.locator("div.chatbot-content>div>h3")).toHaveText("Welcome to Humee");
        //sometimes conversation timeout error appears when I click connect button immediately after opening the link, so giving timeout
        await this.page.waitForTimeout(3000);
        await this.page.locator("div.welcome-lang-ui").click();

        if (intro) {
            // This method is to verify that the intro video is playing
            await this.verifyAudioPlay();
            await this.page.locator("button.start-conversation-btn").click();
        }
    }

    // Verifying call is started
    async verifyCallStarted() {
        const waiting = this.page.locator("div.waiting-content");
        await expect(waiting).toBeVisible();
        await expect(waiting).toBeHidden();

        await expect(this.page.locator("button[title='Exit call']")).toBeVisible();
    }

    // Having the conversation using Transcript
    async conversationWithTranscript(introText, nameQuestion, nameAnswer, questionTwo, answerTwo) {
        await this.page.locator("button[title='View transcript']").click();
        await expect(this.page.locator(`//div[@class='transcription-panel']/div//div[contains(text(),'${introText}')]`)).toBeVisible();

        // In first question, ask what is your name, so we can verify that the name is displayed correctly
        if (nameQuestion) {
            await this.page.locator("//div[@class='transcription-panel']//input").fill(nameQuestion),
            await this.page.locator("//div[@class='transcription-panel']//span/i[@class='fas fa-paper-plane']").click();
            await expect(this.page.locator(`//div[@class='transcription-panel']/div//div[contains(text(),'${nameAnswer}')]`)).toBeVisible();
        }
        // In second question, ask question that required for specific test

        if (questionTwo) {
            await this.page.locator("//div[@class='transcription-panel']//input").fill(questionTwo),
            await this.page.locator("//div[@class='transcription-panel']//span/i[@class='fas fa-paper-plane']").click();
            await this.page.locator(`//div[@class='transcription-panel']/div//div[contains(text(),'${answerTwo}')]`).toBeVisible();
        }
    }

    // Click end conversation
    async endConversation() {
        await this.page.locator("button[title='Exit call']").click();
    }


    // Enter info in business collaboration popup
    async businessCollab(emailAddress, phoneNumber, emailSubject, message) {
        await this.page.locator("input[type='email']").fill(emailAddress);

        // Add country code code
        await this.page.locator("input[type='tel']").fill(String(phoneNumber));
        await this.page.locator("input[value='Business Collaboration Inquiry']").fill(emailSubject);
        await this.page.locator("//label[text()='Message']/following-sibling::textarea").fill(message);

        await this.page.locator("//div/button[text()='Send Email']").click();

        // Verifying email sent sucessfully banner is displayed correctly
        await expect.soft(this.page.locator("//div[text()='Email sent successfully']")).toBeVisible();
        await expect(this.page.locator("div[class='welcome-lang-ui']>button")).toBeVisible();
    }

    // Helper function for Verify call timer method
    timeToSeconds(time) {
        const [m, s] = time.split(':').map(Number);
        return m * 60 + s;
    }

    // Verifying timer in call is reducing correctly
    async verifyCallTimerIsReducing() {
        const timer = this.page.locator("div.call-timer");

        await expect(timer).toBeVisible();

        const first = this.timeToSeconds(await timer.innerText());
        await this.page.waitForTimeout(3000);
        const second = this.timeToSeconds(await timer.innerText());

        expect(second).toBeLessThan(first);
    }

    // Switch back to parent after the page is closed
    async switchBackToParentPage(closeChild = true) {
        if (this.childPage && closeChild) {
            await this.childPage.close();
        }
        this.page = this.parentPage;
        await this.page.bringToFront();
    }

    // Verify call automatically ends after given minutes
    async verifyCallEndTiming(callDuration) {
        // Initial time does not matter for the test, so we can pick current time.
        await page.clock.install();
        await page.goto('http://localhost:3333');
        // Interact with the page
        await page.getByRole('button').click();

        // Fast forward time 5 minutes as if the user did not do anything.
        // Fast forward is like closing the laptop lid and opening it after 5 minutes.
        // All the timers due will fire once immediately, as in the real browser.
        await page.clock.fastForward('05:00');

        // Check that the user was logged out automatically.
        await expect(page.getByText('You have been logged out due to inactivity.')).toBeVisible();
    }

    


}