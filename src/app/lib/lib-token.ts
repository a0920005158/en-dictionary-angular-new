export class LibToken {
    static tokenMap = new Map<string, string>();

    constructor() { }

    /**
     * 產生一組隨機的 token，並關聯到指定訪客
     *
     * @param length token 長度
     * @return 產生的 token
     */
    static generateToken(length: number = 32): string {
        // 亂數產生指定長度的字串
        const token = Array.from(crypto.getRandomValues(new Uint8Array(length)))
            .map((byte) => byte.toString(16).padStart(2, '0'))
            .join('');

        // 將 token 關聯到唯一 ID
        const id = LibToken.generateUniqueId();
        LibToken.tokenMap.set(id, token);

        return token;
    }

    /**
     * 根據指定 ID 取得相關的 token
     *
     * @param id 唯一 ID
     * @return 相關的 token，如果沒有找到則返回 null
     */
    static getTokenById(id: string): string | null {
        return LibToken.tokenMap.get(id) ?? null;
    }

    /**
     * 產生一個唯一的 ID
     *
     * @return 唯一 ID
     */
    static generateUniqueId(): string {
        return Math.random().toString(36).substr(2, 9);
    }
}