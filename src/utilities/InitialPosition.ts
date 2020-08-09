export default class InitialPosition
{
    public get x() { return this._x }
    public get y() { return this._y }    
    public get angle() { return this._angle }
    public get velocity() { return this._velocity}

    constructor(private _x = 0,
                private _y = 0,
                private _angle = 0,
                private _velocity = 0)
    {
        //
    }
}