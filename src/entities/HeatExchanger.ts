import PassiveEquipment from './PassiveEquipment';
import { CombinedStatusChange, CurrentStatusChange, MaxStatusChange } from './StatusChanges';
import { HardPointSize, HardPointType, HardPoint } from './Hardpoint';
import { Manufacturers } from '~/utilities/Manufacturers';
import { EquipmentTypes } from './Equipment';

export abstract class HeatExchanger extends PassiveEquipment
{
    public get maxStatusChange() {return MaxStatusChange.forHeat(this.maxHeatBonus) }

    public readonly type = EquipmentTypes.HeatExchanger
    public abstract readonly heatPerSecond: number
    public abstract readonly maxHeatBonus: number

    constructor()
    {
        super()
    }

    public statusChangePerDeltaTime(dt: number) 
    { 
        return CurrentStatusChange.forHeat(dt, this.heatPerSecond) 
    }
}

