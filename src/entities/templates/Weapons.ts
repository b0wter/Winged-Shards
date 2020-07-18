import * as Projectiles from './Projectiles'
import { NoSpread, WeaponTemplate, Weapon, AngularSpread, ParallelSpread, RandomSpread } from '../Weapon'
import { HardPointSize, HardPointType } from '../Hardpoint'
import { Manufacturers } from '~/utilities/Manufacturers'
import { Projectile } from '../Projectile'

export class LightLaserTemplate extends WeaponTemplate {
    cooldown = 333
    projectile = Projectiles.LightLaser
    shotsPerTrigger = 1
    projectilesPerTrigger = 1
    heatPerTrigger = 4
    spread = NoSpread
    initialDelay = 0
    delayBetweenShots = 0
    hardPointSize = HardPointSize.Small
    hardPointType = HardPointType.WithoutExtras
    manufacturer = Manufacturers.BattlePrep
    modelName = "Light Laser A"
}
export const LightLaser = new LightLaserTemplate()

export class TripleLaserTemplate extends WeaponTemplate {
    cooldown = 666
    projectile = Projectiles.LightLaser
    shotsPerTrigger = 3
    projectilesPerTrigger = 1
    heatPerTrigger = 12
    spread = NoSpread
    initialDelay = 0
    delayBetweenShots = 16*4
    hardPointSize = HardPointSize.Small
    hardPointType = HardPointType.WithoutExtras
    manufacturer = Manufacturers.BattlePrep
    modelName = "Triple Tap"
}
export const TripleLaser = new TripleLaserTemplate()

export class LightMultiLaserTemplate extends WeaponTemplate
{
    cooldown = 666
    projectile = Projectiles.LightLaser
    shotsPerTrigger = 1
    projectilesPerTrigger = 3
    heatPerTrigger = 15
    spread = ParallelSpread(10)
    initialDelay = 0
    delayBetweenShots = 0
    hardPointSize = HardPointSize.Medium
    hardPointType = HardPointType.WithoutExtras
    manufacturer = Manufacturers.BattlePrep
    modelName = "Multi Laser A"
}
export const LightMultiLaser = new LightMultiLaserTemplate()

export class TestLaserTemplate extends LightMultiLaserTemplate
{
    cooldown = 100
    heatPerTrigger = 0
}
export const TestLaser = new TestLaserTemplate()

export class SpreadLaserTemplate extends WeaponTemplate {
    cooldown = 666
    projectile = Projectiles.LightLaserShotgun
    shotsPerTrigger = 1
    projectilesPerTrigger = 5
    heatPerTrigger = 10
    spread = AngularSpread(15)
    initialDelay = 0
    delayBetweenShots = 0
    hardPointSize = HardPointSize.Medium
    hardPointType = HardPointType.WithoutExtras
    manufacturer = Manufacturers.BattlePrep
    modelName = "Laser Shotgun"
}
export const SpreadLaser = new SpreadLaserTemplate()

export class FusionGunTemplate extends WeaponTemplate {
    cooldown = 3000
    projectile = Projectiles.FusionGun
    shotsPerTrigger = 1
    projectilesPerTrigger = 1
    heatPerTrigger = 50
    spread = NoSpread
    initialDelay = 1000
    delayBetweenShots = 0
    hardPointSize = HardPointSize.Small
    hardPointType = HardPointType.WithoutExtras
    manufacturer = Manufacturers.BattlePrep
    modelName = "Fusion Master 2000"
}
export const FusionGun = new FusionGunTemplate()

export class ShotgunTemplate extends WeaponTemplate 
{
    cooldown = 1500
    projectile = Projectiles.Bullet
    shotsPerTrigger = 3
    projectilesPerTrigger = 3
    heatPerTrigger = 1
    spread = RandomSpread(30)
    initialDelay = 0
    delayBetweenShots = 10
    hardPointSize = HardPointSize.Medium
    hardPointType = HardPointType.WithAmmoBox
    manufacturer = Manufacturers.BattlePrep
    modelName = "Boom"
}
export const Shotgun = new ShotgunTemplate()

export const AllTemplates = [ LightLaser, TripleLaser, LightMultiLaser, SpreadLaser, FusionGun, Shotgun ]