const { test } = require('../../../utils/fixtures/myFixtures');
const { createHumeeSection } = require('../../../pages/createHumeeSection');
const { loginPage } = require('../../../pages/loginPage');

const fs = require('fs');
const path = require('path');
const { create } = require('domain');
const dataPath = path.join(__dirname, '../../../utils/testData/humeeNames.json');
const phoneNumber = "8622595064";

const humeeData = JSON.parse(
    fs.readFileSync(dataPath, 'utf-8')
);

const { editHumeeRole } = humeeData;

test.describe.serial('create Humee', () => {

    test('Create Humee with all fields', async ({ page }) => {

        const createHumee = new createHumeeSection(page);
        const login = new loginPage(page);


        // Go to Dashboard
        await login.login(phoneNumber);

        // Click search button
        await createHumee.clickSearch();

        // In search input, enter humee name
        await createHumee.searchInput(editHumeeRole);

        // Verify Humee Role is displayed correctly
        await createHumee.skeletonLoader();

        // Verify count is one
        await createHumee.verifySearchCount();

        // Verify search input
        await createHumee.verifySearchInput(editHumeeRole);

        // clear the search input
        await createHumee.clickClear();

        // Click search button
        await createHumee.clickSearch();

        // Move to stock twin section
        await createHumee.clickHumeeModel();

        // Click search button
        await createHumee.clickSearch();

        // In search input, enter humee name
        await createHumee.searchInput("College Athlete");

        // Verify Humee Role is displayed correctly
        await createHumee.skeletonLoader();

        // Verify count is one
        await createHumee.verifySearchCountForReplica();

        // Verify search input
        await createHumee.verifySearchInputForReplica("College Athlete");

        // clear the search input
        await createHumee.clickClear();

    });

});
