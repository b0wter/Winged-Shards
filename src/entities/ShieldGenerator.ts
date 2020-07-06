import ClampedNumber from '~/utilities/ClampedNumber';
import PassiveEquipment from './PassiveEquipment';
import { CombinedStatusChange, MaxStatusChange, CurrentStatusChange } from './StatusChanges';
import { EquipmentTypes } from './Equipment';

export default abstract class ShieldGenerator extends PassiveEquipment
{
    public readonly abstract maxShields
    public readonly abstract rechargeRate
    public readonly type = EquipmentTypes.Shield

    public get maxStatusChange() { return MaxStatusChange.forShield(this.maxShields) }

    constructor()
    {
        super()
    }

    public statusChangePerDeltaTime(dt: number) { return CurrentStatusChange.forShield(dt, this.rechargeRate) }
}