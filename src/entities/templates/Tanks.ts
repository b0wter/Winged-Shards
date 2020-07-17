import { Manufacturers } from '~/utilities/Manufacturers'
import { HardPoint, HardPointSize, HardPointType, HardPointPosition } from '../Hardpoint'
import { TankTemplate } from '../Tank'
import Point = Phaser.Geom.Point
import { TripleLaser } from './Weapons'

export class MediumTankTemplate extends TankTemplate
{
    modelName = "Broadsword"
    manufacturer = Manufacturers.Roskosmos
    spriteKey = "red_tank"
    turretSpriteKey = "red_tank_turret"
    hull = 100
    structure = 50
    heatDissipation = 5
    maxHeat = 100
    maxSpeed = 125
    angularSpeed = 90
    turretAngularSpeed = 180
    hardpoints = [
        HardPoint.empty(HardPointSize.Large, HardPointType.WithoutExtras, HardPointPosition.Turret, 10, 0, 0),
        HardPoint.empty(HardPointSize.Small, HardPointType.WithoutExtras, HardPointPosition.Hull, 0, 0, 0),
        HardPoint.empty(HardPointSize.Small, HardPointType.WithoutExtras, HardPointPosition.Hull, 0, 0, 0)
    ]
    turretOffset = new Point(0, 0)
    description = "Versatile"
}
export const MediumTank = new MediumTankTemplate()

export class TestingTankTemplate extends MediumTankTemplate
{
    modelName = "TEST TEST"
    hull = 1000
    heatDissipation = 1000
    maxSpeed = 300
    angularSpeed = 120
}
export const TestingTank = new TestingTankTemplate()

export class HoverScoutTemplate extends TankTemplate
{
    modelName = "Wasp"
    manufacturer = Manufacturers.RobotOrbit
    spriteKey = "hover_tank_01"
    hull = 50
    structure = 35
    heatDissipation = 4
    maxHeat = 50
    maxSpeed = 175
    angularSpeed = 135
    turretSpriteKey = "hover_tank_turret_single_barrel"
    turretAngularSpeed = 180
    turretOffset = new Point(0, 0)
    hardpoints = [
        HardPoint.empty(HardPointSize.Medium, HardPointType.WithoutExtras, HardPointPosition.Turret, 0, 0, 0),
        HardPoint.empty(HardPointSize.Small, HardPointType.WithoutExtras, HardPointPosition.Hull, 0, 20, 0),
        HardPoint.empty(HardPointSize.Small, HardPointType.WithoutExtras, HardPointPosition.Hull, 0, -20, 0)
    ]
    description = "Fast, Hovering"
}
export const HoverScout = new HoverScoutTemplate()

export class SupportHoverTankTemplate extends TankTemplate
{
    modelName = "Bumblebee"
    manufacturer = Manufacturers.RobotOrbit
    spriteKey = "hover_tank_02"
    hull = 65
    structure = 50
    heatDissipation = 8
    maxHeat = 120
    maxSpeed = 125
    angularSpeed = 135
    turretSpriteKey = "hover_tank_turret_single_barrel"
    turretAngularSpeed = 180
    turretOffset = new Point(0, 0)
    hardpoints = [
        HardPoint.empty(HardPointSize.Small, HardPointType.WithoutExtras, HardPointPosition.Turret, -3, 0, 0),
        HardPoint.empty(HardPointSize.Small, HardPointType.WithoutExtras, HardPointPosition.Hull, -9,  15, 0),
        HardPoint.empty(HardPointSize.Small, HardPointType.WithoutExtras, HardPointPosition.Hull, -9, -15, 0),
        HardPoint.empty(HardPointSize.Small, HardPointType.WithoutExtras, HardPointPosition.Hull,  2,  15, 0),
        HardPoint.empty(HardPointSize.Small, HardPointType.WithoutExtras, HardPointPosition.Hull,  2, -15, 0)
    ]
    description = "Support, Hovering"
}
export const SupportHoverTank = new SupportHoverTankTemplate()

export class LightHoverTankTemplate extends TankTemplate
{
    modelName = "Hornet"
    manufacturer = Manufacturers.RobotOrbit
    spriteKey = "hover_tank_03"
    hull = 100
    structure = 35
    heatDissipation = 6
    maxHeat = 100
    maxSpeed = 150
    angularSpeed = 120
    turretSpriteKey = "hover_tank_turret_single_barrel"
    turretOffset = new Point(0, 0)
    turretAngularSpeed = 180
    hardpoints = [
        HardPoint.empty(HardPointSize.Medium, HardPointType.WithoutExtras, HardPointPosition.Turret, 20, 0, 0),
        HardPoint.empty(HardPointSize.Small, HardPointType.WithoutExtras, HardPointPosition.Hull, 10,  12, 0),
        HardPoint.empty(HardPointSize.Small, HardPointType.WithoutExtras, HardPointPosition.Hull, 10, -12, 0),
    ]
    description = "Light, Hovering"
}
export const LightHoverTank = new LightHoverTankTemplate()

export const AllTemplates : TankTemplate[] = [ TestingTank, MediumTank, LightHoverTank, SupportHoverTank, HoverScout ]