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
        return enemieScores.every(enemyScore => enemyScore.ship.destroyed);
    }

    get isLost() {
        const playerScore = Object.values(this.#scores).find(score => score.ship instanceof Player);
        return playerScore.ship.destroyed;
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
        const highestScore = Math.max.apply(null, Object.values(this.#scores).map(score => score.gatesCleared));
        for (let score of Object.values(this.#scores)) {
            const x = (i + 1) * CanvasSize.w / (Object.keys(this.#scores).length + 1)

            const decimalPlaces = score.timeRemaining < 1000 ? 2 : score.timeRemaining < 10000 ? 1 : 0;

            const winning = highestScore === score.gatesCleared;
            const defaultColor = winning ? "gold" : "white";

            const scoreText = score.ship.destroyed ? "☠️" : (score.timeRemaining / 1000.0).toFixed(decimalPlaces);
            const scoreColor = score.ship.destroyed ? defaultColor : score.timeRemaining < 5000.0 ? "red" : defaultColor;

            const nameText = /*winning ? "👑 " + score.name + " 👑" :*/ score.name;

            drawTextCentered(ctx, nameText, x, 40, defaultColor, "bold 24px sans-serif");
            drawTextCentered(ctx, scoreText, x, 105, scoreColor, "bold 48px sans-serif");
            drawTextCentered(ctx, score.gatesCleared, x, 140, defaultColor, "bold 32px sans-serif");

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