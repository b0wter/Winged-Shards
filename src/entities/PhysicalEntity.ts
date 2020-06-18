import Phaser from 'phaser'
import { Teams } from './Teams'
import * as Damage from './DamageType'
import ClampedValue from '~/utilities/ClampedValue'
import ClampedNumber from '~/utilities/ClampedNumber'
import { Guid } from "guid-typescript";

type PhysicalEntityCallbacks = (_: PhysicalEntity) => void

export default abstract class PhysicalEntity extends Phaser.GameObjects.Container
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

    get shields() {
        return this._shields.current
    }
    set shields(value: number) {
        this._shields.current = value
    }
    public get hasShieldsLeft() : boolean { return this.shields > 0 }
    public get shieldValue() { return this._shields }

    get hull() {
        return this._hull.current
    }
    set hull(value: number){
        this._hull.current = value
    }
    public get hasHullLeft() : boolean { return this._hull.isNotMinimum() }
    public get hullValue() { return this._hull }
    
    get structure() {
        return this._structure.current
    } 
    set structure(value: number) {
        this._structure.current = value
    }
    public get hasStructureLeft() : boolean { return this.structure > 0 }
    public get structureValue() { return this._structure }

    get heat() {
        return this._heat.current
    }
    set heat(value: number) {
        this._heat.current = value
    }
    public get heatValue() { return this._heat }
    public get remainingHeatBudget() { return this.heatValue.remaining }

    public readonly mainSprite: Phaser.Physics.Arcade.Sprite
    public readonly shieldSprite: Phaser.Physics.Arcade.Sprite

    private readonly killedCallbacks: PhysicalEntityCallbacks[] = []

    /**
     * Deactives any updates (both from the game logic as well as player input).
     */
    protected inactive = false

    constructor(scene: Phaser.Scene, 
                x: number, y: number, 
                spriteKey, 
                team, 
                private _shields: ClampedNumber,
                private _hull: ClampedNumber,
                private _structure: ClampedNumber,
                private _heat: ClampedNumber,
                private _shieldRegenerationPerSecond: number,
                private _heatDissipationPerSecond: number,
                angle?: number, 
                velocity?: number, 
                colliderGroup?: Phaser.Physics.Arcade.Group)
    {
        super(scene, x, y, undefined)
        this.setSize(64, 64)
        scene.physics.world.enable(this)
        this.team = team

        this.mainSprite = new Phaser.Physics.Arcade.Sprite(scene, 0, 0, spriteKey)
        this.add(this.mainSprite)

        this.shieldSprite = new Phaser.Physics.Arcade.Sprite(scene, 0, 0, 'shield_circular')
        this._shields.addChangeListener((v) => this.shieldSprite.alpha = v.percentage)
        this.add(this.shieldSprite)

        colliderGroup?.add(this)
        scene.add.existing(this)

        this.setAngleAndVelocity(angle, velocity)

        this.name = Guid.create().toString()
    }

    private setAngleAndVelocity(angle, velocity)
    {
        this.setAngle(angle ?? 0 )
        const v = velocity ?? 0
        const vX = v * Math.cos(this.angle * Phaser.Math.DEG_TO_RAD)
        const vY = v * Math.sin(this.angle * Phaser.Math.DEG_TO_RAD)
        const body = this.body as Phaser.Physics.Arcade.Body
        body.setVelocity(vX, vY)
        body.setImmovable(true)
        console.log(body)
    }

    protected internalUpdate(d: number, dt: number)
    {
        const heatReduction = dt * this._heatDissipationPerSecond / 1000
        this.heatValue.substract(heatReduction)

        const shieldRecharge = dt * this._shieldRegenerationPerSecond / 1000
        this.shieldValue.add(shieldRecharge)
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
        }

        if(this.structure <= 0)
            this.kill()
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
        if(this.killEffect)
            this.killEffect()
        this.destroy()
        this.inactive = true
        this.killedCallbacks.forEach(x => x(this))
    }

    protected killEffect() { }

    public setVelocityAndAngle(v, angle)
    {
        const vX = v * Math.cos(this.angle * Phaser.Math.DEG_TO_RAD)
        const vY = v * Math.sin(this.angle * Phaser.Math.DEG_TO_RAD)
        this.setVelocity(vX, vY)
    }

    public setVelocity(x, y)
    {
        const body = this.body as Phaser.Physics.Arcade.Body
        body?.setVelocity(x, y)
    }

    public addKilledCallback(c: PhysicalEntityCallbacks)
    {
        this.killedCallbacks.push(c)
    }

    public removeKilledCallback(c: PhysicalEntityCallbacks)
    {
        this.killedCallbacks.forEach( (item, index) => {
            if(item === c) this.killedCallbacks.splice(index,1);
          });        
    }
}