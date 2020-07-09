import Phaser from 'phaser'
import * as Damage from './DamageType'
import * as Projectile from './Projectile'
import { Teams } from './Teams'
import { TriggeredEquipment, TriggeredEquipmentTemplate } from './TriggeredEquipment'
import PhysicalEntity from './PhysicalEntity'
import { AddProjectileFunc } from '~/scenes/ColliderCollection'
import { CombinedStatusChange, MaxStatusChange, CurrentStatusChange } from './StatusChanges'
import { HardPointType, HardPointSize } from './Hardpoint'
import { Manufacturers } from '~/utilities/Manufacturers'
import { EquipmentTypes } from './Equipment'

export interface None { }
export const NoSpread : None = { }
export interface Angular { degreesDistance: number }
export interface Parallel { distanceToNext: number }
export type WeaponSpread = None | Angular | Parallel

export class Weapon extends TriggeredEquipment
{
    public statusChangePerDeltaTime(dt: number) { return CurrentStatusChange.zero }
    public type = EquipmentTypes.Weapon

    public get range() { return this.projectile.range }

    public readonly maxStatusChange = MaxStatusChange.zero

    constructor(private scene: Phaser.Scene,
                private colliderFunc: AddProjectileFunc,
                private projectile: Projectile.ProjectileTemplate, 
                heatPerShot: number,
                _cooldown: number,
                private spread: WeaponSpread,
                private initialDelay: number,
                private delayBetweenShots: number,
                public readonly hardPointSize: HardPointSize,
                public readonly hardPointType: HardPointType,
                public readonly manufacturer: Manufacturers,
                public readonly modelName: string,
                team: Teams
               )
    {
        super(_cooldown, heatPerShot, team)
        if(this._team !== Teams.Players) this.cooldownModifier = 2
    }

    /**
     * Triggers this weapon without checking conditions (cooldown, heat, ...).
     */
    protected internalTrigger(x, y, angle, time, owner) {
        Projectile.fromTemplate(this.scene, x, y, this._team, angle, this.projectile, this.colliderFunc, owner)
    }

    protected internalUpdate(t: number, dt: number)
    {
        //
    }
}