const { expect } = require('@playwright/test');

exports.loginPage = class LoginPage{

    /**
     * @param {import('@playwright/test').Page} page
     */

    constructor(page){
        this.page = page;
    }

    // Select Country Code
    async selectCountryCode(countryCode){
        await this.page.locator("div[class='country-selector']").click();
        await this.page.locator("div[class='country-option']>span[class='country-code']").filter({hasText:countryCode}).click();
        await expect(this.page.locator("div[class='country-selector']>span[class='country-code']")).toHaveText(countryCode);
    }

    // Enter phone number
    async enterPhoneNumber(phoneNumber){
        await this.page.locator("input[class='phone-input ']").pressSequentially(phoneNumber);
    }

    // Click Submit button
    async clickSubmit(){
        await this.page.getByRole('button', {name:'SIGN IN'}).click();
    }

    // Enter OTP
    async enterOTP(otpNumber) {

        const otpStr = otpNumber.toString();              // ensure it's a string
        const firstDigit = otpStr.charAt(0);              // get first digit
        const remainingDigits = otpStr.slice(1);          // get remaining digits

        await this.page.locator('input[name="otp1"]').fill(firstDigit);
        await this.verifyOTPButton('disabled');
        await this.page.keyboard.type(remainingDigits);
        await this.verifyOTPButton('enabled');
    }


}