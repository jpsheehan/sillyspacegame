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

export class Player {
    #pos;
    
    #ship;
    #enginesIdle;
    #enginesPowered;

    #engineSound;

    #smokeEmitter;

    #acceleration;
    #velocity;
    #justTeleported;

    // static #coefficientOfFriction = 1;

    /**
     * @param {Point} pos 
     * @param {number} rot
     * @param {CanvasImageSource} ship
     * @param {CanvasImageSource[]} enginesIdle
     * @param {CanvasImageSource[]} enginesPowered
     * @param {CanvasImageSource} particleSmoke
     * @param {HTMLAudioElement} engineSound
     */
    constructor(pos, rot, ship, enginesIdle, enginesPowered, particleSmoke, engineSound) {
        this.#pos = pos;
        this.#ship = ship;
        this.#enginesIdle = enginesIdle;
        this.#enginesPowered = enginesPowered;
        this.#engineSound = engineSound;
        this.#engineSound.loop = true;
        this.#engineSound.volume = 0.5;
        this.#smokeEmitter = new ParticleEmitter(particleSmoke, 100);

        this.#acceleration = new Vector(0, rot);
        this.#velocity = new Vector(0, 0);
        this.#justTeleported = false;
    }

    get pos() { return this.#pos; }

    get justTeleported() { return this.#justTeleported }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     */
    render(ctx, time) {
        const fps = 5;
        const angle = -this.#acceleration.direction + Math.PI / 2;

        const renderShipAt = (x, y) => {
            drawImageCentered(ctx, this.#ship, x, y, angle);
            if (this.#acceleration.magnitude == 0) {
                const index = getFrameIndex(this.#enginesIdle.length, time, fps);
                drawImageCentered(ctx, this.#enginesIdle[index], x, y, angle);
            } else {
                const index = getFrameIndex(this.#enginesPowered.length, time, fps);
                drawImageCentered(ctx, this.#enginesPowered[index], x, y, angle);
            }
        }

        renderShipAt(this.#pos.x, this.#pos.y);

        if ((this.#pos.x < this.#ship.width / 2) &&
            (this.#pos.y < this.#ship.height / 2)) {
            renderShipAt(this.#pos.x + 800, this.#pos.y + 600);
        } else if (
            (800 - this.#pos.x < this.#ship.width / 2) &&
            (600 - this.#pos.y < this.#ship.height / 2)) {
            renderShipAt(this.#pos.x - 800, this.#pos.y - 600);
        }

        if (this.#pos.x < this.#ship.width / 2) {
            renderShipAt(this.#pos.x + 800, this.#pos.y);
        } else if (800 - this.#pos.x < this.#ship.width / 2) {
            renderShipAt(this.#pos.x - 800, this.#pos.y);
        }

        if (this.#pos.y < this.#ship.height / 2) {
            renderShipAt(this.#pos.x, this.#pos.y + 600);
        } else if (600 - this.#pos.y < this.#ship.height / 2) {
            renderShipAt(this.#pos.x, this.#pos.y - 600);
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

        if (Keyboard.keyDown.w) {
            this.#acceleration.magnitude += ACCELERATION * dt / 1000.0;
            if (this.#engineSound.paused) {
                this.#engineSound.play();
            }
        } else {
            this.#acceleration.magnitude = 0;
            if (!this.#engineSound.paused) {
                this.#engineSound.pause();
            }
        }

        if (Keyboard.keyDown.a) {
            this.#acceleration.direction += TURNING_POWER * dt / 1000.0;
        } else if (Keyboard.keyDown.d) {
            this.#acceleration.direction -= TURNING_POWER * dt / 1000.0;
        }

        this.#acceleration.magnitude = clamp(this.#acceleration.magnitude, 0, MAX_ACCELERATION);

        this.#velocity = this.#velocity.add(this.#acceleration);
        this.#velocity.magnitude = clamp(this.#velocity.magnitude, 0, MAX_VELOCITY);

        this.#pos.x += this.#velocity.magnitude * Math.cos(this.#velocity.direction);
        this.#pos.y -= this.#velocity.magnitude * Math.sin(this.#velocity.direction);

        // toroidal wrapping
        // TODO: replace with actual width and height of window
        if (this.#pos.x < 0) {
            this.#pos.x += 800;
            this.#justTeleported = true;
        } else if (this.#pos.x >= 800) {
            this.#pos.x -= 800;
            this.#justTeleported = true;
        }

        if (this.#pos.y < 0) {
            this.#pos.y += 600;
            this.#justTeleported = true;
        } else if (this.#pos.y >= 600) {
            this.#pos.y -= 600;
            this.#justTeleported = true;
        }

        if ((this.#acceleration.magnitude > 0) && (Math.floor(time / 10) % 2 === 0)) {
            const randomDeviation = 3;
            const minLifetime = 500;
            const maxLifetime = 1500;
            const distanceFromCenter = 20;
            const radiansFromCenterLine = 0.3;

            this.#smokeEmitter.emit(
                this.#pos.x - Math.cos(this.#acceleration.direction - radiansFromCenterLine) * distanceFromCenter + (Math.random() - 0.5) * 2 * randomDeviation,
                this.#pos.y + Math.sin(this.#acceleration.direction - radiansFromCenterLine) * distanceFromCenter + (Math.random() - 0.5) * 2 * randomDeviation,
                minLifetime + Math.random() * (maxLifetime - minLifetime));
            this.#smokeEmitter.emit(
                this.#pos.x - Math.cos(this.#acceleration.direction + radiansFromCenterLine) * distanceFromCenter + (Math.random() - 0.5) * 2 * randomDeviation,
                this.#pos.y + Math.sin(this.#acceleration.direction + radiansFromCenterLine) * distanceFromCenter + (Math.random() - 0.5) * 2 * randomDeviation,
                minLifetime + Math.random() * (maxLifetime - minLifetime));
        }

        this.#smokeEmitter.update(time, dt);
    }
}