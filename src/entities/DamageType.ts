export type Physical = number
export type Energy = number
export type Heat = number

export class Damage
{
    get physical() { return this._physical }
    get energy() { return this._energy }
    get heat() { return this._heat }

    constructor(protected _physical: Physical,
                protected _energy: Energy,
                protected _heat: Heat)
    { }
}