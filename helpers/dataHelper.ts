import { v4 as uuidv4 } from 'uuid'

export default class DataHelper {
  static randomInt (min: number, max: number) {
    return Math.floor(Math.random() * (max - min)) + min
  }

  static randomElementFromArray (array: any[]): any {
    return array[this.randomInt(0, array.length - 1)]
  }

  static randomValidPhone () {
    const codes = [907, 935, 940, 942, 943, 998]
    return `7${codes[this.randomInt(0, codes.length - 1)]}${this.randomInt(1000000, 9999999)}`
  }

  static randomValidEmail () {
    return `test-${uuidv4()}@mailinator.com`
  }
}
