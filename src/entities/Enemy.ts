import Phaser from 'phaser'
import { Teams } from './Teams'
import { Damage } from './DamageType'
import PhysicalEntity from './PhysicalEntity'
import PlayerEntity from './Player'
import ClampedNumber from './../utilities/ClampedNumber'
import { Weapon, WeaponTemplate, DummyWeapon, LightLaser } from './Weapon'
import DefaultEnemyAi from '~/ai/DefaultEnemyAi'
import HelloWorldScene from '~/scenes/HelloWorldScene'
import { Equipment, EquipmentTemplate } from './Equipment'

export class Enemy extends PhysicalEntity
{
    public get angularSpeed() { return this._angularSpeed }
    private _angularSpeed = 120

    public get velocity() { const b = this.body as Phaser.Physics.Arcade.Body; return b.velocity ?? new Phaser.Math.Vector2(0,0)}

    private _ai = new DefaultEnemyAi(300, 800, 1000, true)

    public get equipment() { return this._equipment }

    constructor(scene: Phaser.Scene, 
                x, y, 
                spriteKey, 
                angle, 
                collider, 
                private _weaponCollider: Phaser.Physics.Arcade.Group, 
                shields: ClampedNumber, 
                hull: ClampedNumber, 
                structure: ClampedNumber, 
                private _equipment: Equipment[]
               )
    {
        super(scene, 
              x, y, 
              spriteKey, 
              Teams.Enemies, 
              shields,
              hull,
              structure,
              new ClampedNumber(Number.MAX_SAFE_INTEGER), 
              2, 
              Number.MAX_SAFE_INTEGER, 
              angle, 
              0, 
              collider)
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
        super.internalUpdate(t, dt)
        this.updatePlayerInteraction(t, dt, players)
    }

    private updatePlayerInteraction(t: number, dt: number, players: PlayerEntity[])
    {
        const ai = this._ai.compute(t, dt, this, players)
        if(players === undefined || players === null || players.length === 0) 
            return

        const los = this.seesPlayer(players[0])

        // Difference in degrees of the actual direction the enemy is facing and the target.
        // This is the amount of turning the enemy needs to do.
        const difference = Phaser.Math.Angle.ShortestBetween(this.angle, ai.desiredAngle)

        const sign = Math.sign(difference)
        // The maximum amount of turning possible in dt. This needs to be clamped.
        let turning = this.angularSpeed * sign * dt / 1000
        turning = sign === 1 ? Math.min(turning, difference) : Math.max(turning, difference)

        this.angle += turning

        ai.equipmentTriggers.forEach(x => { if(x[1]) { this.fireWeapon(t, x[0]) }} )
    }

    private seesPlayer(player: PlayerEntity)
    {
        const ray = new Phaser.Geom.Line(this.x, this.y, player.x, player.y)
        var intersects = (this.scene as HelloWorldScene).computeWallIntersection(ray)
    }

    private fireWeapon(t: number, e: Equipment)
    {
        const body = (this.body as Phaser.Physics.Arcade.Body)
        const offset = (body.width / 2) ?? 0
        const offsetX = offset * Math.cos(this.rotation)
        const offsetY = offset * Math.sin(this.rotation)

        e.trigger(this.x + offsetX, this.y + offsetY, this.angle, t, this.name)
    }
}

class EnemyTemplate
{
    public name = ""
    public spriteKey = ""
    public shield = 0
    public hull = 0
    public structure = 0
    public equipment : EquipmentTemplate[] = [ DummyWeapon ]

    public instatiate(scene, x, y, angle, collider, bulletsCollider)
    {
        const equipment = this.equipment.map(x => x.instantiate(scene, bulletsCollider, Teams.Enemies, 0, 0))
        return new Enemy(scene, x, y, this.spriteKey, angle, collider, bulletsCollider, new ClampedNumber(this.shield), new ClampedNumber(this.hull), new ClampedNumber(this.structure), equipment)
    }
}

export const LightFighter : EnemyTemplate =
    Object.assign(new EnemyTemplate(), {
        name: "light_fighter",
        spriteKey : "spaceship_02",
        shield: 40,
        hull: 20,
        structure: 10,
        equipment: [ LightLaser ]
    })