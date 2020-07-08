import { ActiveEquipmentTemplate } from '../TriggeredEquipment'
import * as Projectile from './../Projectile'
import { WeaponSpread, NoSpread, Weapon } from '../Weapon'
import { AddProjectileFunc } from '~/scenes/ColliderCollection'
import { Teams } from '../Teams'

export abstract class WeaponTemplate extends ActiveEquipmentTemplate
{

    public abstract readonly name: string
    public abstract readonly cooldown: number 
    public abstract readonly projectile: Projectile.ProjectileTemplate
    public abstract readonly projectilesPerShot: number
    public abstract readonly heatPerShot: number
    public abstract readonly spread: WeaponSpread
    public abstract readonly initialDelay: number
    public abstract readonly delayBetweenShots: number

    public instantiate(scene: Phaser.Scene, colliderFunc: AddProjectileFunc, team: Teams, mountPointOffsetX: number, mountPointOffsetY: number) : Weapon
    {
        return new Weapon(scene, colliderFunc, this.projectile, this.heatPerShot, this.cooldown, this.spread, this.initialDelay, this.delayBetweenShots, team)
    }
}

export class LightLaser extends WeaponTemplate {
    public readonly name = "Light Laser"
    public readonly cooldown = 333
    public readonly projectile = Projectile.LightLaserTemplate
    public readonly projectilesPerShot = 1
    public readonly heatPerShot = 4
    public readonly spread = NoSpread
    public readonly initialDelay = 0
    public readonly delayBetweenShots = 0
}

export class FusionGun extends WeaponTemplate {
    public readonly name = "Fusion Gun"
    public readonly cooldown = 3000
    public readonly projectile = Projectile.FusionGunTemplate
    public readonly projectilesPerShot = 1
    public readonly heatPerShot = 50
    public readonly spread = NoSpread
    public readonly initialDelay = 0
    public readonly delayBetweenShots = 0
}