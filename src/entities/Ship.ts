import ActiveEquipment from './ActiveEquipment';
import PassiveEquipment from './PassiveEquipment';
import { HardPoint, HardPointEquipment, HardPointType, HardPointSize } from './Hardpoint';
import { Equipment, EquipmentTypes } from './Equipment';
import { EquipmentCooldownChangedCallback, TriggeredEquipment } from './TriggeredEquipment';
import { MaxStatusChange, CurrentStatusChange } from './StatusChanges';
import { Manufacturers } from '~/utilities/Manufacturers';
import { SmallShieldGenerator } from './templates/ShieldGenerators';
import PhysicalEntity from './PhysicalEntity';

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

export type ShipEquipmentChangedListener = (s: Ship, hardpoint: HardPoint, previous: HardPointEquipment, next: HardPointEquipment) => void

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
        console.log("heat")
        return this.allEquipment.map(e => e.statusChangePerDeltaTime(1000).heat).reduce((a, b) => a + b, -this._heatDissipation)
    }

    /**
     * Maximum speed of this ship. Includes all equipment bonusses.
     */
    public get maxSpeed() { 
        return this.allEquipment.map(e => e.maxStatusChange.speed).reduce((a, b) => a + b, this._maxSpeed)
    }

    public get angularSpeed() {
        return this._angularSpeed
    }

    public get maxHeat() {
        return this.allEquipment.map(e => e.maxStatusChange.heat).reduce((a, b) => a + b, this._maxHeat)
    }

    protected get allEquipment() {
        return this.equipmentBy().map(([e, _]) => e)
    }

    private equipmentChangedListeners: ShipEquipmentChangedListener[] = []

    constructor(private readonly _hull: number,
                private readonly _structure: number,
                private readonly _maxSpeed: number,
                private readonly _angularSpeed: number,
                private readonly _turrentAngularSpeed: number,
                private readonly _maxHeat: number,
                private readonly _heatDissipation: number,
                private readonly _hardpoints: HardPoint[],
                public readonly spriteKey: string,
                public readonly turretSpriteKey: string,
                public readonly manufacturer: Manufacturers,
                public readonly modelName: string
               )
    {
        this._hardpoints.forEach(h => h.addChangeListener(this.equipmentChanged.bind(this)))
    }

    private equipmentChanged(hardpoint: HardPoint, previousEquipment: HardPointEquipment, newEquipment: HardPointEquipment)
    {
        console.log("NOT FULLY IMPLEMENTED --- equipment changed: ", hardpoint, previousEquipment, newEquipment)
        this.equipmentChangedListeners.forEach(l => l(this, hardpoint, previousEquipment, newEquipment))
    }

    public equipmentGroup(index: integer)
    {
        return this.equipmentBy(HardpointEquipmentQuery.forHardpoint(h => h.equipmentGroup === index))
    }

    public triggeredEquipmentGroup(index: integer) : [TriggeredEquipment, HardPoint][]
    {
        const equipment = this.equipmentBy(new HardpointEquipmentQuery(e => e.class === TriggeredEquipment.class, h => h.equipmentGroup === index))
        return equipment.map(([e, h]) : [TriggeredEquipment, HardPoint] => [e as TriggeredEquipment, h])
    }

    public equipmentBy(q: HardpointEquipmentQuery = HardpointEquipmentQuery.always) : [Equipment, HardPoint][]
    {
        const equipment : [Equipment, HardPoint][] = []
        this.hardpoints.forEach(h => {
            switch(h.equipment.kind)
            {
                case "none": break;
                case "equipment": 
                    if(q.hardPointPredicate(h) && q.equipmentPredicate(h.equipment.equipment))
                        equipment.push([h.equipment.equipment, h])
                    break;
            }
        })
        return equipment
    }

    public update(t: number, dt: number, triggeredEquipmentGroups: number[], isMoving: boolean) : CurrentStatusChange
    {
        const fromShip = CurrentStatusChange.forHeat(dt, -this._heatDissipation)
        const updates = this.allEquipment.map(e => e.update(t, dt, isMoving))
        updates.push(fromShip)
        return CurrentStatusChange.combineAll(updates)
    }

    public trigger(index: number, angle: () => number, time: number, owner: PhysicalEntity, h: HardPoint)
    {
        this.equipmentGroup(index).forEach(([e, h]) => {
            const t = e as TriggeredEquipment
            if(t.trigger !== undefined)
                t.trigger(angle, time, owner, h)
        })
    }

    public addEquipmentChangedListener(l: ShipEquipmentChangedListener)
    {
        this.equipmentChangedListeners.push(l)
    }

    public removeEquipmentChangedListener(l: ShipEquipmentChangedListener)
    {
        this.equipmentChangedListeners.forEach( (item, index) => {
            if(item === l) this.equipmentChangedListeners.splice(index,1);
        });
    }
}