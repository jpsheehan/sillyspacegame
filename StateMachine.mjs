import { State } from "./State.mjs";

export class StateMachine
{
    #states;
    #active;

    /**
     * 
     * @param {State[]} states 
     */
    constructor(states) {
        this.#states = states;
        this.#active = this.#states[0];
    }

    /**
     * 
     * @param {string} stateName 
     * @param {any} data 
     */
    switchTo(stateName, args) {
        const oldState = this.#active.name;

        this.#active = this.#states.find(state => state.name === stateName);
        if (!this.#active) { throw new Error("Could not find state " + stateName); }

        this.#active.enter(oldState, args);
    }

    /**
     * 
     * @param {CanvasRenderingContext2D} ctx 
     * @param {number} time 
     */
    render(ctx, time) {
        this.#active.render(ctx, time);
    }

    /**
     * 
     * @param {number} time 
     * @param {number} dt 
     */
    update(time, dt) {
        this.#active.update(time, dt, this);
    }
}