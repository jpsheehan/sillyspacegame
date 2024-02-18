import { MAX_VELOCITY, Ship } from "./Ship.mjs";

export class Enemy extends Ship {
    /**
     * @returns {{ accelerate: boolean, rotateCcw: boolean, rotateCw: boolean }}
     */
    _processInput() {
        const controls = { accelerate: false, rotateCw: false, rotateCcw: false };

        const gate = this._getGate();
        const gateDiff = this._pos.sub(gate.midpoint).toPolar();

        let accelerationGateAngleDiff = this._acceleration.direction - gateDiff.direction - (gate.midpoint.x < this._pos.x ? Math.PI : 0);
        while (accelerationGateAngleDiff < 2 * Math.PI) accelerationGateAngleDiff += 2 * Math.PI;
        while (accelerationGateAngleDiff > 2 * Math.PI) accelerationGateAngleDiff -= 2 * Math.PI;
        const accelerationGateAngleUntolerable = (Math.abs(accelerationGateAngleDiff) > Math.PI / 16);

        let velocityGateAngleDiff = this._velocity.direction - gateDiff.direction - (gate.midpoint.x < this._pos.x ? Math.PI : 0);
        while (velocityGateAngleDiff < 2 * Math.PI) velocityGateAngleDiff += 2 * Math.PI;
        while (velocityGateAngleDiff > 2 * Math.PI) velocityGateAngleDiff -= 2 * Math.PI;
        const velocityGateAngleUntolerable = Math.abs(velocityGateAngleDiff) > Math.PI / 8;

        let velocityAccelerationAngleDiff = this._acceleration.direction - this._velocity.direction - Math.PI;
        while (velocityAccelerationAngleDiff < 2 * Math.PI) velocityAccelerationAngleDiff += 2 * Math.PI;
        while (velocityAccelerationAngleDiff > 2 * Math.PI) velocityAccelerationAngleDiff -= 2 * Math.PI;
        const velocityAccelerationAngleUntolerable = Math.abs(velocityAccelerationAngleDiff) > Math.PI / 4;

        if (accelerationGateAngleUntolerable) {

            if (velocityAccelerationAngleUntolerable) {
                if (this._velocity.magnitude > 1) {
                    // Reorient (prepare to brake)
                    if (velocityAccelerationAngleDiff < 0) {
                        controls.rotateCcw = true;
                    } else {
                        controls.rotateCw = true;
                    }
                } else {
                    // Reorient (prepare to boost)
                    if (accelerationGateAngleDiff < 0) {
                        controls.rotateCcw = true;
                    } else {
                        controls.rotateCw = true;
                    }
                }
            } else {
                // Brake
                // if (velocityGateAngleUntolerable) {
                controls.accelerate = true;
                // }
            }
        } else {
            if (this._velocity.magnitude < MAX_VELOCITY) {
                // Boost towards gate
                controls.accelerate = true;
            } else {
                // Reorient (prepare to brake)
                // if (velocityAccelerationAngleDiff < 0) {
                //     rotateCcw = true;
                // } else {
                //     rotateCw = true;
                // }
            }
        }

        return controls;
    }
}