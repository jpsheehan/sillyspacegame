import { InputHelper } from "./InputHelper.mjs";
import { Ship } from "./Ship.mjs";

export class Player extends Ship {

    _processInput() {
        const controls = { accelerate: false, rotateCcw: false, rotateCw: false };

        if (InputHelper.acceleratePressed) {
            controls.accelerate = true;
        }

        if (InputHelper.rotateCounterClockwisePressed) {
            controls.rotateCcw = true;
        } else if (InputHelper.rotateClockwisePressed) {
            controls.rotateCw = true;
        }

        return controls;
    }
}