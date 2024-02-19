import { CanvasSize, Keyboard, Mouse, drawTextCentered } from "./GameGame.mjs";
import { InputHelper } from "./InputHelper.mjs";
import { Starfield } from "./Starfield.mjs";
import { State } from "./State.mjs";

const URL = "https://github.com/jpsheehan/sillyspacegame";

export class IntroScreen extends State {
    #urlDimensions;

    /**
     * 
     * @param {Starfield} starfield 
     */
    constructor(starfield) {
        super("intro", { starfield, numEnemies: 1 },
            (_, args, data) => ({ starfield: data.starfield, numEnemies: args?.numEnemies ?? data.numEnemies }),
            (time, dt, stateMachine, data) => {
                const { starfield } = data;
                starfield.update(time, dt);

                if (InputHelper.advanceMenu) {
                    stateMachine.switchTo("playing", { numEnemies: data.numEnemies });
                }

                if (Keyboard.keyDown['1']) {
                    data.numEnemies = 1;
                } else if (Keyboard.keyDown['2']) {
                    data.numEnemies = 2;
                } else if (Keyboard.keyDown['3']) {
                    data.numEnemies = 3;
                } else if (Keyboard.keyDown['4']) {
                    data.numEnemies = 4;
                } else if (Keyboard.keyDown['5']) {
                    data.numEnemies = 5;
                }

                if (this.#urlDimensions) {
                    if (Mouse.x >= this.#urlDimensions.x && Mouse.x < (this.#urlDimensions.x + this.#urlDimensions.width) &&
                        Mouse.y >= this.#urlDimensions.y && Mouse.y < (this.#urlDimensions.y + this.#urlDimensions.height)) {
                        if (Mouse.keyDown.left) {
                            window.open(URL, "_blank");
                            Mouse.reset();
                        } else {
                            document.body.style.cursor = "pointer";
                        }
                    } else {
                        document.body.style.cursor = "default";
                    }
                }
            },
            (ctx, time, data) => {
                const { starfield, numEnemies } = data;

                starfield.render(ctx, time)

                const center = CanvasSize.w / 2;
                const middle = CanvasSize.h / 2;

                drawTextCentered(ctx, "Silly Space Game", center, middle - 175, "#ffffff", "bold 72px sans-serif");
                drawTextCentered(ctx, "Fly through the green gates", center, middle - 75, "white", "bold 48px sans-serif");

                drawTextCentered(ctx, "W: Accelerate", center, middle + 25, "white", "bold 48px sans-serif");
                drawTextCentered(ctx, "A, D: Rotate", center, middle + 75);
                drawTextCentered(ctx, `# Enemies: ${numEnemies} (1 - 5)`, center, middle + 175)
                drawTextCentered(ctx, "Press Space to Start", center, middle + 250, "#ffffff", "bold 48px sans-serif");

                ctx.font = "18px sans-serif";
                ctx.fillText("A game by Jesse Sheehan", 20, CanvasSize.h - 20);

                if (!this.#urlDimensions) {
                    const dimensions = ctx.measureText(URL);
                    this.#urlDimensions = {
                        width: dimensions.width,
                        height: dimensions.fontBoundingBoxAscent,
                        x: CanvasSize.w - 20 - dimensions.width,
                        y: CanvasSize.h - 20 - dimensions.fontBoundingBoxAscent
                    }
                }
                ctx.fillText(URL, this.#urlDimensions.x, this.#urlDimensions.y + this.#urlDimensions.height);

                ctx.beginPath();
                ctx.moveTo(this.#urlDimensions.x, this.#urlDimensions.y + this.#urlDimensions.height + 3);
                ctx.lineTo(this.#urlDimensions.x + this.#urlDimensions.width, this.#urlDimensions.y + this.#urlDimensions.height + 3);
                ctx.closePath();
                ctx.stroke();
            });
    }
}