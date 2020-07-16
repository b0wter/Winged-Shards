import BaseScene from './BaseScene';
import TilemapDefinition from './TilemapDefinition';

export class DefeatScene extends BaseScene
{
    public static readonly SceneName = "DefeatScene"

    protected get mapName() { return "defeat" }
    protected map!: Phaser.Tilemaps.Tilemap

    constructor()
    {
        super(DefeatScene.SceneName)
    }

    create()
    {
        this.map = this.createMap(this.mapName)
        this.createTilemapLayer(this.map, new TilemapDefinition("terrain", "floor", "tiles"))
        this.cameras.main.fadeIn(2500, 0, 0, 0, (_, progress) => {
            if(progress >= 0.9999)
                setTimeout(() => window.location.reload(), 5000)
        })
    }
}