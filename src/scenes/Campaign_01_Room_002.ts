import Phaser from 'phaser'
import GameplayScene from './GameplayScene'
import { PreloadRessourceList, FullRessourceList } from './PreloadRessourcePair'
import TilemapDefinition from './TilemapDefinition'
import Campaign_01_Room_001 from './Campaing_01_Room_001'

export default class Campaign_01_Room_002 extends GameplayScene
{
    public static readonly SceneName = "Campaign_01_Room_002"

    protected get mapName() { return "campaign_01_room_002_map" }

    protected get tilemapDefinitions() { return [ new TilemapDefinition("terrain", "floor", "tiles") ]}
    protected get collisionTilemapDefinition() { return new TilemapDefinition("collision", "collision", "collision_tiles")}

	constructor()
	{
        super(Campaign_01_Room_002.SceneName)
    }
    
    protected sceneSpecificUpdate(t: number, dt: number)
    {
        //
    }
}

