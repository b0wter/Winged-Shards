import Point = Phaser.Geom.Point

export interface ILineOfSightProvider
{
    seesPoint(from: Point, to: Point) : boolean
    isVisiblePoint(p: Point)
}

export class SceneLineOfSightProvider implements ILineOfSightProvider
{
    constructor(private _los: (from: Point, to: Point) => boolean,
                private _tileVisibility: (point: Point) => boolean)
    {
        //
    }

    /**
     * Uses a line of sight test to check if a given point is visible from another point.
     */
    public seesPoint(from: Point, to: Point)
    {
        return this._los(from, to)
    }

    /**
     * Uses the players LOS map to see if the given point is on a visible tile.
     */
    public isVisiblePoint(p: Point)
    {
        this._tileVisibility(p)
    }
}