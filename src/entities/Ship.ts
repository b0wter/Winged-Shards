import ActiveEquipment from './ActiveEquipment';
import PassiveEquipment from './PassiveEquipment';
import { HardPoint, HardPointEquipment } from './Hardpoint';
import { Equipment, EquipmentTypes } from './Equipment';
import { EquipmentCooldownChangedCallback, TriggeredEquipment } from './TriggeredEquipment';
import { MaxStatusChange } from './StatusChanges';
import { HeatExchanger } from './HeatExchanger';
import { Manufacturers } from '~/utilities/Manufacturers';

export class HardpointEquipmentQuery {
    private static alwaysEquipmentPredicate: (Equipment) => boolean = (_) => true
    private static alwaysHardpointPredicate: (HardPoint) => boolean = (_) => true

    constructor(public readonly equipmentPredicate: (Equipment) => boolean,
                public readonly hardPointPredicate: (HardPoint) => boolean)
    {
        //
    }

    public static forEquipment(q: (e: Equipment) => boolean)
    {
        return new HardpointEquipmentQuery(q, this.alwaysHardpointPredicate)
    }

    public static forHardpoint(q: (h: HardPoint) => boolean)
    {
        return new HardpointEquipmentQuery(this.alwaysEquipmentPredicate, q)
    }

    public static readonly always = new HardpointEquipmentQuery(HardpointEquipmentQuery.alwaysEquipmentPredicate, HardpointEquipmentQuery.alwaysHardpointPredicate)
}

export class Ship
{
    public get hardpoints() { return this._hardpoints }

    /**
     * The maximum shield strength of this ship inclusing all equipment bonusses.
     */
    public get shield() { 
        return this.allEquipment.map(e => e.maxStatusChange.shield).reduce((a, b) => a + b, 0)
    }

    /**
     * The maximum hull strength of this ship inclusing all equipment bonusses.
     */
    public get hull() { 
        return this.allEquipment.map(e => e.maxStatusChange.hull).reduce((a, b) => a + b, this._hull)
    }

    /**
     * The maximum structure strength of this ship inclusing all equipment bonusses.
     */
    public get structure() { 
        return this.allEquipment.map(e => e.maxStatusChange.structure).reduce((a, b) => a + b, this._structure)
    }

    /**
     * The maximum amount of heat the ship can take. Includes all equipment bonusses.
     */
    public get heatDissipation() { 
        return this.allEquipment.map(e => e.statusChangePerSecond.heat).reduce((a, b) => a + b, this._heatDissipation)
    }

    /**
     * Maximum speed of this ship. Includes all equipment bonusses.
     */
    public get maxSpeed() { 
        return this.allEquipment.map(e => e.maxStatusChange.speed).reduce((a, b) => a + b, this._maxSpeed)
    }

    public get maxHeat() {
        return this.allEquipment.map(e => e.maxStatusChange.heat).reduce((a, b) => a + b, this._maxHeat)
    }

    protected get allEquipment() {
        return this.equipmentBy()
    }

    constructor(private readonly _hull: number,
                private readonly _structure: number,
                private readonly _maxSpeed: number,
                private readonly _maxHeat: number,
                private readonly _heatDissipation: number,
                private readonly _hardpoints: HardPoint[],
                public readonly spriteKey: string,
                public readonly manufacturer: Manufacturers,
                public readonly modelName: string
               )
    {
        this._hardpoints.forEach(h => h.addChangeListener(this.equipmentChanged.bind(this)))
    }

    private equipmentChanged(hardpoint: HardPoint, previousEquipment: HardPointEquipment, newEquipment: HardPointEquipment)
    {
        console.log("NOT IMPLEMENTED --- equipment changed: ", hardpoint, previousEquipment, newEquipment)
    }

    public equipmentGroup(index: integer)
    {
        return this.equipmentBy(HardpointEquipmentQuery.forHardpoint(h => h.equipmentGroup === index))
    }

    public equipmentBy(q: HardpointEquipmentQuery = HardpointEquipmentQuery.always) : Equipment[]
    {
        const equipment : Equipment[] = []
        this.hardpoints.forEach(h => {
            switch(h.equipment.kind)
            {
                case "none": break;
                case "equipment": 
                    if(q.hardPointPredicate(h) && q.equipmentPredicate(h.equipment.equipment))
                        equipment.push(h.equipment.equipment)
                    break;
            }
        })
        return equipment
    }

    public update(t: number, dt: number, triggeredEquipmentGroups: number[], isMoving: boolean)
    {
        this.allEquipment.map(e => e.update(t, dt, isMoving))
    }

    public trigger(index: number, x, y, angle, t, ownerId)
    {
        this.equipmentGroup(index).forEach(e => {
            const t = e as TriggeredEquipment
            if(t.trigger !== undefined)
                t.trigger(x, y, angle, t, ownerId)
        })
    }
}

export class ShipTemplate
{
    public modelName = "<Model Name>"
    public manufacturer = Manufacturers.Dummy
    public spriteKey = ""
    public hull = 1
    public structure = 1
    public maxHeat = 1
    public heatDissipation = 0
    public maxSpeed = 0
    public hardPoints: HardPoint[] = []

    public instantiate()
    {
        return new Ship(this.hull, this.structure, this.maxSpeed, this.maxHeat, this.heatDissipation, this.hardPoints, this.spriteKey, this.manufacturer, this.modelName)
    }
}

export const DefaultFighter : ShipTemplate =
    Object.assign(new ShipTemplate(),
    {
        manufacturer: "Roscosmos",
        modelName: "Rapier V-37",
        spriteKey: "spaceship_01",
        hull: 100,
        structure: 50,
        heatDissipation: 5,
        maxHeat: 100,
        maxSpeed: 200,
        hardpoints: []
    })