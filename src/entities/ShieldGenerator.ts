import ClampedNumber from '~/utilities/ClampedNumber';
import PassiveEquipment from './PassiveEquipment';
import StatusChange from './StatusChange';

export default class ShieldGenerator extends PassiveEquipment
{
    public get maxShields() { return this._maxShields }
    public get rechargeRate() { return this._rechargeRate }
    public get heatPerSecond() { return this._heatPerSecond }

    constructor(private _maxShields: number,
                private _rechargeRate: number,
                private _heatPerSecond: number)
    {
        super()
    }

    public update(t: number, dt: number) : StatusChange
    {
        return StatusChange.computeForShield(dt, this.rechargeRate, this.heatPerSecond)
    }
}