import ClampedNumber from '~/utilities/ClampedNumber';
import PassiveEquipment from './PassiveEquipment';
import { CombinedStatusChange, MaxStatusChange, CurrentStatusChange } from './StatusChanges';

export default class ShieldGenerator extends PassiveEquipment
{
    public get maxShields() { return this._maxShields }
    public get rechargeRate() { return this._rechargeRate }

    public readonly maxStatusChange = MaxStatusChange.forShield(this.maxShields)
    public readonly statusChangePerSecond = CurrentStatusChange.forShield(1000, this.rechargeRate)

    constructor(heatPerSecond: number,
                private _maxShields: number,
                private _rechargeRate: number)
    {
        super(heatPerSecond)
    }
}