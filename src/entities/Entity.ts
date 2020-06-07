import Phaser from 'phaser'
import { Teams } from './Teams'
import NameOf from 'ts-nameof'

export default abstract class Entity extends Phaser.GameObjects.GameObject 
{
    public readonly Team: Teams

    constructor(scene, typeName, team: Teams)
    {
        super(scene, typeName)
        this.Team = team
    }
}