export default class DamageDealt
{
    public get dealtShieldDamage() { return this.shieldDamage > 0 }
    public get dealtHullDamage() { return this.hullDamage > 0 }
    public get dealtStructureDamage() { return this.structureDamage > 0 }

    constructor(public readonly shieldDamage,
                public readonly hullDamage,
                public readonly structureDamage)
    {
        //
    }
}