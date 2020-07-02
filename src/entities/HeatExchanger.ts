import PassiveEquipment from './PassiveEquipment';
import { CombinedStatusChange, CurrentStatusChange, MaxStatusChange } from './StatusChanges';
import { HardPointSize, HardPointType, HardPoint } from './Hardpoint';
import { Manufacturers } from '~/utilities/Manufacturers';
import { EquipmentTypes } from './Equipment';

export abstract class HeatExchanger extends PassiveEquipment
{
    public readonly maxStatusChange = MaxStatusChange.forHeat(this.maxHeatBonus)
    public readonly statusChangePerSecond = CurrentStatusChange.forHeat(1000, this._heatPerSecond)
    public readonly type = EquipmentTypes.HeatExchanger

    public get maxHeatBonus() { return this._maxHeatBonus }

    constructor(heatPerSecond: number,
                private _maxHeatBonus: number = 0)
    {
        super(heatPerSecond)
    }
}

export class SmallHeatExchanger extends HeatExchanger
{
    public readonly manufacturer = Manufacturers.BattlePrep
    public readonly modelName = "HEx-001s"
    public readonly hardPointSize = HardPointSize.Small
    public readonly hardPointType = HardPointType.WithoutExtras

    constructor()
    {
        super(-5, 0)
    }
}