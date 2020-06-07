import Phaser from 'phaser'
import PhysicalEntity from './PhysicalEntity'
import NameOf from 'ts-nameof'
import { Teams } from  './Teams'

export default class PlayerEntity extends PhysicalEntity
{
    constructor(scene, body)
    {
        super(scene, nameof(PlayerEntity), Teams.Players, body)
    }
}