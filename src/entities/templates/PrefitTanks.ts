import { Equipment } from '../Equipment'
import { TriggeredEquipmentTemplate } from '../TriggeredEquipment'
import { TankTemplate } from '../Tank'
import * as Tanks from './Tanks'
import * as Weapons from './Weapons'
import * as ShieldGenerators from './ShieldGenerators'
import * as HeatExchangers from './HeatExchangers'
import { DummyAbility, DummyAbilityTemplate } from './Abilities'

export abstract class PrefitTank
{
    public abstract readonly tank: TankTemplate
    public abstract readonly equipment: Equipment[]
    public abstract readonly triggeredEquipment: TriggeredEquipmentTemplate[]
}

export class MediumTank extends PrefitTank
{
    tank = Tanks.MediumTank
    equipment = [
        new ShieldGenerators.SmallShieldGenerator(),
        new ShieldGenerators.SmallShieldGenerator()
    ]
    triggeredEquipment =[
        Weapons.TripleLaserTemplate,
    ]
}

export class TestingTank extends PrefitTank
{
    tank = Tanks.TestingTank
    equipment = [
        new ShieldGenerators.SmallShieldGenerator(),
        new ShieldGenerators.SmallShieldGenerator()
    ]
    triggeredEquipment = [
        Weapons.TestLaserTemplate,
        DummyAbilityTemplate
    ]
}

export class HoverScout extends PrefitTank
{
    tank = Tanks.HoverScout
    equipment = [
        new ShieldGenerators.SmallShieldGenerator(),
        new ShieldGenerators.SmallShieldGenerator()
    ]
    triggeredEquipment = [
        Weapons.LightMultiLaserTemplate
    ]
}

export class SupportHoverTank extends PrefitTank
{
    tank = Tanks.SupportHoverTank
    equipment = [
        new ShieldGenerators.SmallShieldGenerator(),
        new ShieldGenerators.SmallShieldGenerator(),
        new HeatExchangers.SmallHeatExchanger(),
        new HeatExchangers.SmallHeatExchanger()
    ]
    triggeredEquipment = [
        Weapons.LightLaserTemplate
    ]
}

export class LightHoverTank extends PrefitTank
{
    tank = Tanks.LightHoverTank
    equipment = [
        new ShieldGenerators.SmallShieldGenerator(),
        new HeatExchangers.SmallHeatExchanger(),
    ]
    triggeredEquipment = [
        Weapons.LightAutoCannonTemplate
    ]
}

export const AllPrefits = [ new TestingTank(), new MediumTank(), new HoverScout(), new SupportHoverTank(), new LightHoverTank() ]