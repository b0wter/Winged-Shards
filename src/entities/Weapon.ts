import Phaser from 'phaser'
import * as Damage from './DamageType'
import * as Projectile from './Projectile'
import { Teams } from './Teams'
import Equipment from './Equipment'

export interface None { }
export const NoSpread : None = { }
export interface Angular { degreesDistance: number }
export interface Parallel { distanceToNext: number }
export type WeaponSpread = None | Angular | Parallel

export class Weapon extends Equipment
{
    /**
     * Position of this weapon relative to the ship its placed on.
     */
    get mountPointOffsetX() { return this._mountPointOffsetX }

    /**
     * Position of this weapon relative to the ship its placed on.
     */
    get mountPointOffsetY() { return this._mountPointOffsetY }

    constructor(private scene: Phaser.Scene,
                private collider: Phaser.Physics.Arcade.Group,
                private projectile: Projectile.ProjectileTemplate, 
                heatPerShot: number,
                _cooldown: number,
                private spread: WeaponSpread,
                private initialDelay: number,
                private delayBetweenShots: number,
                private team: Teams,
                private _mountPointOffsetX: number,
                private _mountPointOffsetY: number
               )
    {
        super(_cooldown, heatPerShot)
        if(this.team !== Teams.Players) this.cooldownModifier = 2
    }

    /**
     * Tries to shoot this weapon. Does not run a cooldown check!
     */
    protected internalTrigger(x, y, angle, time) {
        const offset = Phaser.Math.Rotate({x: this.mountPointOffsetX, y: this.mountPointOffsetY}, angle)
        Projectile.fromTemplate(this.scene, x + offset.x, y + offset.y, this.team, angle, this.projectile, this.collider)
    }

    public update(t: number, dt: number)
    {
        //
    }

    protected mountOffset()
    {
        return new Phaser.Math.Vector2(this.mountPointOffsetX, this.mountPointOffsetY)
    }
}

export class WeaponTemplate
{
    public name = "<WeaponTemplate>"
    public cooldown: number = Number.MAX_SAFE_INTEGER
    public projectile: Projectile.ProjectileTemplate = Projectile.EmptyTemplate
    public projectilesPerShot = 0
    public heatPerShot = 0
    public spread: WeaponSpread = NoSpread
    public initialDelay = Number.MAX_SAFE_INTEGER
    public delayBetweenShots = Number.MAX_SAFE_INTEGER
}

export function fromTemplate(scene, collider, team, t: WeaponTemplate, mountPointOffsetX = 0, mountPointOffsetY = 0) : Weapon
{
    return new Weapon(scene, collider, t.projectile, t.heatPerShot, t.cooldown, t.spread, t.initialDelay, t.delayBetweenShots, team, mountPointOffsetX, mountPointOffsetY)
}

export const DummyWeapon : WeaponTemplate =
{
    name : "Dummy Weapon",
    cooldown : Number.MAX_SAFE_INTEGER,
    projectile : Projectile.EmptyTemplate,
    projectilesPerShot : 0,
    heatPerShot : 0,
    spread : NoSpread,
    initialDelay : Number.MAX_SAFE_INTEGER,
    delayBetweenShots: Number.MAX_SAFE_INTEGER

}

export const LightLaser : WeaponTemplate =
{
    name: "Light Laser",
    cooldown: 333,
    projectile: Projectile.LightLaserTemplate,
    projectilesPerShot: 1,
    heatPerShot: 4,
    spread: NoSpread,
    initialDelay: 0,
    delayBetweenShots: 0
}

export const FusionGun : WeaponTemplate = 
{
    name: "Fusion Gun",
    cooldown: 2000,
    projectile: Projectile.FusionGunTemplate,
    projectilesPerShot: 1,
    heatPerShot: 50,
    spread: NoSpread,
    initialDelay: 0,
    delayBetweenShots: 0
}