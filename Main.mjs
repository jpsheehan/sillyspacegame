import { GameGame, createSpriteFrames, loadImages, loadSounds } from "./GameGame.mjs";
import { Player } from "./Player.mjs";
import { Size } from "./Size.mjs";
import { Point } from "./Point.mjs";
import { GateManager } from "./GateManager.mjs";
import { GameController } from "./GameController.mjs";
import { Starfield } from "./Starfield.mjs";
import { Enemy } from "./Enemy.mjs";

const state = {
    /** @type {Player} */
    player: null,

    /** @type {Enemy} */
    enemy: null,

    /** @type {Size} */
    bounds: null,

    /** @type {GateManager} */
    gateManager: null,

    /** @type {GameController} */
    gameController: null,

    /** @type {Starfield} */
    starfield: null,
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

        state.player = new Player(
            "You",
            new Point(width / 2, height / 2),
            0,
            images.ship,
            enginesIdle,
            enginesPowered,
            images.particleSmoke,
            sounds.engine,
            () => state.gateManager.gate);
        state.enemy = new Enemy(
            "Bot",
            new Point(width / 2, height / 2),
            0,
            images.ship,
            enginesIdle,
            enginesPowered,
            images.particleSmoke,
            sounds.engine,
            () => state.gateManager.gate);

        const ships = [state.player, state.enemy];

        state.gameController = new GameController(ships);
        state.gateManager = new GateManager(ships, state.gameController, sounds.gate);
        state.starfield = new Starfield(500, state.bounds);
    },
    (time, dt) => {
        // update
        state.starfield.update(time, dt);
        state.player.update(time, dt);
        state.enemy.update(time, dt);
        state.gateManager.update(time, dt);
        state.gameController.update(time, dt);
    },
    (ctx, time) => {
        // render
        state.starfield.render(ctx, time);
        state.gateManager.render(ctx, time);
        state.enemy.render(ctx, time);
        state.player.render(ctx, time);
        state.gameController.render(ctx, time);
    });