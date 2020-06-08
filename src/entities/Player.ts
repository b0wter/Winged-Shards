import Phaser from 'phaser'
import PhysicalEntity from './PhysicalEntity'
import NameOf from 'ts-nameof'
import { Teams } from  './Teams'
import * as Weapon from './Weapon'
import PlayerInput from './../input/PlayerInput'
import Equipment from './Equipment'

export default class PlayerEntity extends PhysicalEntity
{
    public readonly primaryEquipmentGroup: Equipment[] = []
    public readonly secondaryEquipmentGroup: Equipment[] = []
    public readonly tertiaryEquipmentGroup: Equipment[] = []
    public readonly quaternaryEquipmentGroup: Equipment[] = []
    public readonly quinaryEquipmentGroup: Equipment[] = []
    public readonly senaryEquipmentGroup: Equipment[] = []
    
    constructor(scene: Phaser.Scene, x: number, y: number, spriteKey: string, colliderGroup?: Phaser.Physics.Arcade.Group)
    {
        super(scene, x, y, spriteKey, Teams.Players, undefined, undefined, colliderGroup)
    }

    private triggerEquipmentGroup(group: Equipment[], t: number)
    {
        group.forEach(x => x.trigger(this.x, this.y, this.angle, t))
    }

    public update(t: number, dt: number, input: PlayerInput)
    {
        let group: Equipment[] = []
        if(input.bumperLeft().firstFrameDown)
            group = this.primaryEquipmentGroup
        else if(input.bumperRight().firstFrameDown)
            group = this.secondaryEquipmentGroup
        else if(input.action1().firstFrameDown)
            group = this.tertiaryEquipmentGroup
        else if(input.action2().firstFrameDown)
            group = this.quaternaryEquipmentGroup
        else if(input.action3().firstFrameDown)
            group = this.quinaryEquipmentGroup
        else if(input.action4().firstFrameDown)
            group = this.senaryEquipmentGroup

        this.triggerEquipmentGroup(group, t)
    }
}