import { Keyboard } from "./GameGame.mjs";
import { Ship } from "./Ship.mjs";

export class Player extends Ship {
    _processInput() {
        const controls = { accelerate: false, rotateCcw: false, rotateCw: false };

        if (Keyboard.keyDown.w) {
            controls.accelerate = true;
        }

        if (Keyboard.keyDown.a) {
            controls.rotateCcw = true;
        } else if (Keyboard.keyDown.d) {
            controls.rotateCw = true;
        }

        return controls;
    }
}