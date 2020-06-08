import Phaser from 'phaser'
import Entity from './Entity'
import { Teams } from './Teams'
import * as Damage from './DamageType'

export default abstract class PhysicalEntity extends Phaser.Physics.Arcade.Sprite
{
    public readonly team: Teams

    private _isInvulnerable = false
    get isInvulnerable() {
        return this._isInvulnerable
    }
    set isInvulnerable(value: boolean) {
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
        this._shields = Math.max(0, value)
    }
    public get hasShieldsLeft() : boolean { return this.shields > 0 }

    protected _hull = 0.0
    get hull() {
        return this._hull
    }
    set hull(value: number){
        this._hull = Math.max(0, value)
    }
    public get hasHullLeft() : boolean { return this.hull > 0 }
    
    protected _structure = 0.0
    get structure() {
        return this._structure
    } 
    set structure(value: number) {
        this._structure = Math.max(0, value)
    }
    public get hasStructureLeft() : boolean { return this.structure > 0 }

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
        this.setAngle(angle ?? 0 )
        const v = velocity ?? 0
        this.setVelocityX(v * Math.cos(this.angle * Phaser.Math.DEG_TO_RAD))
        this.setVelocityY(v * Math.sin(this.angle * Phaser.Math.DEG_TO_RAD))
    }

    public takeDamage(damage: Damage.Damage)
    {
        let remainder = damage
        if(this.hasShieldsLeft)
        {
            const [remainingShield, remainingDamage] = this.takeSpecificDamage(damage, Damage.EnergyToShield, Damage.PhysicalToShield, Damage.ExplosionToShield, Damage.HeatToShield, this.shields)
            remainder = remainingDamage
            this.shields = remainingShield
        }

        if(this.hasHullLeft && remainder.isNonZero)
        {
            const [remainingHull, remainingDamage] = this.takeSpecificDamage(damage, Damage.EnergyToHull, Damage.PhysicalToHull, Damage.ExplosionToHull, Damage.HeatToHull, this.hull)
            remainder = remainingDamage
            this.hull = remainingHull
        }

        if(this.hasStructureLeft && remainder.isNonZero)
        {
            const [remainingStructure, remainingDamage] = this.takeSpecificDamage(damage, Damage.EnergyToStructure, Damage.PhysicalToStructure, Damage.ExplosionToStructure, Damage.HeatToStructure, this.structure)
            remainder = remainingDamage
            this.structure = remainingStructure
            if(this.structure <= 0)
                this.kill()
        }
    }

    protected takeSpecificDamage(damage: Damage.Damage, energyModifiation: number, projectileModification: number, explosionModification: number, heatModification: number, hitpoints: number) : [number, Damage.Damage]
    {
        if(hitpoints > 0)
        {
            //TODO: Check order! Should it be the same for every hitpoint type?
            var [hE, remainingEnergyDamage]     = this.applyDamageTo(damage.energy, energyModifiation, hitpoints)
            var [hH, remainingHeatDamage]       = this.applyDamageTo(damage.heat, heatModification, hE)
            var [hEx, remainingExplosionDamage] = this.applyDamageTo(damage.explosion, explosionModification, hH)
            var [hP, remainingProjectileDamage] = this.applyDamageTo(damage.physical, projectileModification, hEx)
            return [Math.max(0, hP), new Damage.Damage(remainingProjectileDamage, remainingEnergyDamage, remainingExplosionDamage, remainingHeatDamage)]
        }
        else
        {
            return [0, damage]
        }
    }

    protected applyDamageTo(damageValue: number, damageMultiplier: number, hitpoints: number) 
    {
        if(hitpoints <= 0) return [0, damageValue]
        const remainingHitpoints = hitpoints - damageValue * damageMultiplier
        let remainingDamage = 0
        if(remainingHitpoints < 0)
            remainingDamage = (hitpoints / (damageMultiplier * damageValue)) * damageValue
        return [Math.max(0, remainingHitpoints), remainingDamage]
    }

    public kill()
    {
        console.log('An entity has been destroyed.', this)
        this.destroy()
    }
}