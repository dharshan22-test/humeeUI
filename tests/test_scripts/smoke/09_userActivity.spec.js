const { test } = require('../../utils/fixtures/myFixtures');
const { loginPage } = require('../../pages/loginPage');
const { userActivity } = require('../../pages/userActivity');
const { visitorDetails } = require('../../pages/visitorDetails');
const { conversationHistory } = require('../../pages/conversationHistory');
const { enquiryList } = require('../../pages/enquiryList');  
const userPhoneNumber = "6464646464";

test.describe("User Activity Tests", () => {
    test("Verifying all the pages in user activity is working as expected", async ({ page }) => {

        const activity = new userActivity(page);
        const login = new loginPage(page);
        const visitor = new visitorDetails(page);
        const conversation = new conversationHistory(page);
        const enquiry = new enquiryList(page);

        // Go to Dashboard with admin login
        await login.strictAdminLogin(userPhoneNumber, "true")

        // Go to User Activity
        await activity.gotoUserActivity();

        // Go to Visitors Details tab
        await visitor.gotoVisitorsDetails();  

        // Go to Conversation History tab
        await conversation.gotoConversationHistory();
       
        // Go to Enquiry List tab
        await enquiry.gotoEnquiryList();

    });

});
