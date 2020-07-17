export class HeightLayer
{
    constructor(private _layer: Phaser.Tilemaps.StaticTilemapLayer)
    {
        _layer.setVisible(false)
    }
    
    public getHeight(x: number, y: number)
    {
        const tile = this._layer.getTileAt(x, y)
        if(tile === null || tile === undefined)
            return 0
        else return tile.index
    }
    
    public getHeightAtWorldXY(x: number, y: number)
    {
        const tileXY = this._layer.worldToTileXY(x, y)
        return this.getHeight(tileXY.x, tileXY.y)
    }
}