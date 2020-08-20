import { MissileTemplate } from '../Missile';
import { Damage } from '../DamageType';

export class SmallMissileTemplate extends MissileTemplate
{
    public angularSpeed = 80
    public acquisitionRange = 1000
    public velocity = 450
    public spriteKey = "small-missile"
    public damage = new Damage(5, 0, 20, 5)
    public range = 1200
}
export const SmallMissile = new SmallMissileTemplate()