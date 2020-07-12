import { ProjectileTemplate } from '../Projectile'
import { Damage } from '../DamageType'
import Vector2 = Phaser.Math.Vector2

export const LightLaserTemplate : ProjectileTemplate =
{
    spriteKey: 'projectile_01',
    velocity: 400,
    damage: new Damage(0, 20, 0, 0),
    friendlyFire: false,
    ignoresShields: false,
    ignoresHull: false,
    range: 500,
    pierces: false,
    pierceHitsContinuously: false,
    angularSpeed: 0,
    size: new Vector2(23, 9)
}

export const FusionGunTemplate : ProjectileTemplate =
{
    spriteKey: 'fusion_01',
    velocity: 200,
    damage: new Damage(0, 200, 0, 50),
    friendlyFire: false,
    ignoresHull: false,
    ignoresShields: false,
    range: 1000,
    pierces: true,
    pierceHitsContinuously: false,
    angularSpeed: 45,
    size: new Vector2(44, 44)
}