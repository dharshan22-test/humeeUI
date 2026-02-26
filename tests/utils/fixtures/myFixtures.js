const base = require('@playwright/test');
const testDataFile = require('../testData/humeeNames.json');

exports.test = base.test.extend({

	testData: async ({}, use) => {
        const testData = testDataFile
        await use(testData);
    }
   
})
exports.expect = base.expect;