import { Point } from "./Point.mjs";

export class Gate {
    #a;
    #b;
    #angle;

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
        this.#angle = angle;
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {string} color 
     */
    render(ctx, color) {
        const size = 10;

        ctx.beginPath();
        ctx.arc(this.#a.x, this.#a.y, size / 2, -this.#angle - Math.PI, -this.#angle, true);
        ctx.arc(this.#b.x, this.#b.y, size / 2, -this.#angle, -this.#angle + Math.PI, true);
        ctx.closePath();
        
        ctx.fillStyle = color;
        ctx.fill();
    }
}