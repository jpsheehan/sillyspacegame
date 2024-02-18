import { GameGame, createSpriteFrames, loadImages, loadSounds } from "./GameGame.mjs";
import { Player } from "./Player.mjs";
import { Size } from "./Size.mjs";
import { Point } from "./Point.mjs";
import { GateManager } from "./GateManager.mjs";
import { GameController } from "./GameController.mjs";
import { Starfield } from "./Starfield.mjs";
import { Enemy } from "./Enemy.mjs";
import { StateMachine } from "./StateMachine.mjs";
import { State } from "./State.mjs";
import { IntroScreen } from "./IntroScreen.mjs";
import { PlayingScreen } from "./PlayingScreen.mjs";
import { WinScreen } from "./WinScreen.mjs";
import { LoseScreen } from "./LoseScreen.mjs";

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
            enginesIdle: "assets/engines_idle.png",
            enginesPowered: "assets/engines_powered.png",
            particleSmoke: "assets/particle_smoke.png"
        });

        const sounds = await loadSounds({
            engine: "assets/engine.ogg",
            gate: "assets/gate.ogg"
        });

        const enginesIdle = await createSpriteFrames(images.enginesIdle, 3, 1);
        const enginesPowered = await createSpriteFrames(images.enginesPowered, 4, 1);

        const sprites = { enginesIdle, enginesPowered };

        const assets = { images, sounds, sprites, sprites };

        const starfield = new Starfield(500, state.bounds);;

        state.stateMachine = new StateMachine(
            [
                new IntroScreen(starfield),
                new PlayingScreen(starfield, assets),
                new WinScreen(starfield),
                new LoseScreen(starfield)
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