import { GameGame, createSpriteFrames, loadImages, loadSounds } from "./GameGame.mjs";
import { Player } from "./Player.mjs";
import { Size } from "./Size.mjs";
import { Point } from "./Point.mjs";
import { GateManager } from "./GateManager.mjs";
import { GameController } from "./GameController.mjs";
import { Starfield } from "./Starfield.mjs";

const state = {
    /** @type {Player} */
    player: null,

    /** @type {Size} */
    bounds: null,

    /** @type {GateManager} */
    gateManager: null,

    /** @type {GameController} */
    gameController: null,

    /** @type {Starfield} */
    starfield: null
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

        const enginesIdle = await createSpriteFrames(images.enginesIdle, 1, 3);
        const enginesPowered = await createSpriteFrames(images.enginesPowered, 1, 4);

        state.player = new Player(
            new Point(width / 2, height / 2),
            Math.random() * 2 * Math.PI,
            images.ship,
            enginesIdle,
            enginesPowered,
            images.particleSmoke,
            sounds.engine);

        state.gameController = new GameController();
        state.gateManager = new GateManager(state.player, state.gameController, sounds.gate);
        state.starfield = new Starfield(500, state.bounds);
    },
    (time, dt) => {
        // update
        state.starfield.update(time, dt);
        state.player.update(time, dt);
        state.gateManager.update(time, dt);
        state.gameController.update(time, dt);
    },
    (ctx, time) => {
        // render
        state.starfield.render(ctx, time);
        state.gateManager.render(ctx, time);
        state.player.render(ctx, time);
        state.gameController.render(ctx, time);
    });