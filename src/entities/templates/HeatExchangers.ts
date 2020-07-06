import { HeatExchanger } from '../HeatExchanger'
import { Manufacturers } from '~/utilities/Manufacturers'
import { HardPointSize, HardPointType } from '../Hardpoint'

export class SmallHeatExchanger extends HeatExchanger
{
    public readonly manufacturer = Manufacturers.BattlePrep
    public readonly modelName = "HEx-001s"
    public readonly hardPointSize = HardPointSize.Small
    public readonly hardPointType = HardPointType.WithoutExtras
    public readonly heatPerSecond = -5
    public readonly maxHeatBonus = 0
}