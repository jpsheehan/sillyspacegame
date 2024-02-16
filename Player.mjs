import { Point } from "./Point.mjs";
import { Vector } from "./Vector.mjs";
import { Keyboard, clamp, drawImageCentered, getFrameIndex } from "./GameGame.mjs";
import { ParticleEmitter } from "./ParticleEmitter.mjs";

/**
 * px/s^2
 */
const ACCELERATION = 1;
const MAX_ACCELERATION = 2;

/**
 * px/s
 */
const MAX_VELOCITY = 8;

/**
 * rad/s
 */
const TURNING_POWER = 4;

/**
 * px/s
 */
const BRAKING = 10;

export class Player {
    #pos;
    #ship;
    #enginesIdle;
    #enginesPowered;
    #smokeEmitter;

    #acceleration;
    #velocity;

    // static #coefficientOfFriction = 1;

    /**
     * @param {Point} pos 
     * @param {number} rot
     * @param {CanvasImageSource} ship
     * @param {CanvasImageSource[]} enginesIdle
     * @param {CanvasImageSource[]} enginesPowered
     * @param {CanvasImageSource} particleSmoke
     */
    constructor(pos, rot, ship, enginesIdle, enginesPowered, particleSmoke) {
        this.#pos = pos;
        this.#ship = ship;
        this.#enginesIdle = enginesIdle;
        this.#enginesPowered = enginesPowered;
        this.#smokeEmitter = new ParticleEmitter(particleSmoke, 30);

        this.#acceleration = new Vector(0, rot);
        this.#velocity = new Vector(0, 0);
    }

    get pos() { return this.#pos; }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    render(ctx, time) {
        const fps = 5;
        const angle = -this.#acceleration.direction + Math.PI / 2;
        drawImageCentered(ctx, this.#ship, this.#pos.x, this.#pos.y, angle);
        if (this.#acceleration.magnitude == 0) {
            const index = getFrameIndex(this.#enginesIdle.length, time, fps);
            drawImageCentered(ctx, this.#enginesIdle[index], this.#pos.x, this.#pos.y, angle);
        } else {
            const index = getFrameIndex(this.#enginesPowered.length, time, fps);
            drawImageCentered(ctx, this.#enginesPowered[index], this.#pos.x, this.#pos.y, angle);
            if (Math.floor(time / 10) % 2 === 0) {
                this.#smokeEmitter.emit(this.#pos.x + (Math.random() - 0.5) * 10, this.#pos.y + (Math.random() - 0.5) * 10, 1000 + Math.random() * 500);
            }
        }

        this.#smokeEmitter.render(ctx, time);
    }

    /**
     * 
     * @param {number} time 
     * @param {number} dt 
     */
    update(time, dt) {
        if (Keyboard.keyDown.w) {
            // move forward
            this.#acceleration.magnitude += ACCELERATION * dt / 1000.0;
        } else if (Keyboard.keyDown.s) {
            // move backward
            this.#velocity.magnitude -= BRAKING * dt / 1000.0;
        } else {
            this.#acceleration.magnitude = 0;
        }

        if (Keyboard.keyDown.a) {
            // rotate counter-clockwise
            this.#acceleration.direction += TURNING_POWER * dt / 1000.0;
        } else if (Keyboard.keyDown.d) {
            // rotate clockwise
            this.#acceleration.direction -= TURNING_POWER * dt / 1000.0;
        }

        if (Keyboard.keyDown.space) {
            // shoot
        }

        this.#acceleration.magnitude = clamp(this.#acceleration.magnitude, 0, MAX_ACCELERATION);

        this.#velocity = this.#velocity.add(this.#acceleration);
        this.#velocity.magnitude = clamp(this.#velocity.magnitude, 0, MAX_VELOCITY);

        this.#pos.x += this.#velocity.magnitude * Math.cos(this.#velocity.direction);
        this.#pos.y -= this.#velocity.magnitude * Math.sin(this.#velocity.direction);

        // TODO: Fix
        if (this.#pos.y < 0 || this.#pos.y >= 600 - this.#ship.height) {
            this.#acceleration.magnitude = 0;
            this.#velocity.magnitude = 0;
        }
        this.#pos.y = clamp(this.#pos.y, 0, 600 - this.#ship.height);

        this.#smokeEmitter.update(time, dt);
    }
}