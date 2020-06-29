import PassiveEquipment from './PassiveEquipment';
import StatusChange from './StatusChange';

export default class HeatExchanger extends PassiveEquipment
{
    public get dissipationPerSecond() { return this._dissipationPerSecond }

    constructor(private _dissipationPerSecond: number)
    {
        super()
    }

    public update(t: number, dt: number) : StatusChange
    {
        return StatusChange.computeForHeat(dt, this.dissipationPerSecond)
    }
}