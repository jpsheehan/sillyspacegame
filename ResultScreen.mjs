import { CanvasSize, drawTextCentered } from "./GameGame.mjs";
import { InputHelper } from "./InputHelper.mjs";
import { State } from "./State.mjs";

export class ResultScreen extends State {
    constructor(starfield) {
        super("result", { starfield },
            (_, args, data) => ({ ...data, ...args }),
            (time, dt, stateMachine, data) => {
                const { starfield, numEnemies, ships } = data;

                starfield.update(time, dt);

                for (let ship of ships) {
                    ship.update(time, dt);
                }

                if (InputHelper.advanceMenu) {
                    InputHelper.resetAdvanceMenu();
                    stateMachine.switchTo("intro", { numEnemies });
                }
            }, (ctx, time2, data) => {
                const { starfield, time, score, won, ships } = data;

                starfield.render(ctx, time2);

                for (let ship of ships) {
                    ship.render(ctx, time);
                }

                const center = CanvasSize.w / 2;
                const middle = CanvasSize.h / 2;

                const text = won ? "won" : "lost";

                drawTextCentered(ctx, `You ${text}!`, center, middle - 100, "#ffffff", "bold 32px sans-serif");
                drawTextCentered(ctx, `You cleared ${score} gates and survived for ${(time/1000).toFixed(0)} seconds!`, center, middle, "#ffffff", "bold 24px sans-serif");
                drawTextCentered(ctx, "Press Space to play again", center, middle + 100, "#ffffff", "bold 24px sans-serif")
            })
    }
}