import { Point } from "./Point.mjs";
import { Vector } from "./Vector.mjs";
import { CanvasSize, clamp, drawImageCentered, getFrameIndex } from "./GameGame.mjs";
import { ParticleEmitter } from "./ParticleEmitter.mjs";
import { Gate } from "./Gate.mjs";

/**
 * px/s^2
 */
const ACCELERATION = 1;
const MAX_ACCELERATION = 2;

/**
 * px/s
 */
export const MAX_VELOCITY = 8;

/**
 * rad/s
 */
const TURNING_POWER = 4;

let MAX_SHIP_ID = 0;

export class Ship {
    _pos;

    #ship;
    #shipDestroyed;
    #enginesIdle;
    #enginesPowered;

    #smokeEmitter;

    _acceleration;
    _velocity;
    #justTeleported;
    #shipId;
    #name;
    #destroyed;

    _getGate;

    /**
     * @param {Point} pos 
     * @param {number} rot
     * @param {CanvasImageSource} ship
     * @param {CanvasImageSource[]} enginesIdle
     * @param {CanvasImageSource[]} enginesPowered
     * @param {CanvasImageSource} particleSmoke
     * @param {() => Gate} getGate
     */
    constructor(name, pos, rot, ship, shipDestroyed, enginesIdle, enginesPowered, particleSmoke, getGate) {
        this.#name = name;
        this._pos = pos.clone();
        this.#ship = ship;
        this.#shipDestroyed = shipDestroyed;
        this.#enginesIdle = enginesIdle;
        this.#enginesPowered = enginesPowered;
        this.#smokeEmitter = new ParticleEmitter(particleSmoke, 100);
        this._getGate = getGate;

        this._acceleration = new Vector(0, rot);
        this._velocity = new Vector(0, 0);
        this.#justTeleported = false;
        this.#destroyed = false;

        this.#shipId = MAX_SHIP_ID++;
    }

    get name() { return this.#name; }

    get pos() { return this._pos; }

    get shipId() { return this.#shipId; }

    get justTeleported() { return this.#justTeleported }

    /**
     * @returns {{ rotateCw: boolean, rotateCcw: boolean, accelerate: boolean }}
     */
    _processInput() {
        throw new Error("#processInput must be implemented in the subclass.")
    }

    destroy() {
        if (!this.#destroyed) {
            this.#destroyed = true;
        }
    }

    get destroyed() { return this.#destroyed; }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    render(ctx, time) {
        const fps = 5;
        const angle = this._acceleration.direction;

        const renderShipAt = (x, y) => {
            // if (this.#destroyed) {
            //     ctx.globalAlpha = 0.5;
            // }
            drawImageCentered(ctx, this.#destroyed ? this.#shipDestroyed : this.#ship, x, y, angle);
            // ctx.globalAlpha = 1.0;

            if (!this.#destroyed) {
                if (this._acceleration.magnitude == 0) {
                    const index = getFrameIndex(this.#enginesIdle.length, time, fps);
                    drawImageCentered(ctx, this.#enginesIdle[index], x, y, angle);
                } else {
                    const index = getFrameIndex(this.#enginesPowered.length, time, fps);
                    drawImageCentered(ctx, this.#enginesPowered[index], x, y, angle);
                }
            }
        }

        renderShipAt(this._pos.x, this._pos.y);

        if ((this._pos.x < this.#ship.width / 2) &&
            (this._pos.y < this.#ship.height / 2)) {
            renderShipAt(this._pos.x + CanvasSize.w, this._pos.y + CanvasSize.h);
        } else if (
            (CanvasSize.w - this._pos.x < this.#ship.width / 2) &&
            (CanvasSize.h - this._pos.y < this.#ship.height / 2)) {
            renderShipAt(this._pos.x - CanvasSize.w, this._pos.y - CanvasSize.h);
        }

        if (this._pos.x < this.#ship.width / 2) {
            renderShipAt(this._pos.x + CanvasSize.w, this._pos.y);
        } else if (CanvasSize.w - this._pos.x < this.#ship.width / 2) {
            renderShipAt(this._pos.x - CanvasSize.w, this._pos.y);
        }

        if (this._pos.y < this.#ship.height / 2) {
            renderShipAt(this._pos.x, this._pos.y + CanvasSize.h);
        } else if (CanvasSize.h - this._pos.y < this.#ship.height / 2) {
            renderShipAt(this._pos.x, this._pos.y - CanvasSize.h);
        }

        this.#smokeEmitter.render(ctx, time);
    }

    /**
     * 
     * @param {number} time 
     * @param {number} dt 
     */
    update(time, dt) {
        this.#justTeleported = false;

        const { accelerate, rotateCcw, rotateCw } = this.#destroyed ? { accelerate: false, rotateCcw: false, rotateCw: false } : this._processInput();

        if (accelerate) {
            this._acceleration.magnitude += ACCELERATION * dt / 1000.0;
        } else {
            this._acceleration.magnitude = 0;
        }

        if (rotateCw) {
            this._acceleration.direction += TURNING_POWER * dt / 1000.0;
        }
        if (rotateCcw) {
            this._acceleration.direction -= TURNING_POWER * dt / 1000.0;
        }
        if (this.#destroyed) {
            // spin a little bit when dead
            this._acceleration.direction += ((this.shipId % 2) * 2 - 1) * dt / 1000.0;
        }

        this._acceleration.magnitude = clamp(this._acceleration.magnitude, 0, MAX_ACCELERATION);

        this._velocity = this._velocity.add(this._acceleration);
        this._velocity.magnitude = clamp(this._velocity.magnitude, 0, MAX_VELOCITY);

        this._pos.x += this._velocity.magnitude * Math.cos(this._velocity.direction);
        this._pos.y += this._velocity.magnitude * Math.sin(this._velocity.direction);

        // toroidal wrapping
        if (this._pos.x < 0) {
            this._pos.x += CanvasSize.w;
            this.#justTeleported = true;
        } else if (this._pos.x >= CanvasSize.w) {
            this._pos.x -= CanvasSize.w;
            this.#justTeleported = true;
        }

        if (this._pos.y < 0) {
            this._pos.y += CanvasSize.h;
            this.#justTeleported = true;
        } else if (this._pos.y >= CanvasSize.h) {
            this._pos.y -= CanvasSize.h;
            this.#justTeleported = true;
        }

        if ((this._acceleration.magnitude > 0) && (Math.floor(time / 10) % 2 === 0)) {
            const randomDeviation = 3;
            const minLifetime = 500;
            const maxLifetime = 1500;
            const distanceFromCenter = 20;
            const radiansFromCenterLine = 0.3;

            this.#smokeEmitter.emit(
                this._pos.x + Math.cos(this._acceleration.direction - radiansFromCenterLine + Math.PI) * distanceFromCenter + (Math.random() - 0.5) * 2 * randomDeviation,
                this._pos.y + Math.sin(this._acceleration.direction - radiansFromCenterLine + Math.PI) * distanceFromCenter + (Math.random() - 0.5) * 2 * randomDeviation,
                minLifetime + Math.random() * (maxLifetime - minLifetime));
            this.#smokeEmitter.emit(
                this._pos.x + Math.cos(this._acceleration.direction + radiansFromCenterLine + Math.PI) * distanceFromCenter + (Math.random() - 0.5) * 2 * randomDeviation,
                this._pos.y + Math.sin(this._acceleration.direction + radiansFromCenterLine + Math.PI) * distanceFromCenter + (Math.random() - 0.5) * 2 * randomDeviation,
                minLifetime + Math.random() * (maxLifetime - minLifetime));
        }

        this.#smokeEmitter.update(time, dt);
    }
}