declare const reporter: any;
import {Keys} from "../enums/keys";
import {ElementHandle} from "playwright";
import {Unboxed} from "playwright/types/structs";

export default class PageHelpers {
  static async makeAllureScreenshot(name = 'screenshot'): Promise<void> {
    try {
      const screenshot = await page.screenshot();
      reporter.addAttachment(name, screenshot, 'image/png');
    } catch (err) {}
  }

  static async isPresent(element: string, withWait = false, timeOut = 5000): Promise<boolean> {
    if (withWait) {
      await this.waitForSelector(element, timeOut)
    }
    return !!(await page.$(element));
  }

  static async isAllPresent(elements: string): Promise<boolean> {
    try {
      return (await page.$$(elements)).length > 0;
    } catch (err) {
      return false
    }
  }

  static async isElementPresent(locator: string, inx: number): Promise<boolean> {
    return !!(await this.getElement(locator, inx));
  }

  static async clearInput(locator: string): Promise<void> {
    await this.click(locator, true)
    if (process.platform === 'darwin') {
      await page.keyboard.press(Keys.ctrlAMacOs)
    } else {
      await page.keyboard.press(Keys.ctrlA)
    }
    await page.keyboard.press(Keys.delete)
  }

  static async getElement(locator: string, inx: number): Promise<any> {
    try {
      return (await page.$$(locator))[inx]
    } catch (err: any) {
      expect(true).toBeFalse(err)
    }
  }

  static async lastElement(locator: string): Promise<any> {
    try {
      const allElements = await page.$$(locator)
      return allElements[allElements.length - 1]
    } catch (err: any) {
      expect(true).toBeFalse(err)
    }
  }

  static async firstElement(locator: string): Promise<any> {
    return this.getElement(locator, 0)
  }

  static async deleteTokenFromCookies(): Promise<void> {
    await page.evaluate(() => {
      document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;'
    })
    await page.reload({waitUntil: 'domcontentloaded', timeout: 60000});
  }

  static async waitFor(event: Function, timeout = 5000, errorMessage?: string): Promise<boolean> {
    let currentTime = Date.now();
    const endTime = Date.now() + timeout;

    while (currentTime < endTime) {
      if (await event()) return true;
      await page.waitForTimeout(200);
      currentTime = Date.now();
    }

    if (!(await event()) && errorMessage) {
      console.error(errorMessage);
    }
    await this.makeAllureScreenshot()
    return false;
  }

  static async editCookieValues(
    token: string,
    expiresAt: string,
  ): Promise<void> {
    await page.evaluate(() => {
      document.cookie = `jwt-token=${token}; path=/; expires=${expiresAt};`;
    });
  }

  static async elementsCount(elements: string): Promise<number> {
    try {
      return (await page.$$(elements)).length
    } catch (err) {
      return 0
    }
  }

  static async scrollToBottomOfThePage(): Promise<void> {
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight);
    });
  }

  static async scrollToElement(element: string): Promise<void> {
    (await page.$(element))?.scrollIntoViewIfNeeded()
  }

  static async getValue(selector: string): Promise<string | null> {
    try {
      return page.evaluate((el: Unboxed<any>) => el.value, await page.$(selector))
    } catch (err) {
      return "0"
    }
  }

  static async click(selector: string, withWait?: boolean, timeout?: number): Promise<void> {
    if (withWait) {
      await this.waitForSelector(selector, timeout)
    }
    try {
      if (await this.elementsCount(selector) > 1) {
        console.info(`Найдено больше одного элемента с селектором ${selector}, кликаем по первому`)
        await (await this.firstElement(selector)).click()
      } else {
        await page.click(selector)
      }
    } catch (err) {
      console.error(`Не удалось кликнуть по элементу с селектором ${selector} \r\n`, err)
      await expect(false).toBeTrue(`Не удалось кликнуть по элементу с селектором ${selector} \r\n ${err ? err : null}`)
    }
  }

  static async clickWithError(selector: string, withWait?: boolean, timeout?: number): Promise<void> {
    if (withWait) {
      await this.waitForSelector(selector, timeout)
    }
    try {
      if (await this.elementsCount(selector) > 1) {
        await (await this.firstElement(selector)).click()
      }
    } catch (err) {
      console.error(`Не удалось кликнуть по элементу с селектором ${selector}`, err)
    }
  }

  static async clickByIndex(selector: string, inx: number, withWait?: boolean, timeout?: number): Promise<void> {
    if (withWait) await this.waitForElements(selector, timeout)
    try {
      await (await this.getElement(selector, inx)).click()
    } catch (err: any) {
      clickOnElementsError(selector, inx, err)
    }
  }

  static async clickOnFirstElement(selector: string, withWait?: boolean, timeout?: number): Promise<void> {
    await this.clickByIndex(selector, 0, withWait, timeout);
  }

  static async clickOnLastElement(selector: string, withWait?: boolean, timeout?: number): Promise<void> {
    if (withWait) await this.waitForElements(selector, timeout)
    const inx = await this.elementsCount(selector) - 1
    try {
      await (await this.lastElement(selector)).click()
    } catch (err: any) {
      clickOnElementsError(selector, inx, err)
    }
  }

  static async waitForSelector(selector: string, timeout?: number, errorMessage?: string) {
    const waitTime = timeout || 5000
    try {
      await page.waitForSelector(selector, {timeout: waitTime, state: "attached"})
    } catch (error) {
      await this.makeAllureScreenshot()
      console.error(errorMessage || `Элемент ${selector} не отобразился после ${waitTime}ms. \r\n ${errorMessage}`)
    }
  }

  static async waitForElements(selector: string, timeout?: number) {
    const waitTimeout = timeout || 5000
    await this.waitFor(async () => await this.elementsCount(selector) > 0, waitTimeout)
  }

  static async mouseMove(element: Promise<ElementHandle<SVGElement | HTMLElement> | null>) {
    const boundingBox = await (await element)?.boundingBox()
    if (boundingBox) {
      await page.mouse.move(boundingBox.x, boundingBox.y)
    }
  }

  static async dragAndDrop(
    fromElement: Promise<ElementHandle<SVGElement | HTMLElement> | null>,
    toElement: Promise<ElementHandle<SVGElement | HTMLElement> | null>
  ) {
    const oneBoundingBox = await (await fromElement)?.boundingBox()
    const twoBoundingBox = await (await toElement)?.boundingBox()

    if (oneBoundingBox && twoBoundingBox) {
      await page.mouse.move(
        oneBoundingBox.x + oneBoundingBox.width / 2,
        oneBoundingBox.y + oneBoundingBox.height / 2,
        {steps: 5}
      )
      await page.mouse.down()
      await page.mouse.move(
        twoBoundingBox.x + twoBoundingBox.width / 2,
        twoBoundingBox.y + twoBoundingBox.height / 2,
        {steps: 5}
      )
      await page.mouse.up()
    }
  }
}

const clickOnElementsError = (selector: string, inx: number, err: Error) => {
  console.error(`Не удалось кликнуть по ${inx}-му элементу с селектором ${selector} \r\n`, err)
  expect(false).toBeTrue(`Не удалось кликнуть по ${inx}-му элементу с селектором ${selector} \r\n ${err ? err : null}`)
}
