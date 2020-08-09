import { CombinedStatusChange, MaxStatusChange, CurrentStatusChange } from './StatusChanges'
import { Manufacturers } from '~/utilities/Manufacturers'
import { HardPointSize, HardPointType } from './Hardpoint'

export type EquipmentDestroyedCallback = (e: Equipment, isDestroyed: boolean) => void

export enum EquipmentTypes {
    Engine,
    HeatExchanger,
    Weapon,
    Shield,
    Ability
}

export abstract class EquipmentHiddenProperties
{
    /**
     * Marks this equipment as unusable for the rest of the mission.
     */
    private _isDestroyed = false

    public get isDestroyed() { return this._isDestroyed }

    private setDestroyed(value: boolean)
    {
        this._isDestroyed = value
        this.triggerDestroyedCallbacks(value)
    }

    public destroy()
    {
        this.setDestroyed(true)
    }

    protected abstract triggerDestroyedCallbacks(value: boolean)
}

export abstract class Equipment extends EquipmentHiddenProperties
{
    public abstract get maxStatusChange() : MaxStatusChange
    public abstract statusChangePerDeltaTime(dt: number): CurrentStatusChange

    public abstract readonly manufacturer: Manufacturers
    public abstract readonly modelName: string
    public abstract readonly hardPointSize : HardPointSize
    public abstract readonly hardPointType : HardPointType
    public abstract readonly type: EquipmentTypes
    public abstract readonly class: string
    public abstract readonly price: number

    private equipmentDestroyedCallbacks: EquipmentDestroyedCallback[] = []

    constructor()
    {
        super()
    }

    public abstract update(t: number, dt: number, isMoving: boolean) : CurrentStatusChange

    protected triggerDestroyedCallbacks(value: boolean)
    {
        this.equipmentDestroyedCallbacks.forEach(c => c(this, value))
    }

    public addEquipmentDestroyedCallback(c: EquipmentDestroyedCallback)
    {
        this.equipmentDestroyedCallbacks.push(c)
    }

    public removeEquipmentDestroyedCallback(c: EquipmentDestroyedCallback)
    {
        this.equipmentDestroyedCallbacks.forEach( (item, index) => {
            if(item === c) this.equipmentDestroyedCallbacks.splice(index,1);
        });
    }
}