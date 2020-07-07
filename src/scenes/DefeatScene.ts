import BaseScene from './BaseScene';
import { PreloadRessourceList } from './PreloadRessourcePair';
import TilemapDefinition from './TilemapDefinition';

export class DefeatScene extends BaseScene
{
    protected get mapName() { return "defeat" }
    protected map!: Phaser.Tilemaps.Tilemap

    constructor()
    {
        super("defeat")
    }

    create()
    {
        this.map = this.createMap(this.mapName)
        this.createTilemapLayer(this.map, new TilemapDefinition("terrain", "floor", "tiles"))
        setTimeout(() => window.location.reload(), 5000)
    }

    protected createPreloadRessourcePairs()
    {
        const pairs = new PreloadRessourceList()
        pairs.addImage('tiles', 'images/tilesets/scifi_floor.png')
        pairs.addTilemap('defeat', 'maps/defeat.json')
        return pairs        
    }
}