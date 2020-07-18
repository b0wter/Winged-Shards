import Phaser from 'phaser'
import * as Projectile from './Projectile'
import { Teams } from './Teams'
import { TriggeredEquipment, EquipmentPositionCallback, EquipmentAngleCallback, TriggeredEquipmentTemplate } from './TriggeredEquipment'
import { AddProjectileFunc } from '~/scenes/ColliderCollection'
import { MaxStatusChange, CurrentStatusChange } from './StatusChanges'
import { HardPointType, HardPointSize } from './Hardpoint'
import { Manufacturers, manufacturerToString } from '~/utilities/Manufacturers'
import { EquipmentTypes } from './Equipment'
import GameplayScene from '~/scenes/GameplayScene'

export interface None { kind: string }
export interface Angular { degreesDistance: number, kind: string }
export interface Parallel { distanceToNext: number, kind: string }
export type WeaponSpread = None | Angular | Parallel

export const NoSpread : None = { kind: "None" }
export function AngularSpread(angle: number) { return { degreesDistance: angle, kind: "Angular" } }
export function ParallelSpread(distanceToNext: number) { return { distanceToNext: distanceToNext, kind: "Parallel" } }

export class Weapon extends TriggeredEquipment
{
    public statusChangePerDeltaTime(dt: number) { return CurrentStatusChange.zero }
    public type = EquipmentTypes.Weapon

    public get range() { return this.projectile.range }

    get cooldown() { return this._cooldown + this.initialDelay + (this._shotsPerTrigger - 1) * this.delayBetweenShots} 

    public readonly maxStatusChange = MaxStatusChange.zero

    constructor(private projectile: Projectile.ProjectileTemplate, 
                heatPerShot: number,
                _cooldown: number,
                private _shotsPerTrigger: number,
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
    protected internalTrigger(scene: GameplayScene, colliderFunc: AddProjectileFunc, equipmentPosition: EquipmentPositionCallback, angleFunc: EquipmentAngleCallback, time: number, ownerId: string) {
        const fire = () => { 
            const pos = equipmentPosition(angleFunc)
            const angle = angleFunc()
            switch(this.spread.kind)
            {
                case "None":
                    if(this._projectilesPerShot > 1)
                        console.warn("Triggered a weapon with multiple shots but no spread! Is this what you want?")
                    for(let i = 0; i < this._projectilesPerShot; i++)
                        Projectile.fromTemplate(scene, pos.x, pos.y, this._team, angle, this.projectile, colliderFunc, ownerId) 
                    break
                case "Angular":
                    if(this._projectilesPerShot === 1)
                        console.warn("Triggered a weapon with angular spread but only a single projectile per shot. Is this what you want?")
                    const angularSpread = this.spread as Angular
                    const angularStart = -(this._projectilesPerShot - 1) * angularSpread.degreesDistance / 2
                    for(let i = 0; i < this._projectilesPerShot; i++)
                        Projectile.fromTemplate(scene, pos.x, pos.y, this._team, angle + angularStart + i * angularSpread.degreesDistance, this.projectile, colliderFunc, ownerId) 
                    break
                case "Parallel":
                    if(this._projectilesPerShot === 1)
                        console.warn("Triggered a weapon with parallel spread but only a single projectile per shot. Is this what you want?")
                    const parallelSpread = this.spread as Parallel
                    const parallelStart = -(this._projectilesPerShot - 1) * parallelSpread.distanceToNext / 2
                    for(let i = 0; i < this._projectilesPerShot; i++){
                        const rot = Phaser.Math.Rotate(new Phaser.Geom.Point(0, parallelStart + i * parallelSpread.distanceToNext), angle * Phaser.Math.DEG_TO_RAD)
                        const posX = pos.x + rot.x
                        const posY = pos.y + rot.y
                        Projectile.fromTemplate(scene, posX, posY, this._team, angle, this.projectile, colliderFunc, ownerId) 
                    }
                    break
            }
        }

        let configuredFire : () => void
        if(this._shotsPerTrigger > 1)
            configuredFire = () => { const timer = new Phaser.Time.TimerEvent({ repeat: this._shotsPerTrigger - 1, callback: fire, callbackScope: this, delay: this.delayBetweenShots}); scene.time.addEvent(timer) }
        else
            configuredFire = fire

        if(this.initialDelay === 0)
            configuredFire()
        else
            scene.time.addEvent(new Phaser.Time.TimerEvent({delay: this.initialDelay, callback: configuredFire }))
    }

    protected internalUpdate(t: number, dt: number)
    {
        //
    }
}

export abstract class WeaponTemplate extends TriggeredEquipmentTemplate
{
    public abstract readonly cooldown: number 
    public abstract readonly projectile: Projectile.ProjectileTemplate
    /**
     * A single weapon trigger can trigger multiple shots of multiple projectiles.
     * `shotsPerTrigger` is the number of shots fired. The number of shots
     * per projectile is defined by `projectilesPerShot`.
     */
    public abstract readonly shotsPerTrigger: number
    /**
     * A single weapon trigger can trigger multiple shots. These shots may contain multiple projectiles.
     */
    public abstract readonly projectilesPerTrigger: number
    public abstract readonly heatPerTrigger: number
    public abstract readonly spread: WeaponSpread
    public abstract readonly initialDelay: number
    public abstract readonly delayBetweenShots: number
    public abstract readonly hardPointSize: HardPointSize
    public abstract readonly hardPointType: HardPointType
    public abstract readonly manufacturer: Manufacturers
    public abstract readonly modelName: string

    private get firingInterval() { return this.cooldown + (this.delayBetweenShots - 1) * this.shotsPerTrigger }
    private get firingIntervalPerSecod() { return 1 / (this.firingInterval / 1000) }
    public get dps() { return this.projectile.damage.scale(this.firingIntervalPerSecod * this.shotsPerTrigger) }
    public get heatPerSecond() { return this.firingIntervalPerSecod * this.heatPerTrigger }

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

    public instantiate(team: Teams) : Weapon
    {
        return new Weapon(this.projectile, this.heatPerTrigger, this.cooldown, this.shotsPerTrigger, this.projectilesPerTrigger, this.spread, this.initialDelay, this.delayBetweenShots, this.hardPointSize, this.hardPointType, this.manufacturer, this.modelName, team)
    }
}

export abstract class PrefilledWeaponTemplate extends WeaponTemplate
{
    constructor()
    {
        super()
    }
}