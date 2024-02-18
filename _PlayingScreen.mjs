import { Enemy } from "./Enemy.mjs";
import { GameController } from "./GameController.mjs";
import { CanvasSize } from "./GameGame.mjs";
import { GateManager } from "./GateManager.mjs";
import { Player } from "./Player.mjs";
import { Point } from "./Point.mjs";
import { Starfield } from "./Starfield.mjs";
import { State } from "./State.mjs";

export class PlayingScreen extends State {

    /**
     * 
     * @param {Starfield} starfield 
     * @param {object} assets
     */
    constructor(starfield, assets) {
        const player = new Player(
            "You",
            new Point(CanvasSize.w / 2, CanvasSize.h / 2),
            0,
            assets.images.ship,
            assets.sprites.enginesIdle,
            assets.sprites.enginesPowered,
            assets.images.particleSmoke,
            assets.sounds.engine,
            () => gateManager.gate);

        const enemy = new Enemy(
            "Bot",
            new Point(CanvasSize.w / 2, CanvasSize.h / 2),
            0,
            assets.images.ship,
            assets.sprites.enginesIdle,
            assets.sprites.enginesPowered,
            assets.images.particleSmoke,
            assets.sounds.engine,
            () => gateManager.gate);

        const ships = [player, enemy];

        const gameController = new GameController(ships);
        const gateManager = new GateManager(ships, gameController, assets.sounds.gate);

        super("playing", {
            player,
            enemy,
            gameController,
            gateManager,
            starfield
        },
            undefined,
            (time, dt, stateMachine, data) => {
                const { player, enemy, starfield, gateManager, gameController } = data;
                starfield.update(time, dt);
                player.update(time, dt);
                enemy.update(time, dt);
                gateManager.update(time, dt);
                gameController.update(time, dt);
            }, (ctx, time, data) => {
                const { player, enemy, starfield, gateManager, gameController } = data;
                starfield.render(ctx, time);
                gateManager.render(ctx, time);
                enemy.render(ctx, time);
                player.render(ctx, time);
                gameController.render(ctx, time);
            })
    }
}