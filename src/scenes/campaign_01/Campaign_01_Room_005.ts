import GameplayScene from './../GameplayScene'
import TilemapDefinition from './../TilemapDefinition'

export default class Campaign_01_Room_005 extends GameplayScene
{
    public static readonly SceneName = "Campaign_01_Room_005"

    protected get mapName() { return "campaign_01_room_005_map" }

    protected get tilemapDefinitions() { return [ new TilemapDefinition("terrain", "floor", "tiles") ]}
    protected get collisionTilemapDefinition() { return new TilemapDefinition("collision", "collision", "collision_tiles")}
    protected get heightTilemapDefition() { return new TilemapDefinition("height", "heights", "heights")}

	constructor()
	{
        super(Campaign_01_Room_005.SceneName)
    }
    
    protected sceneSpecificUpdate(t: number, dt: number)
    {
        //
    }

}
