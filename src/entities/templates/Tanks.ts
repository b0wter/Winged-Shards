import { Manufacturers } from '~/utilities/Manufacturers'
import { HardPoint, HardPointSize, HardPointType, HardPointPosition } from '../Hardpoint'
import { TankTemplate } from '../Tank'
import Point = Phaser.Geom.Point
import { TripleLaser } from './Weapons'

export class MediumTankTemplate extends TankTemplate
{
    modelName = "Rapier V-37"
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
}

export class HoverScoutTemplate extends TankTemplate
{
    modelName = "Wasp"
    manufacturer = Manufacturers.RobotOrbit
    spriteKey = "hover_tank_01"
    hull = 50
    structure = 35
    heatDissipation = 5
    maxHeat = 75
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
}

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
        HardPoint.empty(HardPointSize.Medium, HardPointType.WithoutExtras, HardPointPosition.Turret, -3, 0, 0),
        HardPoint.empty(HardPointSize.Small, HardPointType.WithoutExtras, HardPointPosition.Hull, -9,  15, 0),
        HardPoint.empty(HardPointSize.Small, HardPointType.WithoutExtras, HardPointPosition.Hull, -9, -15, 0),
        HardPoint.empty(HardPointSize.Small, HardPointType.WithoutExtras, HardPointPosition.Hull,  2,  15, 0),
        HardPoint.empty(HardPointSize.Small, HardPointType.WithoutExtras, HardPointPosition.Hull,  2, -15, 0)
    ]    
}

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
        HardPoint.empty(HardPointSize.Medium, HardPointType.WithoutExtras, HardPointPosition.Turret, -7, 0, 0),
        HardPoint.empty(HardPointSize.Small, HardPointType.WithoutExtras, HardPointPosition.Hull, 10,  12, 0),
        HardPoint.empty(HardPointSize.Small, HardPointType.WithoutExtras, HardPointPosition.Hull, 10, -12, 0),
        HardPoint.empty(HardPointSize.Small, HardPointType.WithoutExtras, HardPointPosition.Hull, -2,  12, 0),
        HardPoint.empty(HardPointSize.Small, HardPointType.WithoutExtras, HardPointPosition.Hull, -2, -12, 0)
    ]
}