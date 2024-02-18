import { CanvasSize, drawTextCentered } from "./GameGame.mjs";

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
        drawTextCentered(ctx, (this.#timeRemaining / 1000.0).toFixed(1), CanvasSize.w / 2, 80, "#ffffff", "bold 48px sans-serif");
        drawTextCentered(ctx, this.#gatesCleared, CanvasSize.w / 2, 120, "#ffffff", "bold 32px sans-serif");
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