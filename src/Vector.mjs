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
     * @param {Vector} other 
     * @returns {Vector}
     */
    add(other) {
        const mag = Math.sqrt(Math.pow(this.#mag, 2) + Math.pow(other.#mag, 2) + 2 * this.#mag * other.#mag * Math.cos(other.#dir - this.#dir));
        const dir = this.#dir + Math.atan2(other.#mag * Math.sin(other.#dir - this.#dir), this.#mag + other.#mag * Math.cos(other.#dir - this.#dir));
        return new Vector(mag, dir);
    }
}