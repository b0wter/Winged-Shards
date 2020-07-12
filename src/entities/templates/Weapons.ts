import * as Projectiles from './Projectiles'
import { NoSpread, WeaponTemplate } from '../Weapon'
import { HardPointSize, HardPointType } from '../Hardpoint'
import { Manufacturers } from '~/utilities/Manufacturers'

export class LightLaserTemplate extends WeaponTemplate {
    public readonly name = "Light Laser"
    public readonly cooldown = 333
    public readonly projectile = Projectiles.LightLaserTemplate
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
    public readonly name = "Tri"
    public readonly cooldown = 666
    public readonly projectile = Projectiles.LightLaserTemplate
    public readonly projectilesPerShot = 3
    public readonly heatPerShot = 12
    public readonly spread = NoSpread
    public readonly initialDelay = 0
    public readonly delayBetweenShots = 16*4
    public readonly hardPointSize = HardPointSize.Small
    public readonly hardPointType = HardPointType.WithoutExtras
    public readonly manufacturer = Manufacturers.BattlePrep
    public readonly modelName = "Triple Tap"
}
export const TripleLaser = new TripleLaserTemplate()

export class FusionGun extends WeaponTemplate {
    public readonly name = "Fusion Gun"
    public readonly cooldown = 3000
    public readonly projectile = Projectiles.FusionGunTemplate
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

export const AllTemplates = [ LightLaser, TripleLaser ]