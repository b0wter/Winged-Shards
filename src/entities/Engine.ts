import ActiveEquipment from './ActiveEquipment';
import { CombinedStatusChange, MaxStatusChange, CurrentStatusChange } from './StatusChanges';
import { Manufacturers } from '~/utilities/Manufacturers';
import { HardPointSize, HardPointType } from './Hardpoint';
import { EquipmentTypes } from './Equipment';

export abstract class Engine extends ActiveEquipment
{
    public get maxVelocity() { return this._maxVelocity }
    public get heatPerSecond() { return this._heatPerSecond }

    public readonly maxStatusChange = MaxStatusChange.zero
    public readonly type = EquipmentTypes.Engine

    constructor(heatPerSecond: number,
                private _maxVelocity: number)
    {
        super(heatPerSecond)
    }

    public update(t: number, dt: number, isMoving: boolean)
    {
        if(isMoving)
            return CurrentStatusChange.forHeat(dt, this.heatPerSecond)
        else
            return CurrentStatusChange.zero
    }
}

export class SmallEngine extends Engine
{
    public readonly manufacturer = Manufacturers.BattlePrep
    public readonly modelName = "Satithrust-031"
    public readonly hardPointSize = HardPointSize.Small
    public readonly hardPointType = HardPointType.WithoutExtras
}