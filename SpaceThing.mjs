import { GameGame, createSpriteFrames } from "./GameGame.mjs";
import { Player } from "./Player.mjs";
import { Size } from "./Size.mjs";
import { Point } from "./Point.mjs";

const state = {
    /** @type {Player} */
    player: null,

    /** @type {Size} */
    bounds: null,

    lastTime: 0
};

GameGame(
    { canvasId: "canvas", images: {
        ship: "assets/ship.png",
        enginesIdle: "assets/engines_idle.png",
        enginesPowered: "assets/engines_powered.png",
        particleSmoke: "assets/particle_smoke.png"
    } },
    async (root, images) => {
        const width = parseInt(root.getAttribute("width"));
        const height = parseInt(root.getAttribute("height"));
        state.bounds = new Size(width, height);

        const enginesIdle = await createSpriteFrames(images.enginesIdle, 1, 3);
        const enginesPowered = await createSpriteFrames(images.enginesPowered, 1, 4);

        state.player = new Player(new Point(width / 2, height / 2), Math.random() * 2 * Math.PI, images.ship, enginesIdle, enginesPowered, images.particleSmoke);
    },
    (time) => {
        const dt = time - state.lastTime;
        state.lastTime = time;

        state.player.update(time, dt);
    },
    (ctx, time) => {
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, state.bounds.w, state.bounds.h);

        state.player.render(ctx, time);
    });