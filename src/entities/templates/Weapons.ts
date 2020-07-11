import { TriggeredEquipmentTemplate } from '../TriggeredEquipment'
import * as Projectile from './../Projectile'
import { WeaponSpread, NoSpread, Weapon } from '../Weapon'
import { AddProjectileFunc } from '~/scenes/ColliderCollection'
import { Teams } from '../Teams'
import { HardPointSize, HardPointType } from '../Hardpoint'
import { Manufacturers } from '~/utilities/Manufacturers'

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

    public instantiate(scene: Phaser.Scene, colliderFunc: AddProjectileFunc, team: Teams) : Weapon
    {
        return new Weapon(scene, colliderFunc, this.projectile, this.heatPerShot, this.cooldown, this.projectilesPerShot, this.spread, this.initialDelay, this.delayBetweenShots, this.hardPointSize, this.hardPointType, this.manufacturer, this.name, team)
    }
}

export class LightLaserTemplate extends WeaponTemplate {
    public readonly name = "Light Laser"
    public readonly cooldown = 333
    public readonly projectile = Projectile.LightLaserTemplate
    public readonly projectilesPerShot = 1
    public readonly heatPerShot = 4
    public readonly spread = NoSpread
    public readonly initialDelay = 0
    public readonly delayBetweenShots = 0
    public readonly hardPointSize = HardPointSize.Small
    public readonly hardPointType = HardPointType.WithoutExtras
    public readonly manufacturer = Manufacturers.BattlePrep
    public readonly modelName = "Light Laser A"
}
export const LightLaser = new LightLaserTemplate()

export class TripleLaserTemplate extends WeaponTemplate {
    public readonly name = "Light Laser"
    public readonly cooldown = 666
    public readonly projectile = Projectile.LightLaserTemplate
    public readonly projectilesPerShot = 3
    public readonly heatPerShot = 10
    public readonly spread = NoSpread
    public readonly initialDelay = 0
    public readonly delayBetweenShots = 16*4
    public readonly hardPointSize = HardPointSize.Small
    public readonly hardPointType = HardPointType.WithoutExtras
    public readonly manufacturer = Manufacturers.BattlePrep
    public readonly modelName = "Light Laser A"
}
export const TripleLaster = new TripleLaserTemplate()

export class FusionGun extends WeaponTemplate {
    public readonly name = "Fusion Gun"
    public readonly cooldown = 3000
    public readonly projectile = Projectile.FusionGunTemplate
    public readonly projectilesPerShot = 1
    public readonly heatPerShot = 50
    public readonly spread = NoSpread
    public readonly initialDelay = 1000
    public readonly delayBetweenShots = 0
    public readonly hardPointSize = HardPointSize.Small
    public readonly hardPointType = HardPointType.WithoutExtras
    public readonly manufacturer = Manufacturers.BattlePrep
    public readonly modelName = "Fusion Master 2000"
}