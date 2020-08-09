import ShieldGenerator from '../ShieldGenerator';
import { HardPointSize, HardPointType } from '../Hardpoint';
import { Manufacturers } from '~/utilities/Manufacturers';

export class SmallShieldGenerator extends ShieldGenerator
{
    hardPointSize = HardPointSize.Small
    hardPointType = HardPointType.WithoutExtras
    manufacturer = Manufacturers.BattlePrep
    modelName = "SSG-01a"
    maxShields = 100
    rechargeRate = 2
    price = 20
}

export class MediumShieldGenerator extends ShieldGenerator
{
    hardPointSize = HardPointSize.Medium
    hardPointType = HardPointType.WithoutExtras
    manufacturer = Manufacturers.BattlePrep
    modelName = "SSG-01a Deluxe"
    maxShields = 150
    rechargeRate = 4
    price = 60
}

export class LargeShieldGenerator extends ShieldGenerator
{
    hardPointSize = HardPointSize.Large
    hardPointType = HardPointType.WithoutExtras
    manufacturer = Manufacturers.BattlePrep
    modelName = "SSG-01a Extreme"
    maxShields = 200
    rechargeRate = 6
    price = 120
}