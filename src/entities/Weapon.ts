import Phaser from 'phaser'
import * as Projectile from './Projectile'
import { Teams } from './Teams'
import { TriggeredEquipment, EquipmentPositionCallback, EquipmentAngleCallback, TriggeredEquipmentTemplate } from './TriggeredEquipment'
import { AddProjectileFunc } from '~/scenes/ColliderCollection'
import { MaxStatusChange, CurrentStatusChange } from './StatusChanges'
import { HardPointType, HardPointSize } from './Hardpoint'
import { Manufacturers, manufacturerToString } from '~/utilities/Manufacturers'
import { EquipmentTypes } from './Equipment'

export interface None { }
export const NoSpread : None = { }
export interface Angular { degreesDistance: number }
export interface Parallel { distanceToNext: number }
export type WeaponSpread = None | Angular | Parallel
export type RequestPositionCallback = () => Phaser.Geom.Point

export class Weapon extends TriggeredEquipment
{
    public statusChangePerDeltaTime(dt: number) { return CurrentStatusChange.zero }
    public type = EquipmentTypes.Weapon

    public get range() { return this.projectile.range }

    get cooldown() { return this._cooldown + this.initialDelay + (this._projectilesPerShot - 1) * this.delayBetweenShots} 

    public readonly maxStatusChange = MaxStatusChange.zero

    constructor(private scene: Phaser.Scene,
                private colliderFunc: AddProjectileFunc,
                private projectile: Projectile.ProjectileTemplate, 
                heatPerShot: number,
                _cooldown: number,
                private _projectilesPerShot: number,
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
    protected internalTrigger(equipmentPosition: EquipmentPositionCallback, angle: EquipmentAngleCallback, time: number, ownerId: string) {
        const fire = () => { 
            const pos = equipmentPosition(angle)
            Projectile.fromTemplate(this.scene, pos.x, pos.y, this._team, angle(), this.projectile, this.colliderFunc, ownerId) 
        }

        let configuredFire : () => void
        if(this._projectilesPerShot > 1)
            configuredFire = () => { const timer = new Phaser.Time.TimerEvent({ repeat: this._projectilesPerShot - 1, callback: fire, callbackScope: this, delay: this.delayBetweenShots}); this.scene.time.addEvent(timer) }
        else
            configuredFire = fire

        if(this.initialDelay === 0)
            configuredFire()
        else
            this.scene.time.addEvent(new Phaser.Time.TimerEvent({delay: this.initialDelay, callback: configuredFire }))
    }

    protected internalUpdate(t: number, dt: number)
    {
        //
    }
}

export abstract class WeaponTemplate extends TriggeredEquipmentTemplate
{
    public abstract readonly name: string
    public abstract readonly cooldown: number 
    public abstract readonly projectile: Projectile.ProjectileTemplate
    public abstract readonly projectilesPerShot: number
    public abstract readonly heatPerShot: number
    public abstract readonly spread: WeaponSpread
    public abstract readonly initialDelay: number
    public abstract readonly delayBetweenShots: number
    public abstract readonly hardPointSize: HardPointSize
    public abstract readonly hardPointType: HardPointType
    public abstract readonly manufacturer: Manufacturers
    public abstract readonly modelName: string

    private get firingInterval() { return this.cooldown + (this.delayBetweenShots - 1) * this.projectilesPerShot }
    private get firingIntervalPerSecod() { return 1 / (this.firingInterval / 1000) }
    public get dps() { return this.projectile.damage.scale(this.firingIntervalPerSecod * this.projectilesPerShot) }
    public get heatPerSecond() { return this.firingIntervalPerSecod * this.heatPerShot }

    constructor()
    {
        super()
    }

    public get stats()
    {   
        return `
TEMPLATE: ${this.modelName} (${manufacturerToString(this.manufacturer)})
DPS: ${this.dps}
HPS: ${this.heatPerSecond.toFixed(2)}
Firing interval: ${this.firingInterval}
Shots/sec: ${this.firingIntervalPerSecod}
Triggers/sec: ${this.firingIntervalPerSecod}
`
    }

    public instantiate(scene: Phaser.Scene, colliderFunc: AddProjectileFunc, team: Teams) : Weapon
    {
        return new Weapon(scene, colliderFunc, this.projectile, this.heatPerShot, this.cooldown, this.projectilesPerShot, this.spread, this.initialDelay, this.delayBetweenShots, this.hardPointSize, this.hardPointType, this.manufacturer, this.name, team)
    }
}

export abstract class PrefilledWeaponTemplate extends WeaponTemplate
{
    constructor()
    {
        super()
    }
}