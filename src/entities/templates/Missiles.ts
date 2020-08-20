import { MissileTemplate } from '../Missile';
import { Damage } from '../DamageType';
import { Manufacturers } from '~/utilities/Manufacturers';
import Vector2 = Phaser.Math.Vector2

export class SmallMissileTemplate extends MissileTemplate
{
    public friendlyFire = false
    public pierceHitsContinuously = false
    public pierces = false
    public manufacturer = Manufacturers.BattlePrep
    public modelName = "SML-1"
    public ignoresHull = false
    public ignoresShields = false
    public innerRotationSpeed = 0
    public size = new Vector2(24, 12)
    public angularSpeed = 80
    public acquisitionRange = 1000
    public velocity = 450
    public spriteKey = "small-missile"
    public damage = new Damage(5, 0, 20, 5)
    public range = 1200
    public homing = true
    public activationDelay = 350
}
export const SmallMissile = new SmallMissileTemplate()

export class SmallDummyMissileTemplate extends SmallMissileTemplate
{
    homing = false
}
export const SmallDummyMissile = new SmallDummyMissileTemplate()