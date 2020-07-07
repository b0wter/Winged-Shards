import Phaser from 'phaser'
import { Teams } from './Teams'
import { Damage } from './DamageType'
import PhysicalEntity from './PhysicalEntity'
import { PlayerEntity } from './Player'
import ClampedNumber from './../utilities/ClampedNumber'
import { Weapon, WeaponTemplate, DummyWeapon, LightLaser } from './Weapon'
import DefaultEnemyAi from '~/ai/DefaultEnemyAi'
import { TriggeredEquipment, ActiveEquipmentTemplate } from './TriggeredEquipment'
import { AddEntityFunc, AddEnemyProjectileFunc, AddProjectileFunc } from '~/scenes/ColliderCollection'
import GameplayScene from '~/scenes/GameplayScene'

export class Enemy extends PhysicalEntity
{
    public get angularSpeed() { return this._angularSpeed }
    private _angularSpeed = 120

    public get velocity() { const b = this.body as Phaser.Physics.Arcade.Body; return b.velocity ?? new Phaser.Math.Vector2(0,0)}

    public get maxVelocity() { return this._maxVelocity }

    private _ai = new DefaultEnemyAi(300, ((this.equipment.map(e => e.range)).sort()[0] ?? 500) - 100 , 1000, true)

    public get equipment() { return this._equipment }

    constructor(scene: GameplayScene, 
                x: number, y: number, 
                spriteKey: string, 
                angle: number, 
                collider: AddEntityFunc, 
                shields: ClampedNumber, 
                hull: ClampedNumber, 
                structure: ClampedNumber, 
                private _maxVelocity: number,
                private _equipment: TriggeredEquipment[]
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
              collider,
              angle,
              0)
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
        const ai = this._ai.compute(t, dt, this, players, this.seesPlayer.bind(this), false, this.gameplayScene.navigation.betweenFunc())
        if(players === undefined || players === null || players.length === 0) 
            return

        //const seesPlayer = this.seesPlayer(players[0])
        // Difference in degrees of the actual direction the enemy is facing and the target.
        // This is the amount of turning the enemy needs to do.
        const difference = Phaser.Math.Angle.ShortestBetween(this.angle, ai.desiredAngle)

        const sign = Math.sign(difference)
        // The maximum amount of turning possible in dt. This needs to be clamped.
        let turning = this.angularSpeed * sign * dt / 1000
        turning = sign === 1 ? Math.min(turning, difference) : Math.max(turning, difference)

        this.angle += turning
        this.setVelocity(ai.desiredVelocity.x, ai.desiredVelocity.y)

        ai.equipmentTriggers.forEach(x => { if(x[1]) { this.fireWeapon(t, x[0]) }} )
    }

    private seesPlayer(player: PlayerEntity) : boolean
    {
        const ray = new Phaser.Geom.Line(this.x, this.y, player.x, player.y)
        var intersects = this.gameplayScene.computeWallIntersection(ray)
        return intersects
    }

    private fireWeapon(t: number, e: TriggeredEquipment)
    {
        const body = (this.body as Phaser.Physics.Arcade.Body)
        const offset = 0 //(body.width / 2) ?? 0
        const offsetX = offset * Math.cos(this.rotation)
        const offsetY = offset * Math.sin(this.rotation)

        e.trigger(this.x + offsetX, this.y + offsetY, this.angle, t, this.name, 0, 0)
    }
}

export class EnemyTemplate
{
    public name = ""
    public spriteKey = ""
    public shield = 0
    public hull = 0
    public structure = 0
    public maxVelocity = 0
    public equipment : ActiveEquipmentTemplate[] = [ DummyWeapon ]

    public instatiate(scene: GameplayScene, x: number, y: number, angle: number, colliderFunc: AddEntityFunc, bulletsColliderFunc: AddProjectileFunc)
    {
        const equipment = this.equipment.map(x => x.instantiate(scene, bulletsColliderFunc, Teams.Enemies, 0, 0))
        return new Enemy(scene, x, y, this.spriteKey, angle, colliderFunc, new ClampedNumber(this.shield), new ClampedNumber(this.hull), new ClampedNumber(this.structure), this.maxVelocity, equipment)
    }
}

export const LightFighter : EnemyTemplate =
    Object.assign(new EnemyTemplate(), {
        name: "light_fighter",
        spriteKey : "spaceship_02",
        shield: 40,
        hull: 20,
        structure: 10,
        maxVelocity: 150,
        equipment: [ LightLaser ]
    })

export const EnemyTemplates : { [id: string] : EnemyTemplate; } = { 
    "light_fighter": LightFighter 
}