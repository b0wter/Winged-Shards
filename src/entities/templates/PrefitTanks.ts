import { Equipment } from '../Equipment'
import { TriggeredEquipmentTemplate } from '../TriggeredEquipment'
import { TankTemplate } from '../Tank'
import * as Tanks from './Tanks'
import * as Weapons from './Weapons'
import * as ShieldGenerators from './ShieldGenerators'
import * as HeatExchangers from './HeatExchangers'

export abstract class PrefitTank
{
    public abstract readonly tank: TankTemplate
    public abstract readonly equipment: (TriggeredEquipmentTemplate | Equipment)[]
}

export class MediumTank extends PrefitTank
{
    tank = Tanks.MediumTank
    equipment = [
        Weapons.TripleLaser,
        new ShieldGenerators.SmallShieldGenerator(),
        new ShieldGenerators.SmallShieldGenerator()
    ]
}

export class TestingTank extends MediumTank
{
    tank = Tanks.TestingTank
}

export class HoverScout extends PrefitTank
{
    tank = Tanks.HoverScout
    equipment = [
        Weapons.LightMultiLaser,
        new ShieldGenerators.SmallShieldGenerator(),
        new ShieldGenerators.SmallShieldGenerator()
    ]
}

export class SupportHoverTank extends PrefitTank
{
    tank = Tanks.SupportHoverTank
    equipment = [
        Weapons.LightLaser,
        new ShieldGenerators.SmallShieldGenerator(),
        new ShieldGenerators.SmallShieldGenerator(),
        new HeatExchangers.SmallHeatExchanger(),
        new HeatExchangers.SmallHeatExchanger()
    ]
}

export class LightHoverTank extends PrefitTank
{
    tank = Tanks.LightHoverTank
    equipment = [
        Weapons.SpreadLaser,
        new ShieldGenerators.SmallShieldGenerator(),
        new HeatExchangers.SmallHeatExchanger(),
    ]
}

export const AllPrefits = [ new TestingTank(), new MediumTank(), new HoverScout(), new SupportHoverTank(), new LightHoverTank() ]