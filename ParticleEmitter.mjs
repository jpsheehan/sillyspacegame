import { clamp, drawImageCentered } from "./GameGame.mjs";

export class ParticleEmitter {
    #size;
    #image;
    #particles;
    
    /**
     * 
     * @param {CanvasImageSource} image 
     */
    constructor(image, size) {
        this.#image = image;
        this.#size = size;
        this.#particles =[];
    }

    emit(x, y, lifetime) {
        const index = this.#particles.findIndex(p => !p.alive);
        if (index === -1) {
            if (this.#particles.length < this.#size) {
                this.#particles.push(new Particle(this.#image, x, y, lifetime));
            }
        } else {
            this.#particles[index] = new Particle(this.#image, x, y, lifetime);
        }
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} time 
     */
    render(ctx, time) {
        this.#particles.forEach(p => p.render(ctx, time));
    }

    /**
     * 
     * @param {number} time 
     * @param {number} dt 
     */
    update(time, dt) {
        this.#particles.forEach(p => p.update(time, dt));
    }
}

export class Particle {
    #alive;
    #image;
    #x;
    #y;
    #lifetime;
    #birth;
    #angle;

    constructor(image, x, y, lifetime) {
        this.#image = image;
        this.#x = x;
        this.#y = y;
        this.#lifetime = lifetime;
        this.#alive = true;
        this.#birth = performance.now();
        this.#angle = Math.random() * Math.PI * 2;
    }

    /**
     * @param {number} time 
     * @param {number} dt
     */
    update(time, dt) {
        if (!this.#alive) return;

        if (time - this.#birth > this.#lifetime) {
            this.#alive = false;
            return;
        }
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} time 
     */
    render(ctx, time) {
        if (!this.#alive) return;

        const lifeUsed = time - this.#birth;
        let lifeUsedPercent = lifeUsed / this.#lifetime;
        lifeUsedPercent = clamp(lifeUsedPercent, 0, 1);

        ctx.globalAlpha = 1.0 - lifeUsedPercent;
        drawImageCentered(ctx, this.#image, this.#x, this.#y, this.#angle);

        ctx.globalAlpha = 1;
    }

    get alive() { return this.#alive; }
}