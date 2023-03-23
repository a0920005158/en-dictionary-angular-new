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
}