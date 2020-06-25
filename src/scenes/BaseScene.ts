import Phaser, { Scene } from 'phaser'
import { PreloadRessourceList } from './PreloadRessourcePair'
import TilemapDefinition from './TilemapDefinition'

export default abstract class BaseScene extends Scene
{
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
        const layer = map.createStaticLayer(definition.layerName, tilesetImage)
        return layer
    }

    protected createCollisionTilemapLayer(map: Phaser.Tilemaps.Tilemap, definition: TilemapDefinition) //layerName: string, tilesetName: string, tilesetResourceKey: string)
    {
        const layer = this.createTilemapLayer(map, definition)
        layer.setCollisionByExclusion([-1], true)
        return layer
    }

    protected readPropertyFromObjectLayerObject<T>(object: Phaser.Types.Tilemaps.TiledObject, property: string, fallback: T) : T
    {
        if(object === undefined)
            return fallback
        if(object.properties === undefined || object.properties.length === 0)
            return fallback

        const val = object.properties.find(x => x.name === property)?.value ?? fallback
        return val as T
    }

    protected abstract createPreloadRessourcePairs() : PreloadRessourceList
}