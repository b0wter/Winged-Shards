import Phaser from 'phaser'
import { Teams } from './Teams'
import { Damage } from './DamageType'
import PhysicalEntity from './PhysicalEntity'

export class Enemy extends PhysicalEntity
{
    constructor(scene: Phaser.Scene, x, y, spriteKey, angle, collider, shields: number, hull: number, structure: number)
    {
        super(scene, x, y, spriteKey, Teams.Enemies, angle, 0, collider)
        this.shields = shields
        this.hull = hull
        this.structure = structure
    }
}

export function fromTemplate(scene, x, y, angle, template: EnemyTemplate, colliderGroup?: Phaser.Physics.Arcade.Group)
{
    return new Enemy(
        scene,
        x, y, 
        template.spriteKey, 
        angle, 
        colliderGroup,
        template.shield,
        template.hull,
        template.structure
        )
}

class EnemyTemplate
{
    public spriteKey = ''
    public shield = 0
    public hull = 0
    public structure = 0
}