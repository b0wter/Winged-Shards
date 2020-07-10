import { Manufacturers } from '~/utilities/Manufacturers'
import { HardPoint, HardPointSize, HardPointType, HardPointPosition } from '../Hardpoint'
import { Ship } from '../Ship'

export abstract class ShipTemplate
{
    public abstract modelName: string
    public abstract manufacturer: Manufacturers
    public abstract spriteKey: string
    public abstract turretSpriteKey: string
    public abstract hull: number
    public abstract structure: number
    public abstract maxHeat: number
    public abstract heatDissipation: number
    public abstract maxSpeed: number
    public abstract angularSpeed: number
    public abstract turretAngularSpeed: number
    public abstract hardpoints: HardPoint[] 

    public instantiate()
    {
        return new Ship(this.hull, this.structure, this.maxSpeed, this.angularSpeed, this.turretAngularSpeed, this.maxHeat, this.heatDissipation, this.hardpoints, this.spriteKey, this.turretSpriteKey, this.manufacturer, this.modelName)
    }
}

export class DefaultFighterTemplate extends ShipTemplate
{
    public modelName = "Rapier V-37"
    public manufacturer = Manufacturers.Roskosmos
    public spriteKey = "red_tank"
    public turretSpriteKey = "red_tank_turret"
    public hull = 100
    public structure = 50
    public heatDissipation = 5
    public maxHeat = 100
    public maxSpeed = 125
    public angularSpeed = 90
    public turretAngularSpeed = 180
    public hardpoints = [
        HardPoint.empty(HardPointSize.Small, HardPointType.WithoutExtras, HardPointPosition.Turret,  0, -10),
        HardPoint.empty(HardPointSize.Small, HardPointType.WithoutExtras, HardPointPosition.Turret,  0,  10),
        HardPoint.empty(HardPointSize.Small, HardPointType.WithoutExtras, HardPointPosition.Turret, 10,   0),
        HardPoint.empty(HardPointSize.Small, HardPointType.WithoutExtras, HardPointPosition.Hull, 0,   0),
        HardPoint.empty(HardPointSize.Small, HardPointType.WithoutExtras, HardPointPosition.Hull, 0,   0)
    ]
}