import Phaser, { Physics } from 'phaser'
import PhysicalEntity from './PhysicalEntity'
import * as Damage from './DamageType'
import { Teams } from './Teams'

export class Projectile extends PhysicalEntity
{
    get damage() { return this._damage }
    get friendlyFire() { return this._friendlyFire }
    get ignoresShields() { return this._ignoresShields }
    get ignoresHull() { return this._ignoresHull }

    constructor(scene, x, y, spriteKey, team, angle, velocity, 
                protected _damage: Damage.Damage,
                colliderGroup?: Phaser.Physics.Arcade.Group,
                protected _friendlyFire: boolean = false,
                protected _ignoresShields: boolean = false,
                protected _ignoresHull: boolean = false)
    {
        // the super call needs to be the first thing that is done, thus we cannot compute v_x and v_y beforehand.
        super(scene, x, y, spriteKey, team, angle, velocity, colliderGroup)
        this.setCollideWorldBounds(true)
    }
}

export function fromTemplate(scene, x, y, team, angle, template: ProjectileTemplate, colliderGroup?: Phaser.Physics.Arcade.Group)
{
    return new Projectile(
        scene,
        x, y, 
        template.spriteKey, 
        team, 
        angle, 
        template.velocity, 
        template.damage, 
        colliderGroup,
        template.friendlyFire, 
        template.ignoresShields, 
        template.ignoresHull
        )
}

class ProjectileTemplate
{
    public spriteKey = ''
    public velocity = 0
    public damage = new Damage.Damage(0, 0, 0)
    public friendlyFire = false
    public ignoresShields = false
    public ignoresHull = false
}

export const LightLaserTemplate : ProjectileTemplate =
{
    spriteKey: 'projectile_01',
    velocity: 400,
    damage: new Damage.Damage(0, 20, 0),
    friendlyFire: false,
    ignoresShields: false,
    ignoresHull: false
}
