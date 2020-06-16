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

    constructor(scene, x, y, spriteKey, angle, velocity: number | undefined, 
                protected _team: Teams,
                protected _damage: Damage.Damage,
                private colliderGroup?: Phaser.Physics.Arcade.Group,
                protected _friendlyFire: boolean = false,
                protected _ignoresShields: boolean = false,
                protected _ignoresHull: boolean = false,
                protected _lifetime: number = 0
                )
    {
        // the super call needs to be the first thing that is done, thus we cannot compute v_x and v_y beforehand.
        super(scene, x, y, spriteKey)
        scene.add.existing(this)
        scene.physics.add.existing(this)
        colliderGroup?.add(this)
        this.setAngle(angle)
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

    public takeDamage(_)
    {
        // regular projectile cannot take damage
    }

    public kill()
    {
        this.colliderGroup?.remove(this)
        this.destroy()
    }
}

export function fromTemplate(scene, x, y, team, angle, template: ProjectileTemplate, colliderGroup?: Phaser.Physics.Arcade.Group)
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
        template.lifetime
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
}

export const EmptyTemplate: ProjectileTemplate =
{
    spriteKey: '',
    velocity: 0,
    damage: Damage.None,
    friendlyFire: false,
    ignoresShields: false,
    ignoresHull: false,
    lifetime: 0
}

export const LightLaserTemplate : ProjectileTemplate =
{
    spriteKey: 'projectile_01',
    velocity: 400,
    damage: new Damage.Damage(0, 20, 0, 0),
    friendlyFire: false,
    ignoresShields: false,
    ignoresHull: false,
    lifetime: 1500
}
