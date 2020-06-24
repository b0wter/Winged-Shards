import { Teams } from './Teams'
import PhysicalEntity from './PhysicalEntity'
import { AddProjectileFunc } from '~/scenes/ColliderCollection'

export abstract class Equipment
{
    /**
     * Cooldown in milliseconds.
     */
    get cooldown() { return this._cooldown }

    /**
     * Amount of heat generated per trigger.
     */
    get heatPerTrigger() { return this._heatPerTrigger}

    private lastUsedAt = 0

    protected cooldownModifier = 1

    constructor(protected _cooldown: number,
                protected _heatPerTrigger: number,
                protected _team : Teams
                )
    {
        //
    }

    /**
     * Attempts to trigger this equipment. Returns the heat generated by that try.
     * @param x X coordinate of the entity (excluding equipment moint point offset)
     * @param y Y coordinate of the entity (excluding equipment moint point offset)
     * @param angle Angle of the entity
     * @param time current game time, needed to cooldowns
     */
    public trigger(x, y, angle, time, ownerId) : number
    {
        const passed = time - this.lastUsedAt
        if(passed > this.cooldown * this.cooldownModifier) {
            const offset = this.mountOffset()
            this.internalTrigger(x + offset.x, y + offset.y, angle, time, ownerId)
            this.lastUsedAt = time
            return this.heatPerTrigger
        }
        return 0
    }

    public abstract update(t, dt)

    protected abstract internalTrigger(x, y, angle, time, ownerId)

    protected mountOffset()
    {
        return new Phaser.Math.Vector2(0, 0)
    }
}

export abstract class EquipmentTemplate
{
    public abstract instantiate(scene: Phaser.Scene, colliderFunc: AddProjectileFunc, team: Teams, mountPointOffsetX: number, mountPointOffsetY: number)
} 