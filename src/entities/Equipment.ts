

export default abstract class Equipment
{
    /**
     * Cooldown in milliseconds.
     */
    get cooldown() { return this._cooldown }

    private lastUsedAt = 0

    constructor(protected _cooldown: number)
    {
        //
    }

    public trigger(x, y, angle, time)
    {
        if(time - this.lastUsedAt > this.cooldown) {
            this.internalTrigger(x, y, angle, time)
            this.lastUsedAt = time
        }
    }

    protected abstract internalTrigger(x, y, angle, time)
}