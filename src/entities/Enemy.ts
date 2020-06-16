import Phaser from 'phaser'
import { Teams } from './Teams'
import { Damage } from './DamageType'
import PhysicalEntity from './PhysicalEntity'
import PlayerEntity from './Player'
import ClampedNumber from './../utilities/ClampedNumber'

export class Enemy extends PhysicalEntity
{
    private testBool = true

    constructor(scene: Phaser.Scene, x, y, spriteKey, angle, collider, shields: number, hull: number, structure: number)
    {
        super(scene, x, y, spriteKey, Teams.Enemies, new ClampedNumber(shields), new ClampedNumber(hull), new ClampedNumber(structure), new ClampedNumber(Number.MAX_SAFE_INTEGER), angle, 0, collider)
        this.shields = shields
        this.hull = hull
        this.structure = structure
    }

    protected killEffect()
    {
        const particles = this.scene.add.particles('particle_red')
        const emitter = particles.createEmitter({ lifespan: (a) => Math.random()*750})
        emitter.setPosition(this.x, this.y)
        emitter.setSpeed(150)
        emitter.setAlpha((p, k, t) => Math.sqrt(1 - t)) //1 - t)
        emitter.stop()
        emitter.explode(20, this.x, this.y)
        setTimeout(() => emitter.remove(), 750)
    }   

    public update(t: number, dt: number, players: PlayerEntity[])
    {
        if(players !== undefined && players !== null)
            players.forEach(x => this.seesPlayer(x))
    }

    private seesPlayer(player: PlayerEntity)
    {
        const ray = new Phaser.Geom.Line(this.x, this.y, player.x, player.y)
        if(this.testBool)
        {
            //var intersects = (this.scene as HelloWorldScene).computeWallIntersection(ray)
            this.testBool = true
        }
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