const { faker } = require("@faker-js/faker");

class PagesPage {
  constructor(page, ghostUrl, screenshotDirectoryEscenario) {
    this.page = page;
    this.ghostUrl = ghostUrl;
    this.screenshotDirectoryEscenario = screenshotDirectoryEscenario;
  }
  async visit() {
    try {
      try {
        await this.page.waitForSelector(
          `div[role='button'].gh-mobile-nav-bar-more`
        );
        await Promise.resolve(
          this.page.click(`div[role='button'].gh-mobile-nav-bar-more`)
        );
        await this.page.waitForTimeout(2000);
        await Promise.resolve(this.page.click('a[data-test-nav="pages"]'));
      } catch (error) {
        try {
          await this.page.waitForSelector('a[data-test-nav="pages"]');

          await Promise.resolve(this.page.click('a[data-test-nav="pages"]'));
        } catch (error) {
          throw error;
        }
      }
      await this.page.screenshot({
        path: this.screenshotDirectoryEscenario + "PagesPage.png",
      });
      await this.page.waitForTimeout(2000);
    } catch (error) {
      console.error("Visit pages Page failed:", error.message);
      throw error; // Rethrow the error to propagate it to the calling code
    }
  }

  async createPage() {
    try {
      // Wait for an element that contains a span with the text "New Page"
      await this.page.waitForSelector('a[data-test-new-page-button]');
      await this.page.click('a[data-test-new-page-button]');
      await this.page.waitForSelector('textarea[data-test-editor-title-input]');
      await this.page.keyboard.type(faker.lorem.sentence(2));
      await this.page.keyboard.press("Tab");
      await this.page.keyboard.type(faker.lorem.sentence(2));
      await this.page.screenshot({
        path: this.screenshotDirectoryEscenario + "createPage.png",
      });
      await Promise.resolve(this.page.click('button[data-test-button="publish-flow"]'));
      await this.page.waitForTimeout(2000);
      await this.page.waitForSelector('button[data-test-button="continue"]');
      await Promise.resolve(
        this.page.click('button[data-test-button="continue"]')
      );
      await this.page.waitForTimeout(5000);
      await this.page.waitForSelector('button[data-test-button="confirm-publish"]');
    
      await Promise.resolve(
        this.page.click('button[data-test-button="confirm-publish"]')
      );
      await this.page.waitForTimeout(5000);
      const element = await this.page.$(
        '.gh-publish-title[data-test-publish-flow="complete"]'
      );
      if (element) {
        console.log("Page creado exitosamente");
      } else {
        throw "No se encontro componente de creacion exitosa";
      }
      await this.page.screenshot({
        path: this.screenshotDirectoryEscenario + "createPagesPage.png",
      });
      this.page.waitForSelector('button[data-test-button="close-publish-flow"]')

      await Promise.resolve(
        this.page.click('button[data-test-button="close-publish-flow"]')
      );
      await this.page.waitForTimeout(1000);
      this.page.waitForSelector('.gh-btn-editor[data-test-link="pages"]')

      await Promise.resolve(
        this.page.click('.gh-btn-editor[data-test-link="pages"]')
      );
      await this.page.waitForTimeout(1000);
      return this.page;
    } catch (error) {
      console.error("Create page faile:", error.message);
      throw error; // Rethrow the error to propagate it to the calling code
    }
  }
}

module.exports = PagesPage;