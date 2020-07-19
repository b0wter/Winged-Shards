import * as Projectiles from './Projectiles'
import { NoSpread, Weapon, AngularSpread, ParallelSpread, RandomSpread, WeaponTemplate } from '../Weapon'
import { HardPointSize, HardPointType } from '../Hardpoint'
import { Manufacturers } from '~/utilities/Manufacturers'
import { Projectile } from '../Projectile'

export class LightLaser extends Weapon {
    cooldown = 333
    projectile = Projectiles.LightLaser
    shotsPerTrigger = 1
    projectilesPerShot = 1
    heatPerTrigger = 4
    spread = NoSpread
    initialDelay = 0
    delayBetweenShots = 0
    hardPointSize = HardPointSize.Small
    hardPointType = HardPointType.WithoutExtras
    manufacturer = Manufacturers.BattlePrep
    modelName = "Light Laser A"
}
export const LightLaserTemplate : WeaponTemplate = () => new LightLaser()

export class TripleLaser extends Weapon{
    cooldown = 666
    projectile = Projectiles.LightLaser
    shotsPerTrigger = 3
    projectilesPerShot = 1
    heatPerTrigger = 12
    spread = NoSpread
    initialDelay = 0
    delayBetweenShots = 16*4
    hardPointSize = HardPointSize.Small
    hardPointType = HardPointType.WithoutExtras
    manufacturer = Manufacturers.BattlePrep
    modelName = "Triple Tap"
}
export const TripleLaserTemplate : WeaponTemplate = () => new TripleLaser()

export class LightMultiLaser extends Weapon
{
    cooldown = 666
    projectile = Projectiles.LightLaser
    shotsPerTrigger = 1
    projectilesPerShot = 3
    heatPerTrigger = 15
    spread = ParallelSpread(10)
    initialDelay = 0
    delayBetweenShots = 0
    hardPointSize = HardPointSize.Medium
    hardPointType = HardPointType.WithoutExtras
    manufacturer = Manufacturers.BattlePrep
    modelName = "Multi Laser A"
}
export const LightMultiLaserTemplate : WeaponTemplate = () => new LightMultiLaser()

export class TestLaser extends LightMultiLaser
{
    cooldown = 100
    heatPerTrigger = 0
}
export const TestLaserTemplate : WeaponTemplate = () => new TestLaser()

export class SpreadLaser extends Weapon{
    cooldown = 666
    projectile = Projectiles.LightLaserShotgun
    shotsPerTrigger = 1
    projectilesPerShot = 5
    heatPerTrigger = 10
    spread = AngularSpread(15)
    initialDelay = 0
    delayBetweenShots = 0
    hardPointSize = HardPointSize.Medium
    hardPointType = HardPointType.WithoutExtras
    manufacturer = Manufacturers.BattlePrep
    modelName = "Laser Shotgun"
}
export const SpreadLaserTemplate : WeaponTemplate = () => new SpreadLaser()

export class FusionGun extends Weapon{
    cooldown = 3000
    projectile = Projectiles.FusionGun
    shotsPerTrigger = 1
    projectilesPerShot = 1
    heatPerTrigger = 50
    spread = NoSpread
    initialDelay = 1000
    delayBetweenShots = 0
    hardPointSize = HardPointSize.Small
    hardPointType = HardPointType.WithoutExtras
    manufacturer = Manufacturers.BattlePrep
    modelName = "Fusion Master 2000"
}
export const FusionGunTemplate : WeaponTemplate = () => new FusionGun()

export class Shotgun extends Weapon
{
    cooldown = 1500
    projectile = Projectiles.Bullet
    shotsPerTrigger = 3
    projectilesPerShot = 3
    heatPerTrigger = 1
    spread = RandomSpread(30)
    initialDelay = 0
    delayBetweenShots = 10
    hardPointSize = HardPointSize.Medium
    hardPointType = HardPointType.WithAmmoBox
    manufacturer = Manufacturers.BattlePrep
    modelName = "Boom"
}
export const ShotgunTemplate : WeaponTemplate = () => new Shotgun()