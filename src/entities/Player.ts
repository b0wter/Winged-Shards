import Phaser from 'phaser'
import PhysicalEntity from './PhysicalEntity'
import NameOf from 'ts-nameof'
import { Teams } from  './Teams'
import * as Weapon from './Weapon'
import PlayerInput from './../input/PlayerInput'
import Equipment from './Equipment'
import { Damage } from './DamageType'
import ClampedNumber from '~/utilities/ClampedNumber'

export default class PlayerEntity extends PhysicalEntity
{
    public readonly primaryEquipmentGroup: Equipment[] = []
    public readonly secondaryEquipmentGroup: Equipment[] = []
    public readonly tertiaryEquipmentGroup: Equipment[] = []
    public readonly quaternaryEquipmentGroup: Equipment[] = []
    public readonly quinaryEquipmentGroup: Equipment[] = []
    public readonly senaryEquipmentGroup: Equipment[] = []
    
    private readonly allEquipmentGroups = [ this.primaryEquipmentGroup, this.secondaryEquipmentGroup, this.tertiaryEquipmentGroup, this.quaternaryEquipmentGroup, this.quinaryEquipmentGroup, this.senaryEquipmentGroup ]

    constructor(scene: Phaser.Scene, x: number, y: number, spriteKey: string, colliderGroup?: Phaser.Physics.Arcade.Group)
    {
        super(scene, x, y, spriteKey, Teams.Players, new ClampedNumber(200, 0, 0), new ClampedNumber(100), new ClampedNumber(50), new ClampedNumber(100, 0, 0), 2, 5, undefined, undefined, colliderGroup)

        //(this.body as Phaser.Physics.Arcade.Body).immovable = true
    }

    private triggerEquipmentGroup(group: Equipment[], t: number)
    {
        group.forEach(x => { 
            if(x.heatPerTrigger <= this.remainingHeatBudget)
            {
                x.trigger(this.x, this.y, this.angle, t)
                this.heatValue.add(x.heatPerTrigger)
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

    private updateEquipment(t, dt, x, y, angle)
    {
        this.allEquipmentGroups.forEach(x => x.forEach(y => y.update(t, dt)))
    }

    private handleInput(input: PlayerInput, t)
    {
        if(input === undefined)
            return;
        let group: Equipment[] = []
        if(input.bumperLeft.firstFrameDown)
            group = this.primaryEquipmentGroup
        else if(input.bumperRight.firstFrameDown)
            group = this.secondaryEquipmentGroup
        else if(input.action1.firstFrameDown)
            group = this.tertiaryEquipmentGroup
        else if(input.action2.firstFrameDown)
            group = this.quaternaryEquipmentGroup
        else if(input.action3.firstFrameDown)
            group = this.quinaryEquipmentGroup
        else if(input.action4.firstFrameDown)
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