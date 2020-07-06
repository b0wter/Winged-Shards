import ShieldGenerator from '../ShieldGenerator';
import { HardPointSize, HardPointType } from '../Hardpoint';
import { Manufacturers } from '~/utilities/Manufacturers';

export class SmallShieldGenerator extends ShieldGenerator
{
    public readonly hardPointSize = HardPointSize.Small
    public readonly hardPointType = HardPointType.WithoutExtras
    public readonly manufacturer = Manufacturers.BattlePrep
    public readonly modelName = "SSG-01a"
    public readonly maxShields = 100
    public readonly rechargeRate = 2
}