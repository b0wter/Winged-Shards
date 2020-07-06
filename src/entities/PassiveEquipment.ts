import { Equipment } from './Equipment';
import { CombinedStatusChange, CurrentStatusChange } from './StatusChanges';

export default abstract class PassiveEquipment extends Equipment
{
    public static readonly class = "passive"
    public readonly class = PassiveEquipment.class

    constructor(heatPerSecond: number)
    {
        super(heatPerSecond)
    }

    public update(t: number, dt: number, _)
    {
        if(this.isDestroyed)
            return CurrentStatusChange.zero
        else
            return this.statusChangePerSecond.scaled(dt/1000)
    }
}