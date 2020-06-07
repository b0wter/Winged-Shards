import Phaser from 'phaser'
import Entity from './Entity'

export default abstract class PhysicalEntity extends Entity
{
    private _isInvulnerable = false
    get isInvulnerable() {
        return this._isInvulnerable
    }
    set isInvulerable(value: boolean) {
        this._isInvulnerable = value
    }
    
    private _isMassive = false
    get isMassive() {
        return this._isMassive
    }
    set isMassive(value: boolean) {
        this._isMassive = value
    }

    private _shields = 0.0
    get shields() {
        return this._shields
    }
    set shields(value: number) {
        this._shields = value
    }

    protected _hull = 0.0
    get hull() {
        return this._hull
    }
    set hull(value: number){
        this._hull = value
    }
    
    protected _structure = 0.0
    get structure() {
        return this._structure
    } 
    set structure(value: number) {
        this._structure = value
    }

    protected _energy = 0.0
    get energy() {
        return this._energy
    }
    set energy(value: number) {
        this._energy = value
    }

    constructor(scene, typeName, team, body)
    {
        super(scene, typeName, team)
        this.body = body
    }
}