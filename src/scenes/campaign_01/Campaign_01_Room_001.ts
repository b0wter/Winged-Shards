import GameplayScene from './../GameplayScene'
import TilemapDefinition from './../TilemapDefinition'

export default class Campaign_01_Room_001 extends GameplayScene
{
    public static readonly SceneName = "Campaign_01_Room_001"

    protected get mapName() { return "campaign_01_room_001_map" }

    protected get tilemapDefinitions() { return [ new TilemapDefinition("terrain", "floor", "tiles") ]}
    protected get collisionTilemapDefinition() { return new TilemapDefinition("collision", "collision", "collision_tiles")}
    protected get heightTilemapDefition() { return new TilemapDefinition("height", "heights", "heights")}

	constructor()
	{
        super(Campaign_01_Room_001.SceneName)
    }

    create()
    {
        super.create()
        this.cameras.main.fadeIn(1000, 0, 0, 0)
    }

    protected sceneSpecificUpdate(t: number, dt: number)
    {
        //
    }
}

