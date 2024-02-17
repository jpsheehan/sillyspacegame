import { GameController } from "./GameController.mjs";
import { CanvasSize } from "./GameGame.mjs";
import { Gate } from "./Gate.mjs";
import { Player } from "./Player.mjs";
import { Point } from "./Point.mjs";

export class GateManager {

    #player;
    #gate;
    #previousPos;
    #gameController;
    #gateSound;

    /**
     * 
     * @param {Player} player 
     * @param {GameController} gameController
     * @param {HTMLAudioElement} gateSound
     */
    constructor(player, gameController, gateSound) {
        this.#player = player;
        this.#gameController = gameController;
        this.#gateSound = gateSound;

        this.#gate = this.#createRandomGate();
        this.#previousPos = this.#player.pos;
    }

    /**
     * 
     * @returns {Gate}
     */
    #createRandomGate() {
        const gap = Math.max(200 - this.#gameController.gatesCleared * 2, 50);
        return new Gate(new Point(
            Math.random() * (CanvasSize.w - 200) + 100,
            Math.random() * (CanvasSize.h - 200) + 100),
            gap,
            Math.random() * Math.PI * 2);
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} time 
     */
    render(ctx, time) {
        this.#gate.render(ctx, time);
    }

    /**
     * 
     * @param {number} time 
     * @param {number} dt 
     */
    update(time, dt) {
        if (!this.#player.justTeleported && this.intersects(this.#gate.a, this.#gate.b, this.#player.pos, this.#previousPos)) {
            this.#gameController.incrementTime();
            this.#gateSound.play();
            this.#gate = this.#createRandomGate();
        }

        this.#previousPos = this.#player.pos.clone();
    }

    /**
     * 
     * @param {Point} a 
     * @param {Point} b 
     * @param {Point} c 
     * @param {Point} d 
     * @returns {boolean}
     * @see https://stackoverflow.com/a/563275
     * @see https://stackoverflow.com/a/1201356
     */
    intersects(a, b, c, d) {
        const e = b.sub(a);
        const f = d.sub(c);

        const p = new Point(-e.y, e.x);
        const q = new Point(-f.y, f.x);

        const g = b.sub(d).dot(q) / e.dot(q);
        const h = a.sub(c).dot(p) / f.dot(p);

        return (0 < h) && (h < 1) && (0 < g) && (g < 1);
    }
}