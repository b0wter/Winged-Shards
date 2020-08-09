import { HeatExchanger } from '../HeatExchanger'
import { Manufacturers } from '~/utilities/Manufacturers'
import { HardPointSize, HardPointType } from '../Hardpoint'

export class SmallHeatExchanger extends HeatExchanger
{
    manufacturer = Manufacturers.BattlePrep
    modelName = "HEx-001s"
    hardPointSize = HardPointSize.Small
    hardPointType = HardPointType.WithoutExtras
    heatPerSecond = -5
    maxHeatBonus = 0
    price = 10
}

export class MediumHeatExchanger extends HeatExchanger
{
    manufacturer = Manufacturers.BattlePrep
    modelName = "HEx-001m"
    hardPointSize = HardPointSize.Medium
    hardPointType = HardPointType.WithoutExtras
    heatPerSecond = -8
    maxHeatBonus = 0
    price = 40
}

export class LargeHeatExchanger extends HeatExchanger
{
    manufacturer = Manufacturers.BattlePrep
    modelName = "HEx-001l"
    hardPointSize = HardPointSize.Large
    hardPointType = HardPointType.WithoutExtras
    heatPerSecond = -11
    maxHeatBonus = 0
    price = 90
}