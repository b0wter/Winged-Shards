import { CombinedStatusChange, MaxStatusChange, CurrentStatusChange } from './StatusChanges'
import { Manufacturers } from '~/utilities/Manufacturers'
import { HardPointSize, HardPointType } from './Hardpoint'
import { EquipmentCooldownChangedCallback } from './TriggeredEquipment'

export enum EquipmentTypes {
    Engine,
    HeatExchanger,
    Weapon,
    Shield
}

export abstract class Equipment
{
    /**
     * Marks this equipment as unusable for the rest of the mission.
     */
    private _isDestroyed = false

    public get isDestroyed() { return this._isDestroyed }

    public abstract get maxStatusChange() : MaxStatusChange
    public abstract statusChangePerDeltaTime(dt: number): CurrentStatusChange

    public abstract readonly manufacturer: Manufacturers
    public abstract readonly modelName: string
    public abstract readonly hardPointSize : HardPointSize
    public abstract readonly hardPointType : HardPointType
    public abstract readonly type: EquipmentTypes
    public abstract readonly class: string

    constructor()
    {
        //
    }

    public abstract update(t: number, dt: number, isMoving: boolean) : CurrentStatusChange
}