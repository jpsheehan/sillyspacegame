import { GameController } from "./GameController.mjs";
import { CanvasSize } from "./GameGame.mjs";
import { Gate } from "./Gate.mjs";
import { Point } from "./Point.mjs";

export class GateManager {

    #ships;
    #gate;
    #nextGate;
    #previousPositions;
    #gameController;
    #gateSound;

    get gate() { return this.#gate; }

    /**
     * 
     * @param {Ship[]} ships 
     * @param {GameController} gameController
     * @param {HTMLAudioElement} gateSound
     */
    constructor(ships, gameController, gateSound) {
        this.#ships = ships;
        this.#gameController = gameController;
        this.#gateSound = gateSound;

        this.#gate = this.#createRandomGate();
        this.#nextGate = this.#createRandomGate();

        this.#previousPositions = this.#ships.map(ship => ship.pos.clone());
    }

    /**
     * 
     * @returns {Gate}
     */
    #createRandomGate() {
        const gap = Math.max(200 - this.#gameController.mostGatesCleared * 2, 50);
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
        this.#nextGate.render(ctx, "#888888");
        this.#gate.render(ctx, "#00ff00");
    }

    update() {
        for (let i = 0; i < this.#ships.length; i++) {
            const ship = this.#ships[i];
            const previousPos = this.#previousPositions[i];

            if (!ship.justTeleported && !ship.destroyed && this.intersects(this.#gate.a, this.#gate.b, ship.pos, previousPos)) {
                this.#gameController.incrementTime(ship.shipId);
                this.#gateSound.play();

                this.#gate = this.#nextGate;
                this.#nextGate = this.#createRandomGate();
            }

            this.#previousPositions[i] = ship.pos.clone();
        }
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