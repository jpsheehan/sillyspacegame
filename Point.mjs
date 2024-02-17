export class Point {
    #x; #y;

    /**
     * 
     * @param {number} x 
     * @param {number} y 
     */
    constructor(x, y) {
        this.#x = x;
        this.#y = y;
    }

    get x() { return this.#x; }
    set x(value) { this.#x = value; }

    get y() { return this.#y; }
    set y(value) { this.#y = value; }

    /**
     * 
     * @param {Point} that 
     * @returns {Point}
     */
    add(that) { return new Point(this.x + that.x, this.y + that.y)}

    /**
     * 
     * @param {Point} that 
     * @returns {Point}
     */
    sub(that) { return new Point(this.x - that.x, this.y - that.y); }

    /**
     * 
     * @returns {Point}
     */
    clone() { return new Point(this.x, this.y); }

    /**
     * 
     * @param {Point} that 
     * @returns {number}
     */
    dot(that) { return this.x * that.x + this.y * that.y; }

    /**
     * 
     * @param {number} s 
     * @returns {Point}
     */
    mul(s) { return new Point(this.x * s, this.y * s)}
}