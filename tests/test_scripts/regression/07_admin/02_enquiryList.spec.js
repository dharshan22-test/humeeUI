const { test } = require('../../../utils/fixtures/myFixtures');
const { loginPage } = require('../../../pages/loginPage');
const { userActivity } = require('../../../pages/userActivity');
const { enquiryList } = require('../../../pages/enquiryList');
const { website } = require('../../../pages/website');

const random4DigitNumber = Math.floor(1000 + Math.random() * 9000);
const randomAlphabet = Array.from({ length: 5 }, () =>
  String.fromCharCode(65 + Math.floor(Math.random() * 26))
).join('');

const phoneNumber = `862252${random4DigitNumber}`;
const firstName = `fn${randomAlphabet}`;
const lastName = `ln${randomAlphabet}`;
const emailAddress = `email${random4DigitNumber}@ex.com`;
const companyName = `company${random4DigitNumber}`;
const message = `Enquiry from ${random4DigitNumber}.`;
const userPhoneNumber = "6464646464";


test.describe.serial("User Activity Tests", () => {
    test("Create a new user with admin login", async ({ page }) => {

        const activity = new userActivity(page);
        const login = new loginPage(page);
        const site = new website(page);
        const enquiry = new enquiryList(page);

        // Open Humee Website
        await site.gotoHumeeWebsite();

        // Click pricing
        await site.clickPricing();

        // Click required enquiry now button
        await site.clickEnquireNow();

        // Create an Enquiry from the website
        await site.fillEnquiryForm(firstName, lastName, emailAddress, companyName, phoneNumber, message);

        // Go to Dashboard with admin login
        await login.strictAdminLogin(userPhoneNumber, "true")

        // Go to User Activity
        await activity.gotoUserActivity();

        // Go to Enquiry List tab
        await enquiry.gotoEnquiryList();

        // Search with the name and verify the enquiry details in the enquiry list
        await enquiry.enterSearchName(firstName, lastName, emailAddress, companyName, phoneNumber, message);
    });

});
