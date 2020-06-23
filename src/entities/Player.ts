import Phaser from 'phaser'
import PhysicalEntity from './PhysicalEntity'
import NameOf from 'ts-nameof'
import { Teams } from  './Teams'
import * as Weapon from './Weapon'
import PlayerInput from './../input/PlayerInput'
import { Equipment } from './Equipment'
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

    constructor(scene: Phaser.Scene, x: number, y: number, angle: number, spriteKey: string, colliderGroup?: Phaser.Physics.Arcade.Group)
    {
        super(scene, x, y, spriteKey, Teams.Players, new ClampedNumber(200), new ClampedNumber(100), new ClampedNumber(50), new ClampedNumber(100, 0, 0), 2, 5, angle, undefined, colliderGroup)
    }

    private triggerEquipmentGroup(group: Equipment[], t: number)
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

    private updateEquipment(t, dt, x, y, angle)
    {
        this.allEquipmentGroups.forEach(x => x.forEach(y => y.update(t, dt)))
    }

    private handleInput(input: PlayerInput, t)
    {
        if(input === undefined)
            return;
        let group: Equipment[] = []
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