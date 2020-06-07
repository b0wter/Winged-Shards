import Phaser from 'phaser'
import Entity from './Entity'
import { Teams } from './Teams'

export default abstract class PhysicalEntity extends Phaser.Physics.Arcade.Sprite
{
    public readonly team: Teams

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

    get velocity() {
        return this.body.velocity
    }
    set velocity(value: Phaser.Math.Vector2) {
         this.setVelocity(value.x, value.y)
    }

    get velocityX() {
        return this.body.velocity.x
    }
    set velocityX(value) {
         this.setVelocityX(value)
    }

    get velocityY() {
        return this.body.velocity.y
    }
    set velocityY(value) {
         this.setVelocityY(value)
    }

    constructor(scene: Phaser.Scene, x: number, y, spriteKey, team, angle?: number, velocity?: number, colliderGroup?: Phaser.Physics.Arcade.Group)
    {
        super(scene, x, y, spriteKey)
        scene.add.existing(this)
        scene.physics.add.existing(this)
        colliderGroup?.add(this)
        this.team = team
        this.setAngle((angle ?? 0 ) - 90)
        const v = velocity ?? 0
        this.setVelocityX(v * Math.cos(this.angle * Phaser.Math.DEG_TO_RAD))
        this.setVelocityY(v * Math.sin(this.angle * Phaser.Math.DEG_TO_RAD))
    }
}