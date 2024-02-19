import { CanvasSize, Keyboard, drawTextCentered } from "./GameGame.mjs";
import { State } from "./State.mjs";

export class WinScreen extends State {
    constructor(starfield) {
        super("win", { starfield },
            (_, args, data) => ({ ...data, score: args.score, time: args.time, numEnemies: args.numEnemies }),
            (time, dt, stateMachine, data) => {
                const { starfield, numEnemies } = data;

                starfield.update(time, dt);

                if (Keyboard.keyDown.space) {
                    Keyboard.reset();
                    stateMachine.switchTo("intro", { numEnemies });
                }
            }, (ctx, time2, data) => {
                const { starfield, time, score } = data;

                starfield.render(ctx, time2);

                const center = CanvasSize.w / 2;
                const middle = CanvasSize.h / 2;

                drawTextCentered(ctx, "You won!", center, middle - 100, "#ffffff", "bold 32px sans-serif");
                drawTextCentered(ctx, `You cleared ${score} gates and survived for ${(time/1000).toFixed(0)} seconds!`, center, middle, "#ffffff", "bold 24px sans-serif");
                drawTextCentered(ctx, "Press Space to play again", center, middle + 100, "#ffffff", "bold 24px sans-serif")
            })
    }
}