import Phaser from 'phaser'
import PhysicalEntity from './PhysicalEntity'
import NameOf from 'ts-nameof'
import { Teams } from  './Teams'

export default class PlayerEntity extends PhysicalEntity
{
    constructor(scene, x, y, spriteKey, colliderGroup?: Phaser.Physics.Arcade.Group)
    {
        super(scene, x, y, spriteKey, Teams.Players, undefined, undefined, colliderGroup)
    }
}