import { Teams } from './Teams'
import PhysicalEntity from './PhysicalEntity'
import { AddProjectileFunc } from '~/scenes/ColliderCollection'
import { Equipment } from './Equipment'
import { CurrentStatusChange } from './StatusChanges'
import { HardPoint } from './Hardpoint'
import GameplayScene from '~/scenes/GameplayScene'

export type EquipmentCooldownChangedCallback = (equipment: TriggeredEquipment, remainingCooldown: number) => void
export type EquipmentCooldownFinishedCallback = (equipment: TriggeredEquipment, remainingCooldown: number) => void

export type EquipmentAngleCallback = () => number
export type EquipmentPositionCallback = (angle: EquipmentAngleCallback) => Phaser.Geom.Point

export abstract class TriggeredEquipment extends Equipment
{
    public abstract readonly cooldown: number 
    public abstract readonly completeCooldown: number
    public abstract readonly heatPerTrigger: number

    abstract get range() : number

    private lastUsedAt = 0

    protected cooldownModifier = 1

    private readonly cooldownChangedCallbacks : EquipmentCooldownChangedCallback[] = []
    //private readonly cooldownFinishedCallbacks: EquipmentCooldownFinishedCallback[] = []

    public readonly statusChangePerSecond = CurrentStatusChange.zero

    public static readonly class = "triggered"
    public readonly class = TriggeredEquipment.class

    constructor()
    {
        super()
    }

    /**
     * Attempts to trigger this equipment. Returns the heat generated by that try.
     */
    public trigger(scene: GameplayScene, colliderFunc: AddProjectileFunc, equipmentPosition: EquipmentPositionCallback, angle: EquipmentAngleCallback, time: number, ownerId: string, team: Teams) : number
    {
        const passed = time - this.lastUsedAt
        if(passed > this.cooldown * this.cooldownModifier) {
            this.internalTrigger(scene, colliderFunc, equipmentPosition, angle, time, ownerId, team)
            this.lastUsedAt = time
            return this.heatPerTrigger
        }
        return 0
    }

    public update(t: number, dt: number, _)
    {
        this.internalUpdate(t, dt)
        this.cooldownChangedCallbacks.forEach(x => x(this, Math.max(0, t - this.lastUsedAt)))
        return CurrentStatusChange.zero
    }

    protected abstract internalUpdate(t, dt)

    protected abstract internalTrigger(scene: GameplayScene, colliderFunc: AddProjectileFunc, equipmentPosition: EquipmentPositionCallback, angle: EquipmentAngleCallback, time, ownerId: string, team: Teams)

    protected mountOffset()
    {
        return new Phaser.Math.Vector2(0, 0)
    }

    public addCooldownChangedCallback(c: EquipmentCooldownChangedCallback)
    {
        this.cooldownChangedCallbacks.push(c)
    }

    /*
    public addCooldownFinishedCallback(c: EquipmentCooldownChangedCallback)
    {
        this.cooldownFinishedCallbacks.push(c)
    }
    */

    public removeCooldownChangedCallback(c: EquipmentCooldownChangedCallback)
    {
        this.cooldownChangedCallbacks.forEach( (item, index) => {
            if(item === c) this.cooldownChangedCallbacks.splice(index,1);
          });
    }

    /*
    public removeCooldownFinishedCallback(c: EquipmentCooldownFinishedCallback)
    {
        this.cooldownFinishedCallbacks.forEach( (item, index) => {
            if(item === c) this.cooldownFinishedCallbacks.splice(index,1);
          });
    }
    */
}

export type TriggeredEquipmentTemplate = () => TriggeredEquipment