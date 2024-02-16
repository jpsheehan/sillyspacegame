"use strict";

/**
 * Creates and starts a new GameGame.
 * @param {{ canvasId: string }} options 
 * @param {(root: Element, images: {[key: string]: CanvasImageSource}) => Promise<void>} init 
 * @param {(timeMs: number) => void} update 
 * @param {(ctx: CanvasRenderingContext2D, timeMs: number) => void} render 
 */
export async function GameGame(options, init, update, render) {
    const { canvasId } = options;

    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");

    initKeyboard();

    await init(canvas);

    window.setInterval(() => internalUpdate(), 1000.0 / 60.0);
    window.requestAnimationFrame((t) => internalRender(t));

    function internalRender(t) {
        render(ctx, t);
        window.requestAnimationFrame((t) => internalRender(t));
    }

    function internalUpdate() {
        const now = performance.now();
        update(now);
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
                Keyboard.keyUp[key] = false;
                Keyboard.keyDown[key] = true;
            }
        });

        document.addEventListener("keyup", (evt) => {
            if (keyMap[evt.code]) {
                evt.preventDefault();
                const key = keyMap[evt.code];
                Keyboard.keyUp[key] = true;
                Keyboard.keyDown[key] = false;
            }
        });
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
    },
    keyUp: {
        w: false,
        a: false,
        s: false,
        d: false,
        q: false,
        e: false,
        space: false
    }
};

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
    ctx.drawImage(image, -image.width/2, -image.height/2);
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

export async function loadImages(images) {

    const imagePromises = [];

    for (let imageKey in images) {
        const path = images[imageKey];

        const img = new Image();
        img.src = path;
        imagePromises.push(new Promise((resolve, reject) => {
            img.addEventListener("load", () => { resolve([imageKey, img]); });
            img.addEventListener("error", () => reject());
        }));
    }

    const completedImages = {};
    for (let completedImage of await Promise.all(imagePromises)) {
        const [key, img] = completedImage;
        completedImages[key] = img;
    }

    return completedImages;
}