import { GameGame, createSpriteFrames, loadImages, loadSounds } from "./GameGame.mjs";
import { Player } from "./Player.mjs";
import { Size } from "./Size.mjs";
import { Point } from "./Point.mjs";
import { GateManager } from "./GateManager.mjs";
import { GameController } from "./GameController.mjs";

const state = {
    /** @type {Player} */
    player: null,

    /** @type {Size} */
    bounds: null,

    lastTime: 0,

    /** @type {GateManager} */
    gateManager: null,

    /** @type {GameController} */
    gameController: null,

    /** @type {[number, number][]} */
    stars: []
};

GameGame(
    {
        canvasId: "canvas"
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

        for (let i = 0; i < 500; i++) {
            state.stars.push([Math.floor(Math.random() * width), Math.floor(Math.random() * height)])
        }

        state.gameController = new GameController();
        state.gateManager = new GateManager(state.player, state.gameController, sounds.gate);

    },
    (time) => {
        // update
        const dt = time - state.lastTime;
        state.lastTime = time;

        state.player.update(time, dt);
        state.gateManager.update(time, dt);
        state.gameController.update(time, dt);
    },
    (ctx, time) => {
        // render
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, state.bounds.w, state.bounds.h);

        ctx.fillStyle = "#ffffff";
        for (let i = 0; i < state.stars.length; i++) {
            const [x, y] = state.stars[i];
            ctx.globalAlpha = Math.random() * 0.5 + i / state.stars.length;
            ctx.fillRect(x, y, 1, 1);
        }

        ctx.globalAlpha = 1.0;
        state.player.render(ctx, time);
        state.gateManager.render(ctx, time);
        state.gameController.render(ctx, time);
    });