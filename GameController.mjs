import { Enemy } from "./Enemy.mjs";
import { CanvasSize, drawTextCentered } from "./GameGame.mjs";
import { Player } from "./Player.mjs";
import { Ship } from "./Ship.mjs";

export class GameController {
    #scores;
    #totalTime;

    /**
     * 
     * @param {Ship[]} ships 
     */
    constructor(ships) {
        this.#totalTime = 0;
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
        return { score: playerScore.gatesCleared, time: this.#totalTime };
    }

    get mostGatesCleared() { return Math.max.apply(null, Object.values(this.#scores).map(score => score.gatesCleared)); }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} _time
     */
    render(ctx, _time) {
        let i = 0;
        for (let score of Object.values(this.#scores)) {
            const x = (i + 1) * CanvasSize.w / (Object.keys(this.#scores).length + 1)

            const scoreText = score.ship.destroyed ? "☠️" : (score.timeRemaining / 1000.0).toFixed(1);

            drawTextCentered(ctx, score.name, x, 40, "#ffffff", "bold 24px sans-serif");
            drawTextCentered(ctx, scoreText, x, 105, "#ffffff", "bold 48px sans-serif");
            drawTextCentered(ctx, score.gatesCleared, x, 140, "#ffffff", "bold 32px sans-serif");

            i++;
        }
    }

    /**
     * 
     * @param {number} _time 
     * @param {number} dt 
     */
    update(_time, dt) {
        this.#totalTime += dt;

        for (let shipId of Object.keys(this.#scores)) {
            const score = this.#scores[shipId];
            if (!score.ship.destroyed) {

                score.timeRemaining -= dt;
                if (score.timeRemaining < 0) {
                    score.timeRemaining = 0;
                    score.ship.destroy();
                }
            }
        }
    }
}