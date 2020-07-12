import Phaser from 'phaser'
import PhysicalEntity from './PhysicalEntity'
import NameOf from 'ts-nameof'
import { Teams } from  './Teams'
import * as Weapon from './Weapon'
import PlayerInput from './../input/PlayerInput'
import { TriggeredEquipment, EquipmentAngleCallback } from './TriggeredEquipment'
import { Damage } from './DamageType'
import ClampedNumber from '~/utilities/ClampedNumber'
import { AddEntityFunc } from '~/scenes/ColliderCollection'
import StatusBar from '~/interface/StatusBar'
import { CurrentStatusChange } from './StatusChanges'
import { Ship } from './Ship'
import { HardPoint, HardPointPosition } from './Hardpoint'
import GameplayScene from '~/scenes/GameplayScene'

export class PlayerEntity extends PhysicalEntity
{
    public get indexedEquipment() : [number, TriggeredEquipment[]][] { return [0, 1, 2, 3, 4, 5].map(i => [i, this.ship.triggeredEquipmentGroup(i).map(([e, _]) => e)]) }

    public get ship() { return this._ship }

    private _turretSprite: Phaser.GameObjects.Image

    constructor(scene: GameplayScene, x: number, y: number, angle: number, private _ship: Ship, colliderGroupFunc: AddEntityFunc)
    {
        super(scene, x, y, _ship.spriteKey, Teams.Players, new ClampedNumber(_ship.shield), new ClampedNumber(_ship.hull), new ClampedNumber(_ship.structure), new ClampedNumber(100, 0, 0), 0, 0, colliderGroupFunc, angle, undefined)
        _ship.addEquipmentChangedListener((s, __, ___, ____) => { this.shieldValue.max = s.shield; this.hullValue.max = s.hull; this.structureValue.max = s.structure; this.heatValue.max = s.maxHeat; })
        this._turretSprite = scene.add.image(5, 0, _ship.turretSpriteKey) 
        this.add(this._turretSprite)
    }

    private triggerEquipmentGroup(group: [TriggeredEquipment, HardPoint][], t: number)
    {
        const turretAngleCallback = () => this.angle + this._turretSprite.angle
        const hullAngleCallback = () => this.angle
        group.forEach(([e, h]) => { 
            const isHullMounted = h.position === HardPointPosition.Hull
            if(e.heatPerTrigger <= this.remainingHeatBudget)
            {
                const positionCallback = (angleCallback: EquipmentAngleCallback) => { 
                    const offsetPoint = isHullMounted ? new Phaser.Geom.Point(h.offsetX, h.offsetY) : new Phaser.Geom.Point(h.offsetX + this._turretSprite.x, h.offsetY + this._turretSprite.y)
                    const offset = Phaser.Math.Rotate(offsetPoint, angleCallback() * Phaser.Math.DEG_TO_RAD)
                    return new Phaser.Geom.Point(this.x + offset.x, this.y + offset.y)
                }
                const angle = isHullMounted ? hullAngleCallback : turretAngleCallback
                const heatGenerated = e.trigger(positionCallback, angle, t, this.name)
                this.heatValue.add(heatGenerated)
            }
        })
    }

    public update(t: number, dt: number, input: PlayerInput)
    {
        if(this.inactive) return
        super.internalUpdate(t, dt)
        this.updateEquipment(t, dt, this.x, this.y, this.angle)
        this.handleInput(input, t, dt)
    }

    private updateEquipment(t, dt, x, y, angle)
    {
        const update = this._ship.update(t, dt, [], false)
        this.shields += update.shield
        this.hull += update.hull
        this.structure += update.structure
        this.heat += update.heat
        //TODO: speed bonus is not included!
    }

    private handleInput(input: PlayerInput, t: number, dt: number)
    {
        if(input === undefined)
            return;
        this.handleTriggers(input, t)
        this.handleControls(input, dt)
    }

    private handleTriggers(input: PlayerInput, t)
    {
        let group: [TriggeredEquipment, HardPoint][] = []
        if(input.bumperLeft.isDown)
            group = this.ship.triggeredEquipmentGroup(0) //this.primaryEquipmentGroup
        else if(input.bumperRight.isDown)
            group = this.ship.triggeredEquipmentGroup(1) //this.secondaryEquipmentGroup
        else if(input.action1.isDown)
            group = this.ship.triggeredEquipmentGroup(2) //this.tertiaryEquipmentGroup
        else if(input.action2.isDown)
            group = this.ship.triggeredEquipmentGroup(3) //this.quaternaryEquipmentGroup
        else if(input.action3.isDown)
            group = this.ship.triggeredEquipmentGroup(4) //this.quinaryEquipmentGroup
        else if(input.action4.isDown)
            group = this.ship.triggeredEquipmentGroup(5) //this.senaryEquipmentGroup

        this.triggerEquipmentGroup(group, t)
    }

    private handleControls(input: PlayerInput, dt: number)
    {
        const leftAxis = input.leftAxis()
        
        // moving forward/backwars
        const linearMotion = -leftAxis.vertical * this.ship.maxSpeed
        const linearMotionX = Math.cos(this.rotation) * linearMotion
        const linearMotionY = Math.sin(this.rotation) * linearMotion
        this.setVelocity(linearMotionX, linearMotionY)

        // rotation
        const rotation = this.ship.angularSpeed * leftAxis.horizontal
        const rotationDt = dt / 1000 * rotation
        this.setAngle(this.angle + rotationDt)

        const rightAxis = input.rightAxis()
        const turretDirection = -(this.angle - rightAxis.direction)
        this._turretSprite.setAngle(turretDirection)
    }

    public takeDamage(damage: Damage)
    {
        super.takeDamage(damage)
    }

    protected killInternal() { }

    protected killEffect()
    {
        const particles = this.scene.add.particles('particle_blue')
        const emitter = particles.createEmitter({ lifespan: (a) => Math.random()*750})
        emitter.setPosition(this.x, this.y)
        emitter.setSpeed(150)
        emitter.setAlpha((p, k, t) => Math.sqrt(1 - t)) //1 - t)
        emitter.stop()
        emitter.explode(20, this.x, this.y)
        setTimeout(() => emitter.remove(), 750)
    }

    public exportState()
    {
        return new PlayerState(this.shieldValue, this.hullValue, this.structureValue, this.heatValue)
    }

    public importState(state: PlayerState)
    {
        // Don't replace the clamped numbers because it destoys the callbacks!
        this.shieldValue.current = state.shield.current
        this.hullValue.current = state.hull.current
        this.structureValue.current = state.structure.current
        this.heatValue.current = state.heat.current

        // TODO: Equipment status and cooldowns need to be set as well!
    }
}

export class PlayerState
{
    // TODO: add a player id? What happens if a player was killed?

    constructor(
        public shield: ClampedNumber,
        public hull: ClampedNumber,
        public structure: ClampedNumber,
        public heat: ClampedNumber
    )
    {
        //  
    }
}