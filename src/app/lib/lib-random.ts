export class LibRandom {
  static tokenMap = new Map<string, string>();

  constructor() { }

  /**
   * 隨機取得陣列index
   *
   * @param arr 輸入陣列
   * @return 唯一 ID
   */
  static randomIndex<T>(arr: T[]): number {
    /*
      輸入一個陣列，輸出隨機的索引值。
    */
    return Math.floor(Math.random() * arr.length);
  }

  static selectRandomItemsFromArray<T>(arr: T[], min: number, max: number): T[] {
    const range = LibRandom.getRandomNumberInRange(min,max); // 計算範圍大小
    return LibRandom.getRandomElementsFromArray(arr,range);
  }

  static getRandomElementsFromArray<T>(arr: T[], numElements: number): T[] {
    const shuffledArr = arr.sort(() => 0.5 - Math.random());
    return shuffledArr.slice(0, numElements);
  }

  static getRandomNumberInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  static getRandomNumbersInRange(min: number, max: number, count: number): number[] {
    const result: number[] = [];
    if (count > max - min + 1) {
      throw new Error('Count cannot be larger than range');
    }
    while (result.length < count) {
      const num = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!result.includes(num)) {
        result.push(num);
      }
    }
    return result;
  }
}