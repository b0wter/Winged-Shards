import ActiveEquipment from './ActiveEquipment';
import StatusChange from './StatusChange';

export default class Engine extends ActiveEquipment
{
    public get maxVelocity() { return this._maxVelocity }
    public get heatPerSecond() { return this._heatPerSecond }

    constructor(private _maxVelocity: number,
                private _heatPerSecond: number)
    {
        super()
    }

    public update(t: number, dt: number, active: boolean)
    {
        if(active)
            return StatusChange.computeForHeat(dt, this.heatPerSecond)
        else
            return StatusChange.Zero
    }
}