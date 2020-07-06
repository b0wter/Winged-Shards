import { Equipment } from './Equipment';
import { CombinedStatusChange, CurrentStatusChange } from './StatusChanges';

export default abstract class PassiveEquipment extends Equipment
{
    public static readonly class = "passive"
    public readonly class = PassiveEquipment.class

    constructor()
    {
        super()
    }

    public update(t: number, dt: number, _)
    {
        if(this.isDestroyed)
            return CurrentStatusChange.zero
        else
            return this.statusChangePerDeltaTime(dt)
    }
}