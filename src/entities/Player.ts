import Phaser from 'phaser'
import PhysicalEntity from './PhysicalEntity'
import NameOf from 'ts-nameof'
import { Teams } from  './Teams'
import * as Weapon from './Weapon'
import PlayerInput from './../input/PlayerInput'
import { TriggeredEquipment } from './TriggeredEquipment'
import { Damage } from './DamageType'
import ClampedNumber from '~/utilities/ClampedNumber'
import { AddEntityFunc } from '~/scenes/ColliderCollection'
import StatusBar from '~/interface/StatusBar'
import { CurrentStatusChange } from './StatusChanges'
import { Ship } from './Ship'

export default class PlayerEntity extends PhysicalEntity
{
    public readonly primaryEquipmentGroup: TriggeredEquipment[] = []
    public get primaryEquipment() { return this.primaryEquipmentGroup[0] } 
    public readonly secondaryEquipmentGroup: TriggeredEquipment[] = []
    public get secondaryEquipment() { return this.secondaryEquipmentGroup[0] } 
    public readonly tertiaryEquipmentGroup: TriggeredEquipment[] = []
    public get tertiaryEquipment() { return this.tertiaryEquipmentGroup[0] } 
    public readonly quaternaryEquipmentGroup: TriggeredEquipment[] = []
    public get quaternaryEquipment() { return this.quaternaryEquipmentGroup[0] } 
    public readonly quinaryEquipmentGroup: TriggeredEquipment[] = []
    public get quinaryEquipment() { return this.quinaryEquipmentGroup[0] } 
    public readonly senaryEquipmentGroup: TriggeredEquipment[] = []
    public get senaryEquipment() { return this.senaryEquipmentGroup[0] } 
    
    public get indexedEquipment() : [number, TriggeredEquipment][] { return [[0, this.primaryEquipment], [1, this.secondaryEquipment], [2, this.tertiaryEquipment], [3, this.quaternaryEquipment], [4, this.quinaryEquipment], [5. ,this.senaryEquipment]] }

    private readonly allEquipmentGroups = [ this.primaryEquipmentGroup, this.secondaryEquipmentGroup, this.tertiaryEquipmentGroup, this.quaternaryEquipmentGroup, this.quinaryEquipmentGroup, this.senaryEquipmentGroup ]

    constructor(scene: Phaser.Scene, x: number, y: number, angle: number, private _ship: Ship, colliderGroupFunc: AddEntityFunc)
    {
        super(scene, x, y, _ship.spriteKey, Teams.Players, new ClampedNumber(_ship.shield), new ClampedNumber(_ship.hull), new ClampedNumber(_ship.structure), new ClampedNumber(100, 0, 0), 2, 5, colliderGroupFunc, angle, undefined)
    }

    private triggerEquipmentGroup(group: TriggeredEquipment[], t: number)
    {
        group.forEach(x => { 
            if(x.heatPerTrigger <= this.remainingHeatBudget)
            {
                const heatGenerated = x.trigger(this.x, this.y, this.angle, t, this.name)
                this.heatValue.add(heatGenerated)
            }
        })
    }

    public update(t: number, dt: number, input: PlayerInput)
    {
        if(this.inactive) return
        super.internalUpdate(t, dt)
        this.updateEquipment(t, dt, this.x, this.y, this.angle)
        this.handleInput(input, t)
    }

    private updateEquipment(t, dt, x, y, angle) : CurrentStatusChange
    {
        const changes = this.allEquipmentGroups.flatMap(x => x.map(y => y.update(t, dt, false)))
        return CurrentStatusChange.combineAll(changes)
    }

    private handleInput(input: PlayerInput, t)
    {
        if(input === undefined)
            return;
        let group: TriggeredEquipment[] = []
        if(input.bumperLeft.isDown)
            group = this.primaryEquipmentGroup
        else if(input.bumperRight.isDown)
            group = this.secondaryEquipmentGroup
        else if(input.action1.isDown)
            group = this.tertiaryEquipmentGroup
        else if(input.action2.isDown)
            group = this.quaternaryEquipmentGroup
        else if(input.action3.isDown)
            group = this.quinaryEquipmentGroup
        else if(input.action4.isDown)
            group = this.senaryEquipmentGroup

        this.triggerEquipmentGroup(group, t)
    }

    public takeDamage(damage: Damage)
    {
        super.takeDamage(damage)
    }

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
}