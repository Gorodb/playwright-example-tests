import PageHelpers from "../helpers/pageHelpers";
import authPageObjects from "../pageObjects/auth";
import mainPageObjects from "../pageObjects/main";

export default class AuthPage {
  static async openAuthPageByUrl(): Promise<void> {
    await page.goto(`${process.env.SITE_URL}`)

    if (await PageHelpers.isPresent(mainPageObjects.logOut)) {
      await PageHelpers.click(mainPageObjects.logOut)
    }
  }

  static async switchOnRegPage(): Promise<void> {
    await PageHelpers.click(authPageObjects.registerLink, true)
  }

  static async regUser(name: string, email: string, password: string): Promise<void> {
    await PageHelpers.waitForSelector(authPageObjects.nameInput)
    await page.type(authPageObjects.nameInput, name)
    await page.type(authPageObjects.emailInput, email)
    await page.type(authPageObjects.passwordInput, password)
    await page.type(authPageObjects.passwordAgainInput, password)
  }

  static async clickOnSubmitBtn(): Promise<void> {
    await PageHelpers.click(authPageObjects.submitInput)
  }
}
