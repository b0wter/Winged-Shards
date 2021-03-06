import Point = Phaser.Geom.Point

export interface ILineOfSightProvider
{
    seesPoint(from: Point, to: Point) : boolean
}

export class SceneLineOfSightProvider implements ILineOfSightProvider
{
    constructor(private _los: (from: Point, to: Point) => boolean,
                private _tileVisibility: (point: Point) => boolean)
    {
        //
    }

    public seesPoint(from: Point, to: Point)
    {
        return this._los(from, to)
    }

    public atLeastOnePlayerSeesTileAtWorldXY(point: Point)
    {
        this._tileVisibility(point)
    }
}