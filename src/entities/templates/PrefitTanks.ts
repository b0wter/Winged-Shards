import { Equipment } from '../Equipment'
import { TriggeredEquipmentTemplate } from '../TriggeredEquipment'
import { TankTemplate } from '../Tank'
import * as Tanks from './Tanks'
import * as Weapons from './Weapons'
import * as ShieldGenerators from './ShieldGenerators'
import * as HeatExchangers from './HeatExchangers'
import { DummyAbilityTemplate } from './Abilities'

export abstract class PrefitTank
{
    public abstract readonly tank: TankTemplate
    public abstract readonly equipment: Equipment[]
    public abstract readonly triggeredEquipment: [TriggeredEquipmentTemplate, number][]
}

export class MediumTank extends PrefitTank
{
    tank = Tanks.MediumTank
    equipment = [
    ]
    triggeredEquipment : [TriggeredEquipmentTemplate, number][] = [
        [Weapons.HeavyAutoCannonTemplate, 0],
        [Weapons.LightAutoCannonTemplate, 1],
        [Weapons.LightAutoCannonTemplate, 1]
    ]
}

export class TestingTank extends PrefitTank
{
    tank = Tanks.TestingTank
    equipment = [
        new ShieldGenerators.SmallShieldGenerator(),
        new ShieldGenerators.SmallShieldGenerator()
    ]
    triggeredEquipment : [TriggeredEquipmentTemplate, number][] = [
        [Weapons.TestLaserTemplate, 0],
        [DummyAbilityTemplate, 1]
    ]
}

export class HoverScout extends PrefitTank
{
    tank = Tanks.HoverScout
    equipment = [
        new ShieldGenerators.SmallShieldGenerator(),
        new ShieldGenerators.SmallShieldGenerator()
    ]
    triggeredEquipment : [TriggeredEquipmentTemplate, number][] = [
        [Weapons.LightMultiLaserTemplate, 0]
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
    triggeredEquipment : [TriggeredEquipmentTemplate, number][] = [
        [Weapons.SmallSpreadDummyMissleLauncherTemplate, 0]
    ]
}

export class LightHoverTank extends PrefitTank
{
    tank = Tanks.LightHoverTank
    equipment = [
        new ShieldGenerators.SmallShieldGenerator(),
        new HeatExchangers.SmallHeatExchanger(),
    ]
    triggeredEquipment : [TriggeredEquipmentTemplate, number][] = [
        [Weapons.SpreadLaserTemplate, 0]
    ]
}

export const AllPrefits = [ new TestingTank(), new MediumTank(), new HoverScout(), new SupportHoverTank(), new LightHoverTank() ]