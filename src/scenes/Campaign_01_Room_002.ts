import Phaser from 'phaser'
import GameplayScene from './GameplayScene'
import { PreloadRessourceList, FullRessourceList } from './PreloadRessourcePair'
import TilemapDefinition from './TilemapDefinition'

export default class Campaign_01_Room_002 extends GameplayScene
{
    protected get mapName() { return "campaign_01_room_002_map" }

    protected get tilemapDefinitions() { return [ new TilemapDefinition("terrain", "floor", "tiles") ]}
    protected get collisionTilemapDefinition() { return new TilemapDefinition("collision", "collision", "collision_tiles")}

	constructor()
	{
        super('campaign_01_room_002')
    }
    
    protected createPreloadRessourcePairs()
    {
        return new FullRessourceList()
    }

    protected sceneSpecificUpdate(t: number, dt: number)
    {
        //
    }
}

