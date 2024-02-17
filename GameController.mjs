import { CanvasSize } from "./GameGame.mjs";

export class GameController {
    #timeRemaining;
    #gatesCleared;

    constructor() {
        this.#timeRemaining = 10_000;
        this.#gatesCleared = 0;
    }

    incrementTime() {
        this.#gatesCleared++;
        this.#timeRemaining += 3_000;
    }

    get gatesCleared() { return this.#gatesCleared; }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} _time
     */
    render(ctx, _time) {

        const text = (this.#timeRemaining / 1000.0).toFixed(1);
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 32px sans-serif";

        const dimensions = ctx.measureText(text);
        ctx.fillText(text, (CanvasSize.w - dimensions.width) / 2, dimensions.fontBoundingBoxAscent);
    }

    /**
     * 
     * @param {number} _time 
     * @param {number} dt 
     */
    update(_time, dt) {
        this.#timeRemaining -= dt;
    }
}