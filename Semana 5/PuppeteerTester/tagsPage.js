const { faker } = require("@faker-js/faker");
let config = require("./config.json");

const timeoutConfig = config.timeout;
const assert = require("assert");
class TagsPage {
  constructor(page, ghostUrl, screenshotDirectoryEscenario) {
    this.page = page;
    this.ghostUrl = ghostUrl;
    this.screenshotDirectoryEscenario = screenshotDirectoryEscenario;
  }
  async visit() {
    try {
      if ((await this.page.$(".gh-mobile-nav-bar-more")) !== null) {
        await this.page.click(".gh-mobile-nav-bar-more");
      }
      await new Promise((r) => setTimeout(r, timeoutConfig));
        await this.page.click('a[data-test-nav="tags"]');

      
    

      await this.page.screenshot({
        path: this.screenshotDirectoryEscenario + "tagsPage.png",
      });
    } catch (error) {
      console.error("Visit Tags Page failed:", error.message);
      throw error; // Rethrow the error to propagate it to the calling code
    }
  }

  async createTag(newTagName, isPublic) {
    try {
      await this.page.waitForTimeout(timeoutConfig);

      await this.page.click('a[href="#/tags/new/"]');
      await this.page.waitForTimeout(timeoutConfig);
      await this.page.screenshot({
        path: this.screenshotDirectoryEscenario + "newTag.png",
      });
      await this.page.waitForSelector("#tag-name", { timeout: timeoutConfig });

      const name = await this.page.$("#tag-name");
      await name.type(newTagName);
      await this.page.waitForTimeout(timeoutConfig);
      await this.page.waitForSelector("#tag-description", { timeout: timeoutConfig });

      const description = await this.page.$("#tag-description");
      await description.type(faker.lorem.sentence(5));
      await this.page.screenshot({
        path: this.screenshotDirectoryEscenario + "completeTag.png",
      });
      await this.page.waitForSelector('button[data-test-button="save"]', { timeout: timeoutConfig });

      await Promise.resolve(this.page.click('button[data-test-button="save"]'));
      await this.page.waitForTimeout(timeoutConfig);
      await this.page.waitForSelector('a[data-test-link="tags-back"]', { timeout: timeoutConfig });

      await this.page.click('a[data-test-link="tags-back"]');
      await this.page.waitForTimeout(timeoutConfig);
      await this.page.waitForSelector('button[data-test-tags-nav="public"]', { timeout: timeoutConfig });

      if (isPublic) {
        await this.page.click('button[data-test-tags-nav="public"]');
        await this.page.waitForTimeout(timeoutConfig);
      } else {
        await this.page.click('button[data-test-tags-nav="internal"]');
        await this.page.waitForTimeout(timeoutConfig);
      }
      await this.page.screenshot({
        path: this.screenshotDirectoryEscenario + "listTags.png",
      });
      const element = await this.page.evaluate((newTagName) => {
        const elements = document.querySelectorAll(".gh-tag-list-name");
        for (const element of elements) {
          if (element.textContent.trim() === newTagName.trim()) {
            return element;
          }
        }
        return null;
      }, newTagName);

      if (element) {
        console.log("Tag created successfully");
      } else {
        throw "Create tag fail";
      }
      await this.page.screenshot({
        path: this.screenshotDirectoryEscenario + "createPostsPage.png",
      });

      await this.page.waitForTimeout(timeoutConfig);
      return this.page;
    } catch (error) {
      error, console.error("Create tag Page failed:", error.message);
      throw error; // Rethrow the error to propagate it to the calling code
    }
  }

  async createTagError() {
    try {
      await this.page.waitForTimeout(timeoutConfig);
      await this.page.waitForSelector('a[href="#/tags/new/"]', { timeout: timeoutConfig });
      
      await this.page.click('a[href="#/tags/new/"]');
      await this.page.waitForTimeout(timeoutConfig);
      await this.page.screenshot({
        path: this.screenshotDirectoryEscenario + "newTag.png",
      });
      const description = await this.page.$("#tag-description");
      await description.type(faker.lorem.sentence(5));
      await this.page.waitForSelector('button[data-test-button="save"]', { timeout: timeoutConfig });

      await Promise.resolve(this.page.click('button[data-test-button="save"]'));
      await this.page.waitForTimeout(timeoutConfig);
      await this.page.screenshot({
        path: this.screenshotDirectoryEscenario + "errorTag.png",
      });
      const actualErrorMessage = await this.page.$eval(".error", (el) =>
        el.textContent.trim()
      );
      // Compare with the expected error message

      assert.ok(
        actualErrorMessage.includes("You must specify a name for the tag")
      );

      await this.page.waitForTimeout(timeoutConfig);
      return this.page;
    } catch (error) {
      error, console.error("Create tag Error Page failed:", error.message);
      throw error; // Rethrow the error to propagate it to the calling code
    }
  }
  async editTag(newTagName) {
    try {
      await this.page.waitForTimeout(timeoutConfig);
     
      await this.page.evaluate(() => {
        document.querySelectorAll(".gh-tag-list-name")[0].click();
      }, this.page);
      await this.page.waitForTimeout(timeoutConfig);
      await this.page.screenshot({
        path: this.screenshotDirectoryEscenario + "editTag.png",
      });
      await this.page.waitForSelector("#tag-name", { timeout: timeoutConfig });

      const name = await this.page.$("#tag-name");
      await this.page.evaluate(() => {
        document.querySelector("#tag-name").value="";

      }, this.page);
      await name.type(newTagName);
      await this.page.waitForTimeout(timeoutConfig);
      await this.page.screenshot({
        path: this.screenshotDirectoryEscenario + "editedTag.png",
      });
      await this.page.waitForSelector('button[data-test-button="save"]', { timeout: timeoutConfig });

      await Promise.resolve(this.page.click('button[data-test-button="save"]'));
      await this.page.waitForTimeout(timeoutConfig);
      await this.page.waitForSelector('a[data-test-link="tags-back"]', { timeout: timeoutConfig });

      await this.page.click('a[data-test-link="tags-back"]');
      await this.page.waitForTimeout(timeoutConfig);
      await this.page.waitForSelector('button[data-test-tags-nav="public"]', { timeout: timeoutConfig });

      await this.page.click('button[data-test-tags-nav="public"]');
      await this.page.waitForTimeout(timeoutConfig);
      await this.page.screenshot({
        path: this.screenshotDirectoryEscenario + "listTags.png",
      });
      const element = await this.page.evaluate((newTagName) => {
        const elements = document.querySelectorAll(".gh-tag-list-name");
        for (const element of elements) {
          if (element.textContent.trim() === newTagName.trim()) {
            return element;
          }
        }
        return null;
      }, newTagName);

      if (element) {
        console.log("Edit tag successfully");
      } else {
        throw "Edit tag fail";
      }
      await this.page.screenshot({
        path: this.screenshotDirectoryEscenario + "finalEditTags.png",
      });

      await this.page.waitForTimeout(timeoutConfig);
      return this.page;
    } catch (error) {
      error, console.error("Edit tag Page failed:", error.message);
      throw error; // Rethrow the error to propagate it to the calling code
    }
  }
}

module.exports = TagsPage;
