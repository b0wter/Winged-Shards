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

export class MediumShieldGenerator extends ShieldGenerator
{
    public readonly hardPointSize = HardPointSize.Medium
    public readonly hardPointType = HardPointType.WithoutExtras
    public readonly manufacturer = Manufacturers.BattlePrep
    public readonly modelName = "SSG-01a Deluxe"
    public readonly maxShields = 150
    public readonly rechargeRate = 4
}

export class LargeShieldGenerator extends ShieldGenerator
{
    public readonly hardPointSize = HardPointSize.Large
    public readonly hardPointType = HardPointType.WithoutExtras
    public readonly manufacturer = Manufacturers.BattlePrep
    public readonly modelName = "SSG-01a Extreme"
    public readonly maxShields = 200
    public readonly rechargeRate = 6
}