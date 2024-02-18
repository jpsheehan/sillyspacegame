import { Enemy } from "./Enemy.mjs";
import { GameController } from "./GameController.mjs";
import { CanvasSize } from "./GameGame.mjs";
import { GateManager } from "./GateManager.mjs";
import { Player } from "./Player.mjs";
import { Point } from "./Point.mjs";
import { Starfield } from "./Starfield.mjs";
import { State } from "./State.mjs";

const NUM_ENEMIES = 1;

export class PlayingScreen extends State {

    /**
     * 
     * @param {Starfield} starfield 
     * @param {object} assets
     */
    constructor(starfield, assets) {
        super("playing", { starfield, assets },
            (_, __, data) => {
                const { starfield, assets } = data;
                const player = new Player(
                    "You",
                    new Point(CanvasSize.w / 2, CanvasSize.h / 2),
                    Math.random() * 2 * Math.PI,
                    assets.images.ship,
                    assets.sprites.enginesIdle,
                    assets.sprites.enginesPowered,
                    assets.images.particleSmoke,
                    assets.sounds.engine,
                    () => gateManager.gate);

                const enemies = [];

                for (let i = 0; i < NUM_ENEMIES; i++) {
                    const enemy = new Enemy(
                        "Bot",
                        new Point(Math.random() * CanvasSize.w, Math.random() * CanvasSize.h),
                        Math.random() * 2 * Math.PI,
                        assets.images.ship,
                        assets.sprites.enginesIdle,
                        assets.sprites.enginesPowered,
                        assets.images.particleSmoke,
                        assets.sounds.engine,
                        () => gateManager.gate);

                    enemies.push(enemy);
                }

                const ships = [player, ...enemies];

                const gameController = new GameController(ships);
                const gateManager = new GateManager(ships, gameController, assets.sounds.gate);

                return {
                    ships,
                    gameController,
                    gateManager,
                    starfield,
                    assets
                }
            },
            (time, dt, stateMachine, data) => {
                const { ships, starfield, gateManager, gameController } = data;

                starfield.update(time, dt);
                for (let ship of ships) {
                    ship.update(time, dt);
                }
                gateManager.update(time, dt);
                gameController.update(time, dt);

                if (gameController.isWon) {
                    stateMachine.switchTo("win", gameController.playerScore);
                } else if (gameController.isLost) {
                    stateMachine.switchTo("lose", gameController.playerScore);
                }
            }, (ctx, time, data) => {
                const { ships, starfield, gateManager, gameController } = data;

                starfield.render(ctx, time);
                gateManager.render(ctx, time);
                for (let ship of ships.slice().reverse()) {
                    ship.render(ctx, time);
                }
                gameController.render(ctx, time);
            })
    }
}