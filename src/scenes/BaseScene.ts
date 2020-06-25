import Phaser, { Scene } from 'phaser'
import { PreloadRessourceList } from './PreloadRessourcePair'

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
    protected createTilemapLayer(map: Phaser.Tilemaps.Tilemap, layerName: string, tilesetName: string, tilesetResourceKey: string)
    {
        const tilesetImage = map.addTilesetImage(tilesetName, tilesetResourceKey)
        const layer = map.createStaticLayer(layerName, tilesetImage)
        return layer
    }

    protected createCollisionTilemapLayer(map: Phaser.Tilemaps.Tilemap, layerName: string, tilesetName: string, tilesetResourceKey: string)
    {
        const layer = this.createTilemapLayer(map, layerName, tilesetName, tilesetResourceKey)
        layer.setCollisionByExclusion([-1], true)
        return layer
    }

    protected abstract createPreloadRessourcePairs() : PreloadRessourceList
}