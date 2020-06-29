import Phaser from 'phaser'
import * as Damage from './DamageType'
import * as Projectile from './Projectile'
import { Teams } from './Teams'
import { TriggeredEquipment, ActiveEquipmentTemplate } from './TriggeredEquipment'
import PhysicalEntity from './PhysicalEntity'
import { AddProjectileFunc } from '~/scenes/ColliderCollection'

export interface None { }
export const NoSpread : None = { }
export interface Angular { degreesDistance: number }
export interface Parallel { distanceToNext: number }
export type WeaponSpread = None | Angular | Parallel

export class Weapon extends TriggeredEquipment
{
    public get range() { return this.projectile.range }

    constructor(private scene: Phaser.Scene,
                private colliderFunc: AddProjectileFunc,
                private projectile: Projectile.ProjectileTemplate, 
                heatPerShot: number,
                _cooldown: number,
                private spread: WeaponSpread,
                private initialDelay: number,
                private delayBetweenShots: number,
                team: Teams,
                mountPointOffsetX: number,
                mountPointOffsetY: number
               )
    {
        super(_cooldown, heatPerShot, team, mountPointOffsetX, mountPointOffsetY)
        if(this._team !== Teams.Players) this.cooldownModifier = 2
    }

    /**
     * Tries to shoot this weapon. Does not run a cooldown check!
     */
    protected internalTrigger(x, y, angle, time, owner) {
        Projectile.fromTemplate(this.scene, x, y, this._team, angle, this.projectile, this.colliderFunc, owner)
    }

    protected internalUpdate(t: number, dt: number)
    {
        //
    }

    protected mountOffset()
    {
        return new Phaser.Math.Vector2(this.mountPointOffsetX, this.mountPointOffsetY)
    }
}

export class WeaponTemplate extends ActiveEquipmentTemplate
{

    public readonly name = "<WeaponTemplate>"
    public readonly cooldown: number = Number.MAX_SAFE_INTEGER
    public readonly projectile: Projectile.ProjectileTemplate = Projectile.EmptyTemplate
    public readonly projectilesPerShot = 0
    public readonly heatPerShot = 0
    public readonly spread: WeaponSpread = NoSpread
    public readonly initialDelay = Number.MAX_SAFE_INTEGER
    public readonly delayBetweenShots = Number.MAX_SAFE_INTEGER

    public instantiate(scene: Phaser.Scene, colliderFunc: AddProjectileFunc, team: Teams, mountPointOffsetX: number, mountPointOffsetY: number) : Weapon
    {
        return new Weapon(scene, colliderFunc, this.projectile, this.heatPerShot, this.cooldown, this.spread, this.initialDelay, this.delayBetweenShots, team, mountPointOffsetX, mountPointOffsetY)
    }
}

export const DummyWeapon : WeaponTemplate =
    Object.assign(new WeaponTemplate(),
    {
        name : "Dummy Weapon",
        cooldown : Number.MAX_SAFE_INTEGER,
        projectile : Projectile.EmptyTemplate,
        projectilesPerShot : 0,
        heatPerShot : 0,
        spread : NoSpread,
        initialDelay : Number.MAX_SAFE_INTEGER,
        delayBetweenShots: Number.MAX_SAFE_INTEGER
    })

export const LightLaser : WeaponTemplate =
    Object.assign(new WeaponTemplate(),
    {
        name: "Light Laser",
        cooldown: 333,
        projectile: Projectile.LightLaserTemplate,
        projectilesPerShot: 1,
        heatPerShot: 4,
        spread: NoSpread,
        initialDelay: 0,
        delayBetweenShots: 0
    })

export const FusionGun : WeaponTemplate = 
    Object.assign(new WeaponTemplate(),
    {
        name: "Fusion Gun",
        cooldown: 3000,
        projectile: Projectile.FusionGunTemplate,
        projectilesPerShot: 1,
        heatPerShot: 50,
        spread: NoSpread,
        initialDelay: 0,
        delayBetweenShots: 0
    })