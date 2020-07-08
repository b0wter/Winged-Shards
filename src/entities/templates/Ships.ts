import { Manufacturers } from '~/utilities/Manufacturers'
import { HardPoint, HardPointSize, HardPointType } from '../Hardpoint'
import { Ship } from '../Ship'

export abstract class ShipTemplate
{
    public abstract modelName: string
    public abstract manufacturer: Manufacturers
    public abstract spriteKey: string
    public abstract hull: number
    public abstract structure: number
    public abstract maxHeat: number
    public abstract heatDissipation: number
    public abstract maxSpeed: number
    public abstract hardpoints: HardPoint[] 

    public instantiate()
    {
        return new Ship(this.hull, this.structure, this.maxSpeed, this.maxHeat, this.heatDissipation, this.hardpoints, this.spriteKey, this.manufacturer, this.modelName)
    }
}

export class DefaultFighterTemplate extends ShipTemplate
{
    public modelName = "Rapier V-37"
    public manufacturer = Manufacturers.Roskosmos
    public spriteKey = "spaceship_01"
    public hull = 100
    public structure = 50
    public heatDissipation = 5
    public maxHeat = 100
    public maxSpeed = 200
    public hardpoints = [
        HardPoint.empty(HardPointSize.Small, HardPointType.WithoutExtras,  0, -20),
        HardPoint.empty(HardPointSize.Small, HardPointType.WithoutExtras,  0,  20),
        HardPoint.empty(HardPointSize.Small, HardPointType.WithoutExtras, 20,   0),
        HardPoint.empty(HardPointSize.Small, HardPointType.WithoutExtras,  0,   0),
        HardPoint.empty(HardPointSize.Small, HardPointType.WithoutExtras,  0,   0)
    ]
}