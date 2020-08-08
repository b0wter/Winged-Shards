import { Equipment } from './Equipment';
import { MaxStatusChange, CurrentStatusChange } from './StatusChanges';

/**
 * Equipment that is not running all the time but also not actively triggerd:
 * E. g. engines that only produce heat while moving.
 */
export default abstract class ActiveEquipment extends Equipment
{
    public readonly statusChangePerSecond = CurrentStatusChange.zero
    public static readonly class = "active"
    public readonly class = ActiveEquipment.class

    public update(t: number, dt: number, isMoving: boolean) : CurrentStatusChange
    {
        if(this.isDestroyed)
            return CurrentStatusChange.zero
        else
            return this.internalUpdate(t, dt, isMoving)
    }

    protected abstract internalUpdate(t: number, dt: number, isMoving: boolean) : CurrentStatusChange
}