import { ActiveEquipmentTemplate } from '../TriggeredEquipment'
import * as Projectile from './../Projectile'
import { WeaponSpread, NoSpread, Weapon } from '../Weapon'
import { AddProjectileFunc } from '~/scenes/ColliderCollection'
import { Teams } from '../Teams'

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
        return new Weapon(scene, colliderFunc, this.projectile, this.heatPerShot, this.cooldown, this.spread, this.initialDelay, this.delayBetweenShots, team)
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