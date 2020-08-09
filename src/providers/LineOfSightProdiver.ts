import Point = Phaser.Geom.Point

export interface ILineOfSightProvider
{
    seesPoint(from: Point, to: Point) : boolean
}

export class SceneLineOfSightProvider implements ILineOfSightProvider
{
    constructor(private _los: (from: Point, to: Point) => boolean)
    {
        //
    }

    public seesPoint(from: Point, to: Point)
    {
        return this._los(from, to)
    }
}