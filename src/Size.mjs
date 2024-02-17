
export class Size {
    #w;
    #h;

    /**
     * @param {number} w The width.
     * @param {number} h The height.
     */
    constructor(w, h) {
        this.#w = w;
        this.#h = h;
    }

    get w() { return this.#w; }
    get h() { return this.#h; }
}