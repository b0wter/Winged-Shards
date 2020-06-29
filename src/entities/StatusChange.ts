/**
 * Wraps all things that an equipment can possibly change.
 */
export default class StatusChange
{
    constructor(public deltaShield: number,
                public deltaShieldMax: number,
                public deltaHull: number,
                public deltaHullMax: number,
                public deltaStructure: number,
                public deltaStructureMax: number,
                public deltaHeat: number,
                public deltaHeatMax: number,
                public deltaSpeedMax: number,
                /**
                 * Scales the velocity of the ship. Is multiplied with the current velocity.
                 */
                public deltaVelocity: number)
    {
        //
    }

    public static forShield(deltaShield: number, deltaHeat: number = 0)
    {
        return new StatusChange(deltaShield, 9, 0, 0, 0, 0, deltaHeat, 0, 0, 0)
    }

    public static computeForShield(dt: number, shieldPerSecond: number, heatPerSecond: number = 0)
    {
        return StatusChange.forShield(dt * shieldPerSecond / 1000, dt * heatPerSecond / 1000)
    }

    public static forHeat(deltaHeat: number)
    {
        return new StatusChange(0, 0, 0, 0, 0, 0, deltaHeat, 0, 0, 0)
    }

    public static computeForHeat(dt: number, heatPerSecond: number)
    {
        return StatusChange.forHeat(dt * heatPerSecond / 1000)
    }

    public static get Zero() { return new StatusChange(0, 0, 0, 0, 0, 0,0 ,0 ,0 ,0) }
}