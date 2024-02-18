import { StateMachine } from "./StateMachine.mjs";

/**
 * @template {T}
 */
export class State {
    #name;
    #enter;
    #update;
    #render;
    #data;

    /**
     * @template {S}
     * @param {string} name 
     * @param {T} data
     * @param {((fromState: string, args: S, data: T) => T) | undefined} enter
     * @param {(time: number, dt: number, stateMachine: StateMachine, data: T) => void} update 
     * @param {(ctx: CanvasRenderingContext2D, time: number, data: T) => void} render 
     */
    constructor(name, data, enter, update, render) {
        this.#name = name;
        this.#data = data;
        this.#enter = enter;
        this.#update = update;
        this.#render = render;
    }

    get name() { return this.#name; }

    /**
     * 
     * @param {string} fromState 
     * @param {S} args 
     */
    enter(fromState, args) {
        if (typeof(this.#enter) !== 'undefined') {
            this.#data = this.#enter(fromState, args, this.#data);
        }
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} time 
     */
    render(ctx, time) {
        this.#render(ctx, time, this.#data);
    }

    /**
     * 
     * @param {number} time 
     * @param {number} dt 
     * @param {StateMachine} stateMachine 
     */
    update(time, dt, stateMachine) {
        this.#update(time, dt, stateMachine, this.#data);
    }
}