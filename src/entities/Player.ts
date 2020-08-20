import Phaser from 'phaser'
import PhysicalEntity from './PhysicalEntity'
import { Teams } from  './Teams'
import PlayerInput from './../input/PlayerInput'
import { TriggeredEquipment, EquipmentAngleCallback } from './TriggeredEquipment'
import { Damage } from './DamageType'
import ClampedNumber from '~/utilities/ClampedNumber'
import { AddEntityFunc, AddProjectileFunc } from '~/scenes/ColliderCollection'
import { Tank } from './Tank'
import { HardPoint, HardPointPosition } from './Hardpoint'
import GameplayScene from '~/scenes/GameplayScene'
import PlayerColor from '~/utilities/PlayerColor'
import DamageDealt from './DamageDealt'
import InitialPosition from '~/utilities/InitialPosition'
import { IInputProvider } from '~/providers/InputProvider'
import { IPlayerProvider, IEnemyProvider, IProviderCollection } from '~/providers/EntityProvider'
import { ILineOfSightProvider } from '~/providers/LineOfSightProdiver'

export class PlayerEntity extends PhysicalEntity
{
    public static readonly Colors = [ 
        new PlayerColor(Phaser.Display.Color.HexStringToColor("#FF0700")), 
        new PlayerColor(Phaser.Display.Color.HexStringToColor("#02F4FF")), 
        new PlayerColor(Phaser.Display.Color.HexStringToColor("#A7FF00"))
    ]

    public get indexedEquipment() : [number, TriggeredEquipment[]][] { return [0, 1, 2, 3, 4, 5].map(i => [i, this.tank.triggeredEquipmentGroup(i).map(([e, _]) => e)]) }

    public get tank() { return this._tank }

    private _turretSprite: Phaser.GameObjects.Image
    private _turretDirection: Phaser.GameObjects.Line

    constructor(scene: GameplayScene, 
                position: InitialPosition, 
                private _tank: Tank, 
                colliderGroupFunc: AddEntityFunc, 
                private _projectileCollider: AddProjectileFunc, 
                index: number, 
                private _input: IInputProvider, 
                private _providerCollection: IProviderCollection
                )
    {
        super(scene, position, _tank.spriteKey, Teams.Players, new ClampedNumber(_tank.shield), new ClampedNumber(_tank.hull), new ClampedNumber(_tank.structure), new ClampedNumber(100, 0, 0), colliderGroupFunc)
        _tank.addEquipmentChangedListener((s, __, ___, ____) => { this.shieldValue.max = s.shield; this.hullValue.max = s.hull; this.structureValue.max = s.structure; this.heatValue.max = s.maxHeat; })
        this._turretSprite = scene.add.image(_tank.turretOffset.x, _tank.turretOffset.y, _tank.turretSpriteKey) 
        this.add(this._turretSprite)
        
        const directionArrow = scene.add.line(35, 0, 0, 0, 35, 0, PlayerEntity.Colors[index].lighter)
        directionArrow.setOrigin(0, 0)
        directionArrow.setLineWidth(2)
        this.add(directionArrow)

        this._turretDirection = scene.add.line(_tank.turretOffset.x, _tank.turretOffset.y, 35 , 0, 70, 0, PlayerEntity.Colors[index].darker)
        this._turretDirection.setOrigin(0, 0)
        this._turretDirection.setLineWidth(2)
        this.add(this._turretDirection)
    }

    private triggerEquipmentGroup(group: [TriggeredEquipment, HardPoint][], t: number)
    {
        function turretAngleCallbackFunc(p: PlayerEntity, hardPointAngle: number) : EquipmentAngleCallback { return () => p.angle + p._turretSprite.angle + hardPointAngle }
        function hullAngleCallbackFunc (p: PlayerEntity, hardPointAngle: number) : EquipmentAngleCallback  { return () => p.angle + hardPointAngle }

        group.forEach(([e, h]) => { 
            const isHullMounted = h.position === HardPointPosition.Hull
            if(e.heatPerTrigger <= this.remainingHeatBudget)
            {
                const positionCallback = (angleCallback: EquipmentAngleCallback) => { 
                    const offsetPoint = isHullMounted ? new Phaser.Geom.Point(h.offsetX, h.offsetY) : new Phaser.Geom.Point(h.offsetX + this._turretSprite.x, h.offsetY + this._turretSprite.y)
                    const offset = Phaser.Math.Rotate(offsetPoint, angleCallback() * Phaser.Math.DEG_TO_RAD)
                    return new Phaser.Geom.Point(this.x + offset.x, this.y + offset.y)
                }
                const angle = isHullMounted ? hullAngleCallbackFunc(this, h.angle) : turretAngleCallbackFunc(this, h.angle)
                const heatGenerated = e.trigger(this.scene as GameplayScene, this._projectileCollider, positionCallback, angle, this._providerCollection, t, this.name, this.team)
                this.heatValue.add(heatGenerated)
            }
        })
    }

    public update(t: number, dt: number)
    {
        if(this.active === false) return
        this.updateEquipment(t, dt, this.x, this.y, this.angle)
        this.handleInput(this._input.request(), t, dt)
    }

    private updateEquipment(t, dt, x, y, angle)
    {
        const update = this._tank.update(t, dt, [], false)
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
            group = this.tank.triggeredEquipmentGroup(0)
        else if(input.bumperRight.isDown)
            group = this.tank.triggeredEquipmentGroup(1)
        else if(input.action1.isDown)
            group = this.tank.triggeredEquipmentGroup(2)
        else if(input.action2.isDown)
            group = this.tank.triggeredEquipmentGroup(3)
        else if(input.action3.isDown)
            group = this.tank.triggeredEquipmentGroup(4)
        else if(input.action4.isDown)
            group = this.tank.triggeredEquipmentGroup(5)

        this.triggerEquipmentGroup(group, t)
    }

    private handleControls(input: PlayerInput, dt: number)
    {
        const leftAxis = input.leftAxis()
        
        // moving forward/backwars
        const linearMotion = -leftAxis.vertical * this.tank.maxSpeed
        const linearMotionX = Math.cos(this.rotation) * linearMotion
        const linearMotionY = Math.sin(this.rotation) * linearMotion
        this.setVelocity(linearMotionX, linearMotionY)

        // rotation
        const rotation = this.tank.angularSpeed * leftAxis.horizontal
        const rotationDt = dt / 1000 * rotation
        this.setAngle(this.angle + rotationDt)

        const rightAxis = input.rightAxis()
        const turretDirection = -(this.angle - rightAxis.direction)
        this._turretSprite.setAngle(turretDirection)
        this._turretDirection.setAngle(turretDirection)
    }

    public takeDamage(damage: Damage) : DamageDealt
    {
        const damageTaken = super.takeDamage(damage)
        if(damageTaken.dealtStructureDamage)
        {
            const equipmentDestroyedChance = damageTaken.structureDamage / this.structureValue.max
            console.log(equipmentDestroyedChance)
            if(Math.random() < equipmentDestroyedChance)
            {
                const nonDestroyedEquipment = this.tank.allEquipment.filter(e => e.isDestroyed === false)
                if(nonDestroyedEquipment.length > 0)
                {
                    const equipment = nonDestroyedEquipment[Math.floor(Math.random() * nonDestroyedEquipment.length)]
                    equipment.destroy()
                    console.log("Equipment has been destroyed!", equipment.manufacturer, equipment.modelName)
                }
            }
        }
        return damageTaken
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
        public heat: ClampedNumber,
    )
    {
        //  
    }
}