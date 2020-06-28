import Phaser from 'phaser'
import GameplayScene from './GameplayScene'
import { PreloadRessourceList } from './PreloadRessourcePair'
import TilemapDefinition from './TilemapDefinition'
import PlayerEntity from '~/entities/Player'

export default class Campaign_01_Room_002 extends GameplayScene
{
    protected get mapName() { return "campaign_01_room_002_map" }

    protected get tilemapDefinitions() { return [ new TilemapDefinition("terrain", "floor", "tiles") ]}
    protected get collisionTilemapDefinition() { return new TilemapDefinition("collision", "collision", "collision_tiles")}

	constructor(players: PlayerEntity[])
	{
        super('campaign_01_room_002')
    }
    
    protected createPreloadRessourcePairs()
    {
        const pairs = new PreloadRessourceList
        pairs.addImage('tiles', 'images/tilesets/scifi_floor.png')
        pairs.addImage('collision_tiles', 'images/tilesets/collision.png')
        pairs.addImage('spaceship_01', 'images/ships/orange_01.png')
        pairs.addImage('spaceship_02', 'images/ships/red_01.png')
        pairs.addImage('projectile_01', 'images/projectiles/projectile-green.png')
        pairs.addImage('shield_regular', 'images/equipment/shield_regular.png')
        pairs.addImage('shield_circular', 'images/equipment/shield_circular_irregular_small.png')
        pairs.addImage('debris', 'images/effects/debris.png')
        pairs.addImage('particle_blue', 'images/effects/particle-blue.png')
        pairs.addImage('particle_red', 'images/effects/particle-red.png')
        pairs.addImage('fusion_01', 'images/projectiles/fusion-01.png')
        pairs.addSpritesheet('explosion_small', 'images/effects/explosion-small.png', { frameWidth: 46, frameHeight: 46})
        pairs.addTilemap('campaign_01_room_002_map', 'maps/campaign_01_room_002.json')
        return pairs
    }

    protected sceneSpecificUpdate(t: number, dt: number)
    {
        //
    }
}

