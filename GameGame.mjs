"use strict";

import { Size } from "./Size.mjs";

/**
 * Creates and starts a new GameGame.
 * @param {{ canvasId: string, width: number, height: number, fps?: number }} options 
 * @param {(root: Element, images: {[key: string]: CanvasImageSource}) => Promise<void>} init 
 * @param {(timeMs: number) => void} update 
 * @param {(ctx: CanvasRenderingContext2D, timeMs: number) => void} render 
 */
export async function GameGame(options, init, update, render) {
    const { canvasId, width, height, fps } = options;

    const canvas = document.getElementById(canvasId);
    canvas.setAttribute("width", width);
    canvas.setAttribute("height", height);

    CanvasSize = new Size(width, height);

    const ctx = canvas.getContext("2d");

    initKeyboard();

    const adaptiveFps = Math.round(await getFPS());
    const chosenFps = Math.max(fps ?? 0, adaptiveFps);
    console.log(`Running at ${chosenFps} FPS`)

    await init(canvas);

    let lastTime = performance.now();

    window.setInterval(() => internalUpdate(), 1000.0 / chosenFps);
    window.requestAnimationFrame((t) => internalRender(t));

    function internalRender(t) {
        render(ctx, t);
        window.requestAnimationFrame((t) => internalRender(t));
    }

    function internalUpdate() {
        const time = performance.now();
        const dt = time - lastTime;
        lastTime = time;

        update(time, dt);
    }

    function initKeyboard() {
        const keyMap = {
            "KeyW": "w",
            "KeyA": "a",
            "KeyS": "s",
            "KeyD": "d",
            "KeyQ": "q",
            "KeyE": "e",
            "Space": "space"
        };
        document.addEventListener("keydown", (evt) => {
            if (keyMap[evt.code]) {
                evt.preventDefault();
                const key = keyMap[evt.code];
                Keyboard.keyDown[key] = true;
            }
        });

        document.addEventListener("keyup", (evt) => {
            if (keyMap[evt.code]) {
                evt.preventDefault();
                const key = keyMap[evt.code];
                Keyboard.keyDown[key] = false;
            }
        });
    }

    /**
     * @see https://stackoverflow.com/a/44013686
     * @returns {Promise<number>}
     */
    function getFPS() {
        return new Promise(resolve =>
            requestAnimationFrame(t1 =>
                requestAnimationFrame(t2 => resolve(1000 / (t2 - t1)))
            )
        )
    }
}


export const Keyboard = {
    keyDown: {
        w: false,
        a: false,
        s: false,
        d: false,
        q: false,
        e: false,
        space: false
    }
};

export let CanvasSize = null;

/**
 * 
 * @param {number} x 
 * @param {number} min 
 * @param {number} max 
 * @returns 
 */
export function clamp(x, min, max) {
    if (x < min) return min;
    if (x > max) return max;
    return x;
}

/**
 * 
 * @param {CanvasRenderingContext2D} ctx 
 * @param {CanvasImageSource} image 
 * @param {number} x 
 * @param {number} y 
 * @param {number} angle 
 */
export function drawImageCentered(ctx, image, x, y, angle) {
    ctx.setTransform(1, 0, 0, 1, x, y);
    ctx.rotate(angle);
    ctx.drawImage(image, -image.width / 2, -image.height / 2);
    ctx.resetTransform();
}

/**
* 
* @param {CanvasImageSource} image 
* @param {number} rows 
* @param {number} cols 
* @returns {Promise<ImageBitmap[]>}
*/
export async function createSpriteFrames(image, rows, cols) {
    const sw = image.width / cols;
    const sh = image.height / rows;

    const frames = [];
    for (let row = 0; row < rows; ++row) {
        for (let col = 0; col < cols; ++col) {
            const sx = col * sw;
            const sy = row * sh;
            frames.push(createImageBitmap(image, sx, sy, sw, sh));
        }
    }

    return await Promise.all(frames);
}

/**
 * 
 * @param {number} numberOfFrames 
 * @param {number} timeMillis 
 * @param {number} framesPerSecond 
 */
export function getFrameIndex(numberOfFrames, timeMillis, framesPerSecond) {
    return Math.floor(timeMillis / 1000.0 * framesPerSecond) % numberOfFrames;
}

/**
 * 
 * @param {{ [key:string]: string}} images 
 * @returns {Promise<{ [key:string]: HTMLImageElement }>}
 */
export function loadImages(images) {
    return loadResources(images, (path) => { const image = new Image(); image.src = path; return image; }, "load", "error");
}

/**
 * 
 * @param {{[key: string]: string}} sounds 
 * @returns {Promise<{[key:string]: HTMLAudioElement}>}
 */
export function loadSounds(sounds) {
    return loadResources(sounds, (path) => new Audio(path), "canplaythrough", "error");
}

/**
 * 
 * @param {{[key: string]: string}} resources 
 * @param {(path: string) => T} creator 
 * @param {string} readyEvent 
 * @param {string} errorEvent 
 * @returns {Promise<{[key:string]: T}>}
 */
async function loadResources(resources, creator, readyEvent, errorEvent) {
    const promises = [];
    for (let key in resources) {
        const path = resources[key];

        const resource = creator(path);
        promises.push(new Promise((resolve, reject) => {
            resource.addEventListener(readyEvent, () => resolve([key, resource]));
            resource.addEventListener(errorEvent, (e) => reject(e));
        }));
    }

    const resourceMap = {};
    for (let [key, resource] of await Promise.all(promises)) {
        resourceMap[key] = resource;
    }
    return resourceMap;
}