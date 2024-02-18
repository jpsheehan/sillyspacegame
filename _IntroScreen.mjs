import { CanvasSize, Keyboard, drawTextCentered } from "./GameGame.mjs";
import { Starfield } from "./Starfield.mjs";
import { State } from "./State.mjs";

export class IntroScreen extends State {
    /**
     * 
     * @param {Starfield} starfield 
     */
    constructor(starfield) {
        super("intro", { starfield },
            undefined,
            (time, dt, stateMachine, data) => {
                const { starfield } = data;
                starfield.update(time, dt);

                if (Keyboard.keyDown.space) {
                    stateMachine.switchTo("playing");
                }
            },
            (ctx, time, data) => {
                const { starfield } = data;

                starfield.render(ctx, time)

                drawTextCentered(ctx, "Press Space to Start", CanvasSize.w / 2, CanvasSize.h / 2, "#ffffff", "bold 48px sans-serif");
            });
    }
}