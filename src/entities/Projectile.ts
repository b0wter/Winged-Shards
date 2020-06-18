import Phaser, { Physics } from 'phaser'
import PhysicalEntity from './PhysicalEntity'
import * as Damage from './DamageType'
import { Teams } from './Teams'

export class Projectile extends Phaser.Physics.Arcade.Sprite
{
    get damage() { return this._damage }
    get friendlyFire() { return this._friendlyFire }
    get ignoresShields() { return this._ignoresShields }
    get ignoresHull() { return this._ignoresHull }
    get team() { return this._team }
    get lifetime() { return this._lifetime}
    get pierces() { return this._pierces }
    get pierceHitsContinuously() { return this._pierceHitsContinuously }

    private piercedEnemyIds: string[] = []

    constructor(scene, x, y, spriteKey, angle, velocity: number | undefined, 
                protected _team: Teams,
                protected _damage: Damage.Damage,
                private _colliderGroup: Phaser.Physics.Arcade.Group,
                protected _friendlyFire: boolean,
                protected _ignoresShields: boolean,
                protected _ignoresHull: boolean,
                protected _lifetime: number,
                protected _pierces: boolean,
                protected _pierceHitsContinuously: boolean,
                protected _ownerId: string
                )
    {
        // the super call needs to be the first thing that is done, thus we cannot compute v_x and v_y beforehand.
        super(scene, x, y, spriteKey)
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this._colliderGroup?.add(this)
        this.setAngle(angle)
        this.setImmovable(true)
        const v = velocity ?? 0
        const vX = v * Math.cos(this.angle * Phaser.Math.DEG_TO_RAD)
        const vY = v * Math.sin(this.angle * Phaser.Math.DEG_TO_RAD)
        this.setVelocity(vX, vY)
        this.setCollideWorldBounds(true)
        this.lifetimeTimer(this._lifetime)
    }

    private lifetimeTimer(lifetime: number)
    {
        if(lifetime > 0) {
            setTimeout(() => this.kill(), lifetime)
        }
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


    public takeDamage(_)
    {
        // regular projectile cannot take damage
    }

    public kill()
    {
        this._colliderGroup?.remove(this)
        this.destroy()
    }
}

export function fromTemplate(scene, x, y, team, angle, template: ProjectileTemplate, colliderGroup: Phaser.Physics.Arcade.Group, ownerId: string)
{
    return new Projectile(
        scene,
        x, y, 
        template.spriteKey, 
        angle, 
        template.velocity, 
        team, 
        template.damage, 
        colliderGroup,
        template.friendlyFire, 
        template.ignoresShields, 
        template.ignoresHull,
        template.lifetime,
        template.pierces,
        template.pierceHitsContinuously,
        ownerId
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
    public lifetime = 0
    public pierces = false
    public pierceHitsContinuously = false
}

export const EmptyTemplate: ProjectileTemplate =
{
    spriteKey: '',
    velocity: 0,
    damage: Damage.None,
    friendlyFire: false,
    ignoresShields: false,
    ignoresHull: false,
    lifetime: 0,
    pierces: false,
    pierceHitsContinuously: false
}

export const LightLaserTemplate : ProjectileTemplate =
{
    spriteKey: 'projectile_01',
    velocity: 400,
    damage: new Damage.Damage(0, 20, 0, 0),
    friendlyFire: false,
    ignoresShields: false,
    ignoresHull: false,
    lifetime: 1500,
    pierces: false,
    pierceHitsContinuously: false
}

export const FusionGunTemplate : ProjectileTemplate =
{
    spriteKey: 'fusion_01',
    velocity: 200,
    damage: new Damage.Damage(0, 200, 0, 50),
    friendlyFire: false,
    ignoresHull: false,
    ignoresShields: false,
    lifetime: 2500,
    pierces: true,
    pierceHitsContinuously: false
}
