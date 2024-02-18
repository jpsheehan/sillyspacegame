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

                const center = CanvasSize.w / 2;
                const middle = CanvasSize.h / 2;

                drawTextCentered(ctx, "Silly Space Game", center, middle - 150, "#ffffff", "bold 72px sans-serif");
                drawTextCentered(ctx, "W: Accelerate", center, middle - 50, undefined, "bold 48px sans-serif");
                drawTextCentered(ctx, "A, D: Rotate", center, middle);
                drawTextCentered(ctx, "Fly through the green gates", center, middle + 100);
                drawTextCentered(ctx, "Press Space to Start", center, middle + 200, "#ffffff", "bold 48px sans-serif");
            });
    }
}