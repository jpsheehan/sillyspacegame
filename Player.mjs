import { Point } from "./Point.mjs";
import { Vector } from "./Vector.mjs";
import { CanvasSize, Keyboard, clamp, drawImageCentered, getFrameIndex } from "./GameGame.mjs";
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

    #autopilot;
    #getGate;

    // static #coefficientOfFriction = 1;

    /**
     * @param {Point} pos 
     * @param {number} rot
     * @param {CanvasImageSource} ship
     * @param {CanvasImageSource[]} enginesIdle
     * @param {CanvasImageSource[]} enginesPowered
     * @param {CanvasImageSource} particleSmoke
     * @param {HTMLAudioElement} engineSound
     * @param {() => Gate} getGate
     */
    constructor(pos, rot, ship, enginesIdle, enginesPowered, particleSmoke, engineSound, getGate) {
        this.#pos = pos.clone();
        this.#ship = ship;
        this.#enginesIdle = enginesIdle;
        this.#enginesPowered = enginesPowered;
        this.#engineSound = engineSound;
        this.#engineSound.loop = true;
        this.#engineSound.volume = 0.5;
        this.#smokeEmitter = new ParticleEmitter(particleSmoke, 100);
        this.#autopilot = false;
        this.#getGate = getGate;

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
        const angle = this.#acceleration.direction;

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
            renderShipAt(this.#pos.x + CanvasSize.w, this.#pos.y + CanvasSize.h);
        } else if (
            (CanvasSize.w - this.#pos.x < this.#ship.width / 2) &&
            (CanvasSize.h - this.#pos.y < this.#ship.height / 2)) {
            renderShipAt(this.#pos.x - CanvasSize.w, this.#pos.y - CanvasSize.h);
        }

        if (this.#pos.x < this.#ship.width / 2) {
            renderShipAt(this.#pos.x + CanvasSize.w, this.#pos.y);
        } else if (CanvasSize.w - this.#pos.x < this.#ship.width / 2) {
            renderShipAt(this.#pos.x - CanvasSize.w, this.#pos.y);
        }

        if (this.#pos.y < this.#ship.height / 2) {
            renderShipAt(this.#pos.x, this.#pos.y + CanvasSize.h);
        } else if (CanvasSize.h - this.#pos.y < this.#ship.height / 2) {
            renderShipAt(this.#pos.x, this.#pos.y - CanvasSize.h);
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

        let accelerate = false, rotateCw = false, rotateCcw = false;

        if (this.#autopilot) {
            const gate = this.#getGate();
            const gateDiff = this.#pos.sub(gate.midpoint).toPolar();

            let accelerationGateAngleDiff = this.#acceleration.direction - gateDiff.direction - (gate.midpoint.x < this.#pos.x ? Math.PI : 0);
            while (accelerationGateAngleDiff < 2 * Math.PI) accelerationGateAngleDiff += 2 * Math.PI;
            while (accelerationGateAngleDiff > 2 * Math.PI) accelerationGateAngleDiff -= 2 * Math.PI;
            const accelerationGateAngleUntolerable = (Math.abs(accelerationGateAngleDiff) > Math.PI / 16);

            let velocityGateAngleDiff = this.#velocity.direction - gateDiff.direction - (gate.midpoint.x < this.#pos.x ? Math.PI : 0);
            while (velocityGateAngleDiff < 2 * Math.PI) velocityGateAngleDiff += 2 * Math.PI;
            while (velocityGateAngleDiff > 2 * Math.PI) velocityGateAngleDiff -= 2 * Math.PI;
            const velocityGateAngleUntolerable = Math.abs(velocityGateAngleDiff) > Math.PI / 16;

            let velocityAccelerationAngleDiff = this.#acceleration.direction - this.#velocity.direction - Math.PI;
            while (velocityAccelerationAngleDiff < 2 * Math.PI) velocityAccelerationAngleDiff += 2 * Math.PI;
            while (velocityAccelerationAngleDiff > 2 * Math.PI) velocityAccelerationAngleDiff -= 2 * Math.PI;
            const velocityAccelerationAngleUntolerable = Math.abs(velocityAccelerationAngleDiff) > Math.PI / 4;

            if (accelerationGateAngleUntolerable) {

                if (velocityAccelerationAngleUntolerable) {
                    if (this.#velocity.magnitude > 1) {
                        // Reorient (prepare to brake)
                        if (velocityAccelerationAngleDiff < 0) {
                            rotateCcw = true;
                        } else {
                            rotateCw = true;
                        }
                    } else {
                        // Reorient (prepare to boost)
                        if (accelerationGateAngleDiff < 0) {
                            rotateCcw = true;
                        } else {
                            rotateCw = true;
                        }
                    }
                } else {
                    // Brake
                    // if (velocityGateAngleUntolerable) {
                    accelerate = true;
                    // }
                }
            } else {
                if (this.#velocity.magnitude < MAX_VELOCITY) {
                    // Boost towards gate
                    accelerate = true;
                } else {
                    // Reorient (prepare to brake)
                    if (velocityAccelerationAngleDiff < 0) {
                        rotateCcw = true;
                    } else {
                        rotateCw = true;
                    }
                }
            }
        } else {
            if (Keyboard.keyDown.w) {
                accelerate = true;
            }

            if (Keyboard.keyDown.a) {
                rotateCcw = true;
            } else if (Keyboard.keyDown.d) {
                rotateCw = true;
            }
        }

        if (accelerate) {
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

        if (rotateCw) {
            this.#acceleration.direction += TURNING_POWER * dt / 1000.0;
        }
        if (rotateCcw) {
            this.#acceleration.direction -= TURNING_POWER * dt / 1000.0;
        }

        this.#acceleration.magnitude = clamp(this.#acceleration.magnitude, 0, MAX_ACCELERATION);

        this.#velocity = this.#velocity.add(this.#acceleration);
        this.#velocity.magnitude = clamp(this.#velocity.magnitude, 0, MAX_VELOCITY);

        this.#pos.x += this.#velocity.magnitude * Math.cos(this.#velocity.direction);
        this.#pos.y += this.#velocity.magnitude * Math.sin(this.#velocity.direction);

        // toroidal wrapping
        if (this.#pos.x < 0) {
            this.#pos.x += CanvasSize.w;
            this.#justTeleported = true;
        } else if (this.#pos.x >= CanvasSize.w) {
            this.#pos.x -= CanvasSize.w;
            this.#justTeleported = true;
        }

        if (this.#pos.y < 0) {
            this.#pos.y += CanvasSize.h;
            this.#justTeleported = true;
        } else if (this.#pos.y >= CanvasSize.h) {
            this.#pos.y -= CanvasSize.h;
            this.#justTeleported = true;
        }

        if ((this.#acceleration.magnitude > 0) && (Math.floor(time / 10) % 2 === 0)) {
            const randomDeviation = 3;
            const minLifetime = 500;
            const maxLifetime = 1500;
            const distanceFromCenter = 20;
            const radiansFromCenterLine = 0.3;

            this.#smokeEmitter.emit(
                this.#pos.x + Math.cos(this.#acceleration.direction - radiansFromCenterLine + Math.PI) * distanceFromCenter + (Math.random() - 0.5) * 2 * randomDeviation,
                this.#pos.y + Math.sin(this.#acceleration.direction - radiansFromCenterLine + Math.PI) * distanceFromCenter + (Math.random() - 0.5) * 2 * randomDeviation,
                minLifetime + Math.random() * (maxLifetime - minLifetime));
            this.#smokeEmitter.emit(
                this.#pos.x + Math.cos(this.#acceleration.direction + radiansFromCenterLine + Math.PI) * distanceFromCenter + (Math.random() - 0.5) * 2 * randomDeviation,
                this.#pos.y + Math.sin(this.#acceleration.direction + radiansFromCenterLine + Math.PI) * distanceFromCenter + (Math.random() - 0.5) * 2 * randomDeviation,
                minLifetime + Math.random() * (maxLifetime - minLifetime));
        }

        this.#smokeEmitter.update(time, dt);
    }
}