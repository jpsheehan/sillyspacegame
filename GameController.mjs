import { Enemy } from "./Enemy.mjs";
import { CanvasSize, drawTextCentered } from "./GameGame.mjs";
import { Player } from "./Player.mjs";
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
                name: ship.name,
                ship
            }
        }
    }

    incrementTime(shipId) {
        const score = this.#scores[shipId];
        score.gatesCleared++;
        score.timeRemaining += 5_000;
    }

    get isWon() {
        /** @type {Enemy[]} */
        const enemieScores = Object.values(this.#scores).filter(score => score.ship instanceof Enemy);
        return enemieScores.every(enemyScore => enemyScore.timeRemaining <= 0);
    }

    get isLost() {
        const playerScore = Object.values(this.#scores).find(score => score.ship instanceof Player);
        return playerScore.timeRemaining <= 0;
    }

    get playerScore() {
        const playerScore = Object.values(this.#scores).find(score => score.ship instanceof Player);
        return { score: playerScore.gatesCleared, time: playerScore.timeRemaining };
    }

    get mostGatesCleared() { return Math.max.apply(null, Object.values(this.#scores).map(score => score.gatesCleared)); }

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
            const score = this.#scores[shipId];

            score.timeRemaining -= dt;
            if (score.timeRemaining < 0) {
                score.timeRemaining = 0;
            }
        }
    }
}