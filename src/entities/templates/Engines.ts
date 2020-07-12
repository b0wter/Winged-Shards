import { Engine } from 'matter'
import { Manufacturers } from '~/utilities/Manufacturers'
import { HardPointSize, HardPointType } from '../Hardpoint'

export class SmallEngine extends Engine
{
    manufacturer = Manufacturers.BattlePrep
    modelName = "Satithrust-031"
    hardPointSize = HardPointSize.Small
    hardPointType = HardPointType.Engine
}