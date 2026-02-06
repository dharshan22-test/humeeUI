const { expect } = require('@playwright/test');

exports.website = class website {
    /**
     * @param {import('@playwright/test').Page} page
     */

    constructor(page) {
        this.page = page;
    }

    async gotoHumeeWebsite(){
        await this.page.goto(process.env.APPLICATION_URL);
    }

    
}
