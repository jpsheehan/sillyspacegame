import { Gate } from "./Gate.mjs";
import { Player } from "./Player.mjs";
import { Point } from "./Point.mjs";

export class GateManager {

    #player;
    #gate;
    #previousPos;

    /**
     * 
     * @param {Player} player 
     */
    constructor(player) {
        this.#player = player;
        this.#gate = this.#createRandomGate();
        this.#previousPos = this.#player.pos;
    }

    /**
     * 
     * @returns {Gate}
     */
    #createRandomGate() {
        return new Gate(new Point(
            Math.random() * 600 + 100,
            Math.random() * 400 + 100),
            200,
            Math.random() * Math.PI * 2);
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} time 
     */
    render(ctx, time) {
        this.#gate.render(ctx, time);
        if (this.#lastIntersection) {
            ctx.fillStyle = "#ff0000";
            ctx.fillRect(this.#lastIntersection.x - 5, this.#lastIntersection.y - 5, 10, 10)
        }
    }

    /**
     * 
     * @param {number} time 
     * @param {number} dt 
     */
    update(time, dt) {
        if (!this.#player.justTeleported && this.intersects(this.#gate.a, this.#gate.b, this.#player.pos, this.#previousPos)) {
            this.#gate = this.#createRandomGate();
        }

        this.#previousPos = this.#player.pos.clone();
    }

    #lastIntersection;

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