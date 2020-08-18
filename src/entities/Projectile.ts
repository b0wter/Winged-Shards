import Phaser, { Physics } from 'phaser'
import PhysicalEntity from './PhysicalEntity'
import * as Damage from './DamageType'
import { Teams } from './Teams'
import { AddProjectileFunc } from '~/scenes/ColliderCollection'
import InitialPosition from '~/utilities/InitialPosition'
import { IEnemyProvider, IPlayerProvider, IPhysicalEntityProvider } from '~/providers/EntityProvider'
import { ILineOfSightProvider } from '~/providers/LineOfSightProdiver'

export class Projectile extends Phaser.Physics.Arcade.Sprite
{
    get damage() { return this._damage.scale(this._scale) }
    get friendlyFire() { return this._friendlyFire }
    get ignoresShields() { return this._ignoresShields }
    get ignoresHull() { return this._ignoresHull }
    get team() { return this._team }
    get range() { return this._range }
    get pierces() { return this._pierces }
    get pierceHitsContinuously() { return this._pierceHitsContinuously }

    private piercedEnemyIds: string[] = []
    private _originX: number
    private _originY: number

    constructor(scene: Phaser.Scene, 
                position: InitialPosition,
                spriteKey: string, 
                protected _team: Teams,
                protected _damage: Damage.Damage,
                private _colliderFunc: AddProjectileFunc,
                protected _friendlyFire: boolean,
                protected _ignoresShields: boolean,
                protected _ignoresHull: boolean,
                protected _range: number,
                protected _pierces: boolean,
                protected _pierceHitsContinuously: boolean,
                protected _ownerId: string,
                protected _angularSpeed: number,
                protected _size: Phaser.Math.Vector2,
                private _friendliesProvider: IPhysicalEntityProvider<PhysicalEntity>,
                private _enemiesProvider: IPhysicalEntityProvider<PhysicalEntity>,
                private _los: ILineOfSightProvider,
                private _scale = 1
                )
    {
        // the super call needs to be the first thing that is done, thus we cannot compute v_x and v_y beforehand.
        super(scene, position.x, position.y, spriteKey)
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this._colliderFunc(this)
        this.setAngle(position.angle)
        this.setImmovable(true)
        const v = position.velocity ?? 0
        const vX = v * Math.cos(this.angle * Phaser.Math.DEG_TO_RAD)
        const vY = v * Math.sin(this.angle * Phaser.Math.DEG_TO_RAD)
        this.setVelocity(vX, vY)
        this.setCollideWorldBounds(true)
        this._originX = position.x
        this._originY = position.y
        if(_size !== Phaser.Math.Vector2.ZERO)
            this.body.setSize(_size.x, _size.y)
    }

    public update(t: number, dt: number)
    {
        const distance = Phaser.Math.Distance.Between(this.x, this.y, this._originX, this._originY)
        if(distance >= this._range)
            this.kill()

        this.angle += dt * this._angularSpeed / 1000
    }

    /**
     * Handles the hit interaction. Return value indicates wether this projectile was destroyed
     * in the process and can safely be removed from any tracking collection.
     * @param e Entity that was hit by this projectile.
     */
    public hit(e: PhysicalEntity) : boolean
    {
        if(this._ownerId === e.name)
            return false

        if(this.team === e.team && this.friendlyFire === false)
            return false
        
        if(this.pierces)
        {
            if(this.piercedEnemyIds.includes(e.name))
                return false

            // adding the entity id to this likst makes sure it is not hit again
            // continuously hitting projectiles are not added to this list and hit multiple times
            if(!this.pierceHitsContinuously)
                this.piercedEnemyIds.push(e.name)

            e.takeDamage(this.damage)
            if(this.pierces) {
                return false
            } else {
                this.kill()
                return true
            }

        }
        else
        {
            e.takeDamage(this.damage)   
            this.kill()
            return true
        }
    }

    /**
     * Applies the multiplicator to the damage of this projectile.
     * @param x Multiplicator
     */
    public scaleDamage(x: number)
    {
        this._scale = x
    }

    public takeDamage(_)
    {
        // regular projectile cannot take damage
    }

    public kill()
    {
        this.destroy()
    }
}

export function fromTemplate(scene: Phaser.Scene, 
                             x: number, y: number, 
                             team: Teams, 
                             angle: number, 
                             template: ProjectileTemplate, 
                             colliderFunc: AddProjectileFunc, 
                             ownerId: string, 
                             friendliesProvider: IPhysicalEntityProvider<PhysicalEntity>, 
                             enemiesProvider: IPhysicalEntityProvider<PhysicalEntity>,
                             los: ILineOfSightProvider
                            )
{
    return new Projectile(
        scene,
        new InitialPosition(x, y, angle, template.velocity),
        template.spriteKey, 
        team, 
        template.damage, 
        colliderFunc,
        template.friendlyFire, 
        template.ignoresShields, 
        template.ignoresHull,
        template.range,
        template.pierces,
        template.pierceHitsContinuously,
        ownerId,
        template.angularSpeed,
        template.size,
        friendliesProvider,
        enemiesProvider,
        los
        )
}

export class ProjectileTemplate
{
    public spriteKey = ''
    public velocity = 0
    public damage = Damage.None
    public friendlyFire = false
    public ignoresShields = false
    public ignoresHull = false
    public range = 0
    public pierces = false
    public pierceHitsContinuously = false
    public angularSpeed = 0
    public size = Phaser.Math.Vector2.ZERO
}

