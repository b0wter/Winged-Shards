import { TriggeredEquipmentTemplate } from '../TriggeredEquipment'
import * as Projectile from './../Projectile'
import { WeaponSpread, NoSpread, Weapon } from '../Weapon'
import { AddProjectileFunc } from '~/scenes/ColliderCollection'
import { Teams } from '../Teams'
import { HardPointSize, HardPointType } from '../Hardpoint'
import { Manufacturers, manufacturerToString } from '~/utilities/Manufacturers'

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

    private get firingInterval() { return this.cooldown + (this.delayBetweenShots - 1) * this.projectilesPerShot }
    private get firingIntervalPerSecod() { return 1 / (this.firingInterval / 1000) }
    public get dps() { return this.projectile.damage.scale(this.firingIntervalPerSecod * this.projectilesPerShot) }
    public get heatPerSecond() { return this.firingIntervalPerSecod * this.heatPerShot }

    constructor()
    {
        super()
    }

    public get stats()
    {   
        return `
TEMPLATE: ${this.modelName} (${manufacturerToString(this.manufacturer)})
DPS: ${this.dps}
HPS: ${this.heatPerSecond.toFixed(2)}
Firing interval: ${this.firingInterval}
Shots/sec: ${this.firingIntervalPerSecod}
Triggers/sec: ${this.firingIntervalPerSecod}
`
    }

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
    public readonly name = "Tri"
    public readonly cooldown = 666
    public readonly projectile = Projectile.LightLaserTemplate
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

export const AllTemplates = [ LightLaser, TripleLaser ]