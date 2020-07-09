export type Physical = number
export type Energy = number
export type Heat = number
export type Explosion = number

export const PhysicalToShield       = 0.66
export const PhysicalToHull         = 1.25
export const PhysicalToStructure    = 1.00

export const EnergyToShield         = 1.25
export const EnergyToHull           = 0.66
export const EnergyToStructure      = 1.00

export const HeatToShield           = 0.10
export const HeatToHull             = 0.20
export const HeatToStructure        = 0.30

export const ExplosionToShield      = 0.80
export const ExplosionToHull        = 1.00
export const ExplosionToStructure   = 1.25

export class Damage
{
    get isNonZero() { return (this.physical + this.energy + this.explosion + this.heat) > 0 }

    constructor(public readonly physical: Physical,
                public readonly energy: Energy,
                public readonly explosion: Explosion,
                public readonly heat: Heat)
    { }

    /**
     * Applies the multiplicator to all damages types of this Damage instance.
     * @param x Multiplicator
     */
    public scale(x: number)
    {
        // Alternative: add properties for the damage and make the scale a property
        // on this object. The getter will then multiply the scale.
        return new Damage(
            this.energy * x,
            this.physical * x,
            this.explosion * x,
            this.heat * x
        )
    }
}

export const None = new Damage(0, 0, 0, 0)