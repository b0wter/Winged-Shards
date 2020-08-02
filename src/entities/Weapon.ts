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
import ClampedNumber from '~/utilities/ClampedNumber'

export interface None { kind: string }
export interface Angular { degreesDistance: number, kind: string }
export interface Parallel { distanceToNext: number, kind: string }
export interface Random { maxDegrees: number, kind: string}
export type WeaponSpread = None | Angular | Parallel | Random

export const NoSpread : WeaponSpread = { kind: "None" }
export function AngularSpread(angle: number) : WeaponSpread { return { degreesDistance: angle, kind: "Angular" } }
export function ParallelSpread(distanceToNext: number) : WeaponSpread { return { distanceToNext: distanceToNext, kind: "Parallel" } }
export function RandomSpread(maxAngle: number) : WeaponSpread { return { maxDegrees: maxAngle, kind: "Random" } }

export abstract class Weapon extends TriggeredEquipment
{
    public statusChangePerDeltaTime(dt: number) { return CurrentStatusChange.zero }
    public type = EquipmentTypes.Weapon

    public get range() { return this.projectile.range }

    public get numberOfUses() { return Number.POSITIVE_INFINITY }

    /**
     * Time it takes for the weapon to shoot (initial delay, delay between shots, ...) and cool down.
     */
    get completeCooldown() { return this.cooldown + this.initialDelay + (this.shotsPerTrigger - 1) * this.delayBetweenShots} 

    protected get canBeTriggered() { return true }

    public readonly maxStatusChange = MaxStatusChange.zero

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
    public abstract readonly projectilesPerShot: number
    public abstract readonly spread: WeaponSpread
    public abstract readonly initialDelay: number
    public abstract readonly delayBetweenShots: number
    public abstract readonly hardPointSize: HardPointSize
    public abstract readonly hardPointType: HardPointType
    public abstract readonly manufacturer: Manufacturers
    public abstract readonly modelName: string

    constructor()
    {
        super()
    }

    /**
     * Triggers this weapon without checking conditions (cooldown, heat, ...).
     */
    protected internalTrigger(scene: GameplayScene, colliderFunc: AddProjectileFunc, equipmentPosition: EquipmentPositionCallback, angleFunc: EquipmentAngleCallback, time: number, ownerId: string, team: Teams) {
        const fire = () => { 
            const pos = equipmentPosition(angleFunc)
            const angle = angleFunc()
            switch(this.spread.kind)
            {
                case "None":
                    if(this.projectilesPerShot > 1)
                        console.warn("Triggered a weapon with multiple shots but no spread! Is this what you want? The projectiles will overlay.")
                    for(let i = 0; i < this.projectilesPerShot; i++)
                        Projectile.fromTemplate(scene, pos.x, pos.y, team, angle, this.projectile, colliderFunc, ownerId) 
                    break
                case "Angular":
                    if(this.projectilesPerShot === 1)
                        console.warn("Triggered a weapon with angular spread but only a single projectile per shot. Is this what you want?")
                    const angularSpread = this.spread as Angular
                    const angularStart = -(this.projectilesPerShot - 1) * angularSpread.degreesDistance / 2
                    for(let i = 0; i < this.projectilesPerShot; i++)
                        Projectile.fromTemplate(scene, pos.x, pos.y, team, angle + angularStart + i * angularSpread.degreesDistance, this.projectile, colliderFunc, ownerId) 
                    break
                case "Random":
                    const randomSpread = this.spread as Random
                    for(let i = 0; i < this.projectilesPerShot; i++) {
                        const s = Math.random() * randomSpread.maxDegrees
                        Projectile.fromTemplate(scene, pos.x, pos.y, team, angle + s - randomSpread.maxDegrees / 2, this.projectile, colliderFunc, ownerId) 
                    }
                    break
                case "Parallel":
                    if(this.projectilesPerShot === 1)
                        console.warn("Triggered a weapon with parallel spread but only a single projectile per shot. Is this what you want?")
                    const parallelSpread = this.spread as Parallel
                    const parallelStart = -(this.projectilesPerShot - 1) * parallelSpread.distanceToNext / 2
                    for(let i = 0; i < this.projectilesPerShot; i++){
                        const rot = Phaser.Math.Rotate(new Phaser.Geom.Point(0, parallelStart + i * parallelSpread.distanceToNext), angle * Phaser.Math.DEG_TO_RAD)
                        const posX = pos.x + rot.x
                        const posY = pos.y + rot.y
                        Projectile.fromTemplate(scene, posX, posY, team, angle, this.projectile, colliderFunc, ownerId) 
                    }
                    break
            }
        }

        if(team !== Teams.Players) this.cooldownModifier = 2

        let configuredFire : () => void
        if(this.shotsPerTrigger > 1)
            configuredFire = () => { const timer = new Phaser.Time.TimerEvent({ repeat: this.shotsPerTrigger - 1, callback: fire, callbackScope: this, delay: this.delayBetweenShots}); scene.time.addEvent(timer) }
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

export abstract class ProjectileWeapon extends Weapon
{
    public abstract readonly maxAmmo: number

    public ammo = new ClampedNumber(1)

    public get numberOfUses()
    {
        return this.ammo.current
    }

    constructor()
    {
        super()
        setTimeout(() => this.ammo.setMax(this.maxAmmo, true))
    }

    protected get canBeTriggered() 
    {
        return this.ammo.current > 0
    }

    protected internalTrigger(scene: GameplayScene, colliderFunc: AddProjectileFunc, equipmentPosition: EquipmentPositionCallback, angleFunc: EquipmentAngleCallback, time: number, ownerId: string, team: Teams)
    {
        super.internalTrigger(scene, colliderFunc, equipmentPosition, angleFunc, time, ownerId, team)
        this.ammo.current -= 1
    }
}

export type WeaponTemplate = () => Weapon
