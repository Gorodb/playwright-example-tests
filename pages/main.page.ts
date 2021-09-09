import PageHelpers from "../helpers/pageHelpers";
import mainPageObjects from "../pageObjects/main";

export default class MainPage {
  static async assertThatUserIsLoggedIn(): Promise<void> {
    await PageHelpers.waitForSelector(mainPageObjects.logOut)
    await expect(await PageHelpers.isPresent(mainPageObjects.logOut)).toBeTrue('There is no exit btn on main page')
  }

  static async assertThatHelloTextContainsUserName(userName: string): Promise<void> {
    await PageHelpers.waitFor(async () => (await page.textContent(mainPageObjects.helloText))?.indexOf(userName) !== -1)
    await expect(await page.textContent(mainPageObjects.helloText)).toContainText(userName, "doesn't contain user's name:")
  }
}
