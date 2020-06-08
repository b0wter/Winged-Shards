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
                _cooldown: number,
                private spread: WeaponSpread,
                private team: Teams,
                private _mountPointOffsetX: number,
                private _mountPointOffsetY: number
               )
    {
        super(_cooldown)
    }

    /**
     * Tries to shoot this weapon. Will check for cooldown and other things.
     */
    protected internalTrigger(x, y, angle, time) {
        const offset = Phaser.Math.Rotate({x: this.mountPointOffsetX, y: this.mountPointOffsetY}, angle)
        Projectile.fromTemplate(this.scene, x + offset.x, y + offset.y, this.team, angle, this.projectile, this.collider)
    }
                
}

export class WeaponTemplate
{
    public name = "<WeaponTemplate>"
    public cooldown: number = 1000
    public projectile: Projectile.ProjectileTemplate = Projectile.EmptyTemplate
    public projectilesPerShot = 1
    public spread: WeaponSpread = NoSpread
}

export function fromTemplate(scene, collider, team, t: WeaponTemplate, mountPointOffsetX = 0, mountPointOffsetY = 0) : Weapon
{
    const w = new Weapon(scene, collider, t.projectile, t.cooldown, t.spread, team, mountPointOffsetX, mountPointOffsetY)
    return w
}

export const LightLaser : WeaponTemplate =
{
    name: "Light Laser",
    cooldown: 200,
    projectile: Projectile.LightLaserTemplate,
    projectilesPerShot: 1,
    spread: NoSpread
}