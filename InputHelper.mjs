import { CanvasSize, Keyboard, Pointer } from "./GameGame.mjs";

class _InputHelper
{
    get leftZonePressed() {
        return Pointer.pointsDown.some(point => point.x < CanvasSize.w / 2);
    }

    get rightZonePressed() {
        return Pointer.pointsDown.some(point => point.x > CanvasSize.w / 2);
    }

    get acceleratePressed() {
        return Keyboard.keyDown.w || (this.leftZonePressed && this.rightZonePressed);
    }

    get rotateClockwisePressed() {
        return Keyboard.keyDown.d || (this.rightZonePressed && !this.leftZonePressed);
    }

    get rotateCounterClockwisePressed() {
        return Keyboard.keyDown.a || (this.leftZonePressed && !this.rightZonePressed);
    }

    get advanceMenu() {
        return Keyboard.keyDown.space || (this.leftZonePressed && this.rightZonePressed);
    }

    resetAdvanceMenu() {
        Keyboard.reset();
        Pointer.reset();
    }
}

export const InputHelper = new _InputHelper();