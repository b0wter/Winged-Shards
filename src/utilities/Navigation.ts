export class Navigation
{
    constructor(private _navMeshPlugin: any)
    {
        //
    }

    public between(a: Phaser.Geom.Point, b: Phaser.Geom.Point) : Phaser.Geom.Point[]
    {
        const path: Phaser.Geom.Point[] = []
        const points = this._navMeshPlugin.findPath(a, b)
        points.forEach(element => {
            path.push(new Phaser.Geom.Point(element.x, element.y))
        });
        return path
    }
}