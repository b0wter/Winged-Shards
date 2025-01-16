import Phaser, { Scene } from 'phaser'
import { PreloadRessourceList, FullRessourceList } from './PreloadRessourcePair'
import TilemapDefinition from './TilemapDefinition'
import { HeightLayer } from '~/utilities/HeightLayer'

export default abstract class BaseScene extends Scene
{
    /**
     * Number of active players. Sets the number of spawned PlayerEntities.
     * Must not exceed 3 and should not be less than one.
     */
    protected get numberOfPlayers() { return this._numberOfPlayers }
    protected set numberOfPlayers(count: number) { this._numberOfPlayers = Math.min(Math.max(0, count), 3)}
    private _numberOfPlayers = 1

    navMeshPlugin: any
    protected get navMesh() 
    {
        return this.navMeshPlugin 
    }

    constructor(name: string)
    {
        super(name)
    }

    preload()
    {
        this.load.setBaseURL('http://localhost:8000')
        const pairs = this.createPreloadRessourcePairs()
        pairs.images.forEach(x => this.load.image(x.key, x.filename))
        pairs.spritesheets.forEach(x => this.load.spritesheet(x.key, x.filename, x.options))
        pairs.tilemaps.forEach(x => this.load.tilemapTiledJSON(x.key, x.filename))
    }

    abstract create()

    /**
     * 
     * @param map Map to load the layer from.
     * @param layerName Name of the layer in Tiled.
     * @param tilesetName Name of the tileset in Tile.
     * @param tilesetResourceKey Resource key of the preloaded tileset sprite.
     */
    protected createTilemapLayer(map: Phaser.Tilemaps.Tilemap, definition: TilemapDefinition) //layerName: string, tilesetName: string, tilesetResourceKey: string)
    {
        const tilesetImage = map.addTilesetImage(definition.tilesetName, definition.tilesetRessourceKey)
        const layer =  map.createLayer(definition.layerName, tilesetImage!)
        return layer
    }

    protected createCollisionTilemapLayer(map: Phaser.Tilemaps.Tilemap, definition: TilemapDefinition) //layerName: string, tilesetName: string, tilesetResourceKey: string)
    {
        const layer = this.createTilemapLayer(map, definition)
        if (!layer) {
            throw new Error("Could not create collision layer")
        }
        layer.setCollisionByExclusion([-1], true)
        layer.setVisible(false)
        return layer
    }

    protected createHeightTilemapLayer(map: Phaser.Tilemaps.Tilemap, definition: TilemapDefinition)
    {
        const layer = this.createTilemapLayer(map, definition)
        if (!layer) {
            throw new Error("Could not create height layer")
        }
        return new HeightLayer(layer)   
    }

    protected createMap(mapName: string)
    {
        var map = this.make.tilemap({ key: mapName })
        return map
    }

    protected createPreloadRessourcePairs() : PreloadRessourceList
    {
        return new FullRessourceList()
    }
}