import { CanvasSize, drawTextCentered } from "./GameGame.mjs";
import { Ship } from "./Ship.mjs";

export class GameController {
    #scores;

    /**
     * 
     * @param {Ship[]} ships 
     */
    constructor(ships) {
        this.#scores = {};
        for (let ship of ships) {
            this.#scores[ship.shipId] = {
                timeRemaining: 15_000,
                gatesCleared: 0,
                name: ship.name
            }
        }
    }

    incrementTime(shipId) {
        const score = this.#scores[shipId];
        score.gatesCleared++;
        score.timeRemaining += 5_000;
    }

    get mostGatesCleared() { return Math.max.apply(null, Object.keys(this.#scores).map(shipId => this.#scores[shipId].gatesCleared)); }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} _time
     */
    render(ctx, _time) {
        for (let i = 0; i < Object.keys(this.#scores).length; i++) {
            const score = this.#scores[i];
            const x = (i + 1) * CanvasSize.w / (Object.keys(this.#scores).length + 1)

            drawTextCentered(ctx, score.name, x, 40, "#ffffff", "bold 24px sans-serif");
            drawTextCentered(ctx, (score.timeRemaining / 1000.0).toFixed(1), x, 105, "#ffffff", "bold 48px sans-serif");
            drawTextCentered(ctx, score.gatesCleared, x, 140, "#ffffff", "bold 32px sans-serif");
        }
    }

    /**
     * 
     * @param {number} _time 
     * @param {number} dt 
     */
    update(_time, dt) {
        for (let shipId of Object.keys(this.#scores)) {
            this.#scores[shipId].timeRemaining -= dt;
        }
    }
}