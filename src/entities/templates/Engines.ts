import { Engine } from 'matter'
import { Manufacturers } from '~/utilities/Manufacturers'
import { HardPointSize, HardPointType } from '../Hardpoint'

export class SmallEngine extends Engine
{
    public readonly manufacturer = Manufacturers.BattlePrep
    public readonly modelName = "Satithrust-031"
    public readonly hardPointSize = HardPointSize.Small
    public readonly hardPointType = HardPointType.Engine
}