export class Navigation
{
    constructor(private _navMeshPlugin: any)
    {
        //
    }

    public between(a: Phaser.Geom.Point, b: Phaser.Geom.Point) : Phaser.Geom.Point[]
    {
        const path: Phaser.Geom.Point[] = []
        let points = this._navMeshPlugin.findPath(a, b)
        if(points === null || points === undefined)
            points = []
        points.forEach(element => {
            path.push(new Phaser.Geom.Point(element.x, element.y))
        });
        return path
    }

    public betweenFunc()
    {
        return this.between.bind(this)
    }
}