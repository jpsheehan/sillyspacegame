import { GameGame, createSpriteFrames, loadImages } from "./GameGame.mjs";
import { Size } from "./Size.mjs";
import { Starfield } from "./Starfield.mjs";
import { StateMachine } from "./StateMachine.mjs";
import { IntroScreen } from "./IntroScreen.mjs";
import { PlayingScreen } from "./PlayingScreen.mjs";
import { ResultScreen } from "./ResultScreen.mjs";

const state = {
    /** @type {StateMachine} */
    stateMachine: null
};

GameGame(
    {
        canvasId: "canvas",
        width: 1024,
        height: 768,
        fps: 60
    },
    async (root) => {
        const width = parseInt(root.getAttribute("width"));
        const height = parseInt(root.getAttribute("height"));
        state.bounds = new Size(width, height);

        const images = await loadImages({
            ship: "assets/ship.png",
            shipDestroyed: "assets/ship_destroyed.png",
            enginesIdle: "assets/engines_idle.png",
            enginesPowered: "assets/engines_powered.png",
            particleSmoke: "assets/particle_smoke.png"
        });

        const enginesIdle = await createSpriteFrames(images.enginesIdle, 3, 1);
        const enginesPowered = await createSpriteFrames(images.enginesPowered, 4, 1);

        const sprites = { enginesIdle, enginesPowered };

        const assets = { images, sprites, sprites };

        const starfield = new Starfield(500, state.bounds);;

        state.stateMachine = new StateMachine(
            [
                new IntroScreen(starfield),
                new PlayingScreen(starfield, assets),
                new ResultScreen(starfield),
            ]
        );
    },
    (time, dt) => {
        // update
        state.stateMachine.update(time, dt);
    },
    (ctx, time) => {
        // render
        state.stateMachine.render(ctx, time);
    });