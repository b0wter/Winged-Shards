import Phaser, { Physics } from 'phaser'
import PhysicalEntity from './PhysicalEntity'
import * as Damage from './DamageType'
import { Teams } from './Teams'
import { AddProjectileFunc } from '~/scenes/ColliderCollection'
import InitialPosition from '~/utilities/InitialPosition'
import { IEnemyProvider, IPlayerProvider, IPhysicalEntityProvider, IProviderCollection, ProviderCollection } from '~/providers/EntityProvider'
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
                protected _innerRotationSpeed: number,
                protected _size: Phaser.Math.Vector2,
                protected _providerCollection: IProviderCollection,
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

        this.angle += dt * this._innerRotationSpeed / 1000

        this.internalUpdate(t, dt, this._providerCollection)
    }

    public internalUpdate(t: number, dt: number, providerCollection: IProviderCollection)
    {
        // This is here to be overwritten if necessary.
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

export abstract class ProjectileTemplate
{
    public abstract spriteKey
    public abstract velocity 
    public abstract damage
    public abstract friendlyFire
    public abstract ignoresShields
    public abstract ignoresHull
    public abstract range
    public abstract pierces
    public abstract pierceHitsContinuously
    public abstract innerRotationSpeed
    public abstract size

    public instantiate(scene: Phaser.Scene, x: number, y: number, team: Teams, angle: number, colliderFunc: AddProjectileFunc, ownerId: string, providerCollection: IProviderCollection)
    {
        return new Projectile(
            scene,
            new InitialPosition(x, y, angle, this.velocity),
            this.spriteKey, 
            team, 
            this.damage, 
            colliderFunc,
            this.friendlyFire, 
            this.ignoresShields, 
            this.ignoresHull,
            this.range,
            this.pierces,
            this.pierceHitsContinuously,
            ownerId,
            this.innerRotationSpeed,
            this.size,
            providerCollection
            )        
    }
}

