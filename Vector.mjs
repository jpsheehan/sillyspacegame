export class Vector {
    #mag;
    #dir;

    /**
     * 
     * @param {number} magnitude 
     * @param {number} direction 
     */
    constructor(magnitude, direction) {
        this.#mag = magnitude;
        this.#dir = direction;
    }

    get magnitude() { return this.#mag; }
    set magnitude(value) { this.#mag = value; }

    get direction() { return this.#dir; }
    set direction(value) { this.#dir = value; }

    /**
     * Adds this Vector and another Vector to create a new Vector.
     * @see https://math.stackexchange.com/questions/1365622/adding-two-polar-vectors
     * @param {Vector} that     
     * @returns {Vector}
     */
    add(that) {
        const mag = Math.sqrt(Math.pow(this.#mag, 2) + Math.pow(that.#mag, 2) + 2 * this.#mag * that.#mag * Math.cos(that.#dir - this.#dir));
        const dir = this.#dir + Math.atan2(that.#mag * Math.sin(that.#dir - this.#dir), this.#mag + that.#mag * Math.cos(that.#dir - this.#dir));
        return new Vector(mag, dir);
    }
}