import ActiveEquipment from './ActiveEquipment';
import { CombinedStatusChange, MaxStatusChange, CurrentStatusChange } from './StatusChanges';
import { Manufacturers } from '~/utilities/Manufacturers';
import { HardPointSize, HardPointType } from './Hardpoint';
import { EquipmentTypes } from './Equipment';

export abstract class Engine extends ActiveEquipment
{
    public readonly maxStatusChange = MaxStatusChange.zero
    public readonly type = EquipmentTypes.Engine

    public abstract readonly maxVelocity
    public abstract readonly heatPerSecond

    constructor()
    {
        super()
    }

    public update(t: number, dt: number, isMoving: boolean)
    {
        if(isMoving)
            return CurrentStatusChange.forHeat(dt, this.heatPerSecond)
        else
            return CurrentStatusChange.zero
    }
}
