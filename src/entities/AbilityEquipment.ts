import { TriggeredEquipment, EquipmentPositionCallback, EquipmentAngleCallback } from './TriggeredEquipment';
import GameplayScene from '~/scenes/GameplayScene';
import { AddProjectileFunc } from '~/scenes/ColliderCollection';
import { Teams } from './Teams';
import { CurrentStatusChange } from './StatusChanges';
import { EquipmentTypes } from './Equipment'

export abstract class AbilityEquipment extends TriggeredEquipment
{
    public static readonly class = "ability"
    public readonly kind = AbilityEquipment.class
    public abstract iconSpriteKey: string
    public canBeTriggered = true
    public statusChangePerDeltaTime(dt: number) { return CurrentStatusChange.zero }
    public type = EquipmentTypes.Ability

    protected internalUpdate(t, dt)
    {
        //
    }

    protected internalTrigger(scene: GameplayScene, colliderFunc: AddProjectileFunc, equipmentPosition: EquipmentPositionCallback, angle: EquipmentAngleCallback, time, ownerId: string, team: Teams)
    {
        //
    }
}