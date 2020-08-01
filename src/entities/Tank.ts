import { HardPoint, HardPointEquipment } from './Hardpoint';
import { Equipment, EquipmentTypes } from './Equipment';
import { TriggeredEquipment } from './TriggeredEquipment';
import { CurrentStatusChange } from './StatusChanges';
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

export type TankEquipmentChangedListener = (s: Tank, hardpoint: HardPoint, previous: HardPointEquipment, next: HardPointEquipment) => void

export class Tank
{
    public get hardpoints() { return this._hardpoints }

    /**
     * The maximum shield strength of this tank inclusing all equipment bonusses.
     */
    public get shield() { 
        return this.allEquipment.map(e => e.maxStatusChange.shield).reduce((a, b) => a + b, 0)
    }

    /**
     * The maximum hull strength of this tank inclusing all equipment bonusses.
     */
    public get hull() { 
        return this.allEquipment.map(e => e.maxStatusChange.hull).reduce((a, b) => a + b, this._hull)
    }

    /**
     * The maximum structure strength of this tank inclusing all equipment bonusses.
     */
    public get structure() { 
        return this.allEquipment.map(e => e.maxStatusChange.structure).reduce((a, b) => a + b, this._structure)
    }

    /**
     * The maximum amount of heat the tank can take. Includes all equipment bonusses.
     */
    public get heatDissipation() { 
        console.log("heat")
        return this.allEquipment.map(e => e.statusChangePerDeltaTime(1000).heat).reduce((a, b) => a + b, -this._heatDissipation)
    }

    /**
     * Maximum speed of this tank. Includes all equipment bonusses.
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

    public get turretOffset() { return this._turretOffset }

    private equipmentChangedListeners: TankEquipmentChangedListener[] = []

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
                private readonly _turretOffset: Phaser.Geom.Point,
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
        const fromTank = CurrentStatusChange.forHeat(dt, -this._heatDissipation)
        const updates = this.allEquipment.map(e => e.update(t, dt, isMoving))
        updates.push(fromTank)
        return CurrentStatusChange.combineAll(updates)
    }

    public addEquipmentChangedListener(l: TankEquipmentChangedListener)
    {
        this.equipmentChangedListeners.push(l)
    }

    public removeEquipmentChangedListener(l: TankEquipmentChangedListener)
    {
        this.equipmentChangedListeners.forEach( (item, index) => {
            if(item === l) this.equipmentChangedListeners.splice(index,1);
        });
    }
}

export abstract class TankTemplate
{
    public abstract modelName: string
    public abstract manufacturer: Manufacturers
    public abstract spriteKey: string
    public abstract turretSpriteKey: string
    public abstract hull: number
    public abstract structure: number
    public abstract maxHeat: number
    public abstract heatDissipation: number
    public abstract maxSpeed: number
    public abstract angularSpeed: number
    public abstract turretAngularSpeed: number
    public abstract hardpoints: HardPoint[] 
    public abstract turretOffset: Phaser.Geom.Point
    public abstract description: string

    public instantiate()
    {
        return new Tank(this.hull, this.structure, this.maxSpeed, this.angularSpeed, this.turretAngularSpeed, this.maxHeat, this.heatDissipation, this.hardpoints, this.spriteKey, this.turretSpriteKey, this.turretOffset, this.manufacturer, this.modelName)
    }
}