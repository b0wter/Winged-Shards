

export default abstract class Equipment
{
    /**
     * Cooldown in milliseconds.
     */
    get cooldown() { return this._cooldown }

    /**
     * Amount of heat generated per trigger.
     */
    get heatPerTrigger() { return this._heatPerTrigger}

    private lastUsedAt = 0

    protected cooldownModifier = 1

    constructor(protected _cooldown: number,
                protected _heatPerTrigger: number)
    {
        //
    }

    public trigger(x, y, angle, time)
    {
        const passed = time - this.lastUsedAt
        if(passed > this.cooldown * this.cooldownModifier) {
            this.internalTrigger(x, y, angle, time)
            this.lastUsedAt = time
        }
    }

    public abstract update(t, dt)

    protected abstract internalTrigger(x, y, angle, time)
}