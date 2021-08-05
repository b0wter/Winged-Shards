import * as Projectiles from './Projectiles'
import { NoSpread, Weapon, AngularSpread, ParallelSpread, RandomSpread, WeaponTemplate, ProjectileWeapon, MagazineProjectileWeapon } from '../Weapon'
import { HardPointSize, HardPointType } from '../Hardpoint'
import { Manufacturers } from '~/utilities/Manufacturers'
import { Projectile } from '../Projectile'
import { SmallMissile, SmallDummyMissile } from './Missiles'

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
    price = 5
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
    price = 20
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
    price = 20
}
export const LightMultiLaserTemplate : WeaponTemplate = () => new LightMultiLaser()

export class TestLaser extends LightMultiLaser
{
    cooldown = 100
    heatPerTrigger = 0
    price = Number.MAX_SAFE_INTEGER
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
    price = 10
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
    price = 250
}
export const FusionGunTemplate : WeaponTemplate = () => new FusionGun()

export class Shotgun extends ProjectileWeapon
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
    maxAmmo = 50
    price = 80
}
export const ShotgunTemplate : WeaponTemplate = () => new Shotgun()

export class Revolver extends MagazineProjectileWeapon
{
    cooldown = 200
    projectile = Projectiles.MediumBullet
    shotsPerTrigger = 1
    projectilesPerShot = 1
    heatPerTrigger = 5
    spread = NoSpread
    initialDelay = 0
    delayBetweenShots = 0
    hardPointSize = HardPointSize.Medium
    hardPointType = HardPointType.WithAmmoBox
    manufacturer = Manufacturers.BattlePrep
    modelName = "Western Feeling"
    maxAmmo = 36
    magazineReload = 3600
    shotsPerMagazine = 6
    price = 40
}
export const RevolverTemplate : WeaponTemplate = () => new Revolver()

export class LightAutoCannon extends ProjectileWeapon
{
    cooldown = 3500
    projectile = Projectiles.Bullet
    shotsPerTrigger = 5
    projectilesPerShot = 1
    heatPerTrigger = 2
    spread = RandomSpread(4)
    initialDelay = 0
    delayBetweenShots = 50
    hardPointSize = HardPointSize.Small
    hardPointType = HardPointType.WithAmmoBox
    manufacturer = Manufacturers.Gunnerr
    modelName = "AC5"
    maxAmmo = 200
    price = 100
}
export const LightAutoCannonTemplate : WeaponTemplate = () => new LightAutoCannon()

export class MediumAutoCannon extends LightAutoCannon
{
    cooldown = 4500
    shotsPerTrigger = 10
    heatPerTrigger = 5
    spread = RandomSpread(5)
    delayBetweenShots = 40
    hardPointSize = HardPointSize.Medium
    maxAmmo = 100
    price = 250
}
export const MediumAutoCannonTemplate : WeaponTemplate = () => new MediumAutoCannon()

export class HeavyAutoCannon extends LightAutoCannon
{
    cooldown = 5500
    shotsPerTrigger = 20
    heatPerTrigger = 12
    spread = RandomSpread(6)
    delayBetweenShots = 30
    hardPointSize = HardPointSize.Large
    maxAmmo = 35
    price = 400
}
export const HeavyAutoCannonTemplate : WeaponTemplate = () => new HeavyAutoCannon()

export class SmallHomingMissileLauncher extends ProjectileWeapon
{
    cooldown = 1500
    projectile = SmallMissile
    shotsPerTrigger = 1
    projectilesPerShot = 1
    heatPerTrigger = 0
    spread = NoSpread
    initialDelay = 0
    delayBetweenShots = 0
    hardPointSize = HardPointSize.Small
    hardPointType = HardPointType.WithAmmoBox
    manufacturer = Manufacturers.BattlePrep
    modelName = "SML-1"
    maxAmmo = 36
    price = 80    
}
export const SmallHomingMissleLauncherTemplate : WeaponTemplate = () => new SmallHomingMissileLauncher()

export class SmallSpreadMissileLauncher extends ProjectileWeapon
{
    cooldown = 1500
    projectile = SmallMissile
    shotsPerTrigger = 1
    projectilesPerShot = 4
    heatPerTrigger = 0
    spread = AngularSpread(15)
    initialDelay = 0
    delayBetweenShots = 0
    hardPointSize = HardPointSize.Small
    hardPointType = HardPointType.WithAmmoBox
    manufacturer = Manufacturers.BattlePrep
    modelName = "SML-4H"
    maxAmmo = 15
    price = 200
}
export const SmallSpreadMissleLauncherTemplate : WeaponTemplate = () => new SmallSpreadMissileLauncher()

export class SmallSpreadDummyMissileLauncher extends ProjectileWeapon
{
    cooldown = 1500
    projectile = SmallDummyMissile
    shotsPerTrigger = 1
    projectilesPerShot = 3
    heatPerTrigger = 0
    spread = ParallelSpread(15)
    initialDelay = 0
    delayBetweenShots = 0
    hardPointSize = HardPointSize.Small
    hardPointType = HardPointType.WithAmmoBox
    manufacturer = Manufacturers.BattlePrep
    modelName = "SML-3D"
    maxAmmo = 15
    price = 200
}
export const SmallSpreadDummyMissleLauncherTemplate : WeaponTemplate = () => new SmallSpreadDummyMissileLauncher()