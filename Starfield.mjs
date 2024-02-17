import { Size } from "./Size.mjs";

export class Starfield {

    #stars;
    #bounds;

    /**
     * 
     * @param {number} num 
     * @param {Size} bounds
     */
    constructor(num, bounds) {
        this.#bounds = bounds;
        this.#stars = [];
        for (let i = 0; i < num; i++) {
            this.#stars.push([Math.floor(Math.random() * bounds.w), Math.floor(Math.random() * bounds.h)])
        }
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} time 
     */
    render(ctx, time) {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, this.#bounds.w, this.#bounds.h);

        ctx.fillStyle = "#ffffff";
        for (let i = 0; i < this.#stars.length; i++) {
            const [x, y] = this.#stars[i];
            ctx.globalAlpha = Math.random() * 0.5 + i / this.#stars.length;
            ctx.fillRect(x, y, 1, 1);
        }

        ctx.globalAlpha = 1.0;
    }

    update(time, dt) {}
}