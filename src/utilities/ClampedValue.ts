type ClampedValueCallback<T> = (_: ClampedValue<T>) => void

/** 
 * A value that is clamped between a minimum and maximum value.
 * Has events for reaching the minumum/maximum value.
 */
export default class ClampedValue<T>
{
    get current() { return this._current }
    set current(t) 
    {
        if(this._lessOrEqual(t, this._min))
        {
            this._current = this._min
            this.triggerMinimumListeners()
            this.triggerChangeListeners()
        }
        else if(this._greaterOrEqual(t, this._max))
        {
            this._current = this._max
            this.triggerMaximumListeners()
            this.triggerChangeListeners()
        }
        else
        {
            this._current = t
            this.triggerChangeListeners()
        }
    }

    get max() { return this._max }
    /**
     * Gets or sets the maximum value. Does not change the current value.
     * If you want to increase the current value as well use `setMax(..., true)`.
     */
    set max(value: T) {
        if(this._greaterOrEqual(value, this.min))
            this._max = value
        else
            console.warn("The 'max' of a ClampedValue has not been set because it is less than the 'min'.")
    }

    get min() { return this._min }

    get percentage() { return this._divide(this.current, this.max) }

    get remaining() { return this._subtract(this.max, this.current) }

    private readonly onChangeListeners: ClampedValueCallback<T>[] = []
    private readonly onMinimumListeners: ClampedValueCallback<T>[] = []
    private readonly onMaximumListeners: ClampedValueCallback<T>[] = []

    constructor(private _min: T, 
                private _max: T, 
                private _current: T, 
                private _add: (a: T, b: T) => T, 
                private _subtract: (a: T, b: T) => T,
                private _multiply: (a: T, b: T) => T,
                private _divide: (a: T, b: T) => T,
                private _lessOrEqual: (a: T, b: T) => boolean,
                private _greaterOrEqual: (a: T, b: T) => boolean
                )
    {
        this.current = _current
    }

    public add(t: T)
    {
        this.current = this._add(this.current, t)
    }

    public substract(t: T)
    {
        this.current = this._subtract(this.current, t)
    }

    public isNotMinimum()
    {
        return !this._lessOrEqual(this.current, this._min)
    }

    public isMinimum()
    {
        return this._lessOrEqual(this.current, this._min)
    }

    public isMaximum()
    {
        return this._greaterOrEqual(this.current, this._max)
    }

    public isNotMaximum()
    {
        return !this._greaterOrEqual(this.current, this._max)
    }

    public setMax(max: T, increaseCurrent: boolean)
    {
        const oldPercentage = this.percentage
        this.max = max
        if(this.max === max && increaseCurrent)
        {
            this.current = this._multiply(this.max, oldPercentage)
        }
    }

    public addChangeListener(l: ClampedValueCallback<T>)
    {
        this.onChangeListeners.push(l)
    }

    public removeChangeListener(l: ClampedValueCallback<T>)
    {
        this.onChangeListeners.forEach( (item, index) => {
            if(item === l) this.onChangeListeners.splice(index,1);
          });
    }

    public addMinimumListener(l: ClampedValueCallback<T>)
    {
        this.onMinimumListeners.push(l)
    }

    public removeMinimumListener(l: ClampedValueCallback<T>)
    {
        this.onMinimumListeners.forEach( (item, index) => {
            if(item === l) this.onMinimumListeners.splice(index,1);
          });
    }

    public addMaximumListener(l: ClampedValueCallback<T>)
    {
        this.onMaximumListeners.push(l)
    }

    public removeMaximumListener(l: ClampedValueCallback<T>)
    {
        this.onMaximumListeners.forEach( (item, index) => {
            if(item === l) this.onMaximumListeners.splice(index,1);
          });
    }

    private triggerChangeListeners()
    {
        if(this.onChangeListeners !== undefined)
            this.onChangeListeners.forEach(x => x(this))
    }

    private triggerMinimumListeners()
    {
        if(this.onMinimumListeners !== undefined)
            this.onMinimumListeners.forEach(x => x(this))
    }

    private triggerMaximumListeners()
    {
        if(this.onMaximumListeners !== undefined)
            this.onMaximumListeners.forEach(x => x(this))
    }
}