import { Equipment } from './Equipment'

export enum HardPointSize
{
    Small,
    Medium,
    Large,
}

export enum HardPointType
{
    /**
     * Hardpoint has room for an ammo catridge that can feed this equipment independently.
     */
    WithAmmoBox,
    /**
     * This hardpoint does not have any capacity of supplying ammo to its equipment.
     */
    WithoutExtras,
    /**
     * Connection to an internal magazine that contains ammunition.
     */
    WithAmmoFeeder,
    /**
     * Can house an additional engine.
     */
    Engine
}

/**
 * Returns all hardpoints that can be used to house equipment with the given hardpoint requirement.
 */
export function hardPointTypeOrBetter(t: HardPointType)
{
    switch(t)
    {
        case(HardPointType.WithAmmoBox):
            return [ HardPointType.WithAmmoBox ]
        case(HardPointType.WithAmmoFeeder):
            return [ HardPointType.WithAmmoFeeder ]
        case(HardPointType.WithoutExtras):
            return [ HardPointType.WithAmmoBox, HardPointType.WithAmmoFeeder, HardPointType.WithoutExtras ]
        case(HardPointType.Engine):
            return [ HardPointType.Engine ]

        default:
            throw "The HardPointType is unknown."
    }
}

export interface NoEquipment { kind: "none" }
export interface WithEquipment { kind: "equipment", equipment: Equipment }

export const EmptyHardPoint : NoEquipment = { kind: "none" }

export type HardPointEquipment = NoEquipment | WithEquipment

export type HardPointEquipmentChangeListener = (_: HardPoint, previousEquipment: HardPointEquipment, newEquipment: HardPointEquipment) => void

export class HardPoint
{
    private static readonly UnsetEquipmentGroup = -1

    public get equipment() { return this._equipment }
    public set equipment(e) {
        const previous = this._equipment
        this._equipment = e 
        this._changeListeners.forEach(l => l(this, previous, this.equipment))
    }
    private _equipment : HardPointEquipment = EmptyHardPoint

    private _changeListeners: HardPointEquipmentChangeListener[] = []

    constructor(public readonly size: HardPointSize, 
                public readonly type: HardPointType,
                public readonly offsetX: number,
                public readonly offsetY: number,
                equipment?: Equipment,
                public equipmentGroup: number = HardPoint.UnsetEquipmentGroup
                )
    {
        if(equipment !== undefined)
            this._equipment = { kind: "equipment", equipment: equipment }
    }

    public addChangeListener(c: HardPointEquipmentChangeListener)
    {
        this._changeListeners.push(c)
    }

    public removeChangeListener(c: HardPointEquipmentChangeListener)
    {
        this._changeListeners.forEach( (item, index) => {
            if(item === c) this._changeListeners.splice(index,1);
          })        
    }
}
