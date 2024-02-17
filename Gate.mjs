import { Point } from "./Point.mjs";

export class Gate {
    #a;
    #b;

    get a() { return this.#a; }
    get b() { return this.#b; }

    /**
     * 
     * @param {Point} pos 
     * @param {number} gap 
     * @param {number} angle 
     */
    constructor(pos, gap, angle) {
        this.#a = new Point(
            pos.x + Math.cos(angle - Math.PI / 2) * gap / 2,
            pos.y - Math.sin(angle - Math.PI / 2) * gap / 2);
        this.#b = new Point(
            pos.x + Math.cos(angle + Math.PI / 2) * gap / 2,
            pos.y - Math.sin(angle + Math.PI / 2) * gap / 2);
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {string} color 
     */
    render(ctx, color) {
        const size = 10;

        ctx.fillStyle = color;
        ctx.fillRect(this.#a.x - size / 2, this.#a.y - size / 2, size, size);
        ctx.fillRect(this.#b.x - size / 2, this.#b.y - size / 2, size, size);
    }
}