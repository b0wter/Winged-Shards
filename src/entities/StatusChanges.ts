
abstract class StatusChange
{
    constructor(public readonly shield: number,
                public readonly hull: number,
                public readonly structure: number,
                public readonly heat: number,
                public readonly speed: number)
    {
        //
    }

    /**
     * Scales every property (except speed!) of this instance and returns them as a new instance.
     */
    protected scaledGeneric<T extends StatusChange>(factor: number, constructor: (shield: number, hull: number, structure: number, heat: number, speed: number) => T)
    {
        return constructor(this.shield * factor, this.hull * factor, this.structure * factor, this.heat * factor, this.speed)
    }

    protected static combineGeneric<T extends StatusChange>(a: T, b: T, constructor: (shield: number, hull: number, structure: number, heat: number, speed: number) => T)
    {
        return constructor(a.shield + b.shield, a.hull + b.hull, a.structure + b.structure, a.heat + b.heat, a.speed + b.speed)
    }

    protected static combineAllGeneric<T extends StatusChange>(changes: T[], combinator: (_: T, __: T) => T)
    {
        return changes.reduce(combinator)
    }

    protected static computeFraction(dt: number, valuePerSecond: number)
    {
        return valuePerSecond * dt / 1000
    }
}

export class CurrentStatusChange extends StatusChange
{
    public static readonly zero = new CurrentStatusChange(0, 0, 0, 0, 0)

    public scaled(factor)
    {
        return this.scaledGeneric(factor, CurrentStatusChange.create)
    }

    public static forHeat(dt: number, heat: number)
    {
        return new CurrentStatusChange(0, 0, 0, this.computeFraction(dt, heat), 0)
    }

    public static forShield(dt: number, deltaShields: number, heatPerSecond = 0)
    {
        return new CurrentStatusChange(this.computeFraction(dt, deltaShields), 0, 0, heatPerSecond, 0)
    }

    public static combine(a: CurrentStatusChange, b: CurrentStatusChange)
    {
        return StatusChange.combineGeneric(a, b, CurrentStatusChange.create)
    }

    public static combineAll(changes: CurrentStatusChange[])
    {
        return StatusChange.combineAllGeneric(changes, CurrentStatusChange.combine)
    }

    private static create(shield, hull, structure, heat, speed) : CurrentStatusChange
    {
        return new CurrentStatusChange(shield, hull, structure, heat, speed)
    }
}

export class MaxStatusChange extends StatusChange
{
    public static readonly zero = new MaxStatusChange(0, 0, 0, 0, 0)

    public scaled(factor)
    {
        return this.scaledGeneric(factor, MaxStatusChange.create)
    }

    public static forHeat(heat: number)
    {
        return new MaxStatusChange(0, 0, 0, heat, 0)
    }

    public static forShield(deltaShields: number)
    {
        return new MaxStatusChange(deltaShields, 0, 0, 0, 0)
    }

    public static combine(a: MaxStatusChange, b: MaxStatusChange)
    {
        return StatusChange.combineGeneric(a, b, MaxStatusChange.create)
    }

    public static combineAll(changes: MaxStatusChange[])
    {
        return StatusChange.combineAllGeneric(changes, MaxStatusChange.combine)
    }

    private static create(shield, hull, structure, heat, speed) : MaxStatusChange
    {
        return new MaxStatusChange(shield, hull, structure, heat, speed)
    }
}

export type CombinedStatusChange = CurrentStatusChange & MaxStatusChange