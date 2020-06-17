import Phaser from 'phaser'
import { Teams } from './Teams'
import { Damage } from './DamageType'
import PhysicalEntity from './PhysicalEntity'
import PlayerEntity from './Player'
import ClampedNumber from './../utilities/ClampedNumber'
import { Weapon, WeaponTemplate, DummyWeapon, LightLaser, fromTemplate as weaponTemplate } from './Weapon'
import DefaultEnemyAi from '~/ai/DefaultEnemyAi'

export class Enemy extends PhysicalEntity
{
    private testBool = true

    public get angularSpeed() { return this._angularSpeed }
    private _angularSpeed = 120

    public get primaryWeapon() { return this._primaryWeapon }
    private _primaryWeapon = weaponTemplate(this.scene, this._weaponCollider, this.team, LightLaser, 0, 0)

    public get allWeapons() { return [ this.primaryWeapon ] }

    private _ai = new DefaultEnemyAi(300, 800, true)

    constructor(scene: Phaser.Scene, x, y, spriteKey, angle, collider, private _weaponCollider: Phaser.Physics.Arcade.Group, shields: number, hull: number, structure: number)
    {
        super(scene, x, y, spriteKey, Teams.Enemies, new ClampedNumber(shields), new ClampedNumber(hull), new ClampedNumber(structure), new ClampedNumber(Number.MAX_SAFE_INTEGER), 2, Number.MAX_SAFE_INTEGER, angle, 0, collider)
        this.shields = shields
        this.hull = hull
        this.structure = structure
        this.angle = 90
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
        this.firePrimaryWeapon(t)
    }

    private updatePlayerInteraction(t: number, dt: number, players: PlayerEntity[])
    {
        const ai = this._ai.compute(t, dt, this, players)
        if(players === undefined || players === null || players.length === 0) return

        // Difference in degrees of the actual direction the enemy is facing and the target.
        // This is the amount of turning the enemy needs to do.
        const difference = Phaser.Math.Angle.ShortestBetween(this.angle, ai.desiredAngle)

        const sign = Math.sign(difference)
        // The maximum amount of turning possible in dt. This needs to be clamped.
        let turning = this.angularSpeed * sign * dt / 1000
        turning = sign === 1 ? Math.min(turning, difference) : Math.max(turning, difference)

        this.angle += turning
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

    private firePrimaryWeapon(t: number)
    {
        this.primaryWeapon.trigger(this.x, this.y, this.angle, t)
    }
}

export function fromTemplate(scene, x, y, angle, template: EnemyTemplate, colliderGroup: Phaser.Physics.Arcade.Group, weaponColliderGroup: Phaser.Physics.Arcade.Group)
{
    return new Enemy(
        scene,
        x, y, 
        template.spriteKey, 
        angle, 
        colliderGroup,
        weaponColliderGroup,
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
    public weapon = DummyWeapon
}