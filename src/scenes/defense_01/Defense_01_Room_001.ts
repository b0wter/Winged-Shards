import GameplayScene from '../GameplayScene'
import TilemapDefinition from '../TilemapDefinition'

export default class Defense_01_Room_001 extends GameplayScene
{
    public static readonly SceneName = "Defense_01_Room_001"

    protected get mapName() { return "defense_01_room_001_map" }

    protected get tilemapDefinitions() { return [ new TilemapDefinition("terrain", "floor", "tiles") ]}
    protected get collisionTilemapDefinition() { return new TilemapDefinition("collision", "collision", "collision_tiles")}
    protected get heightTilemapDefition() { return new TilemapDefinition("height", "heights", "heights")}

	constructor()
	{
        super(Defense_01_Room_001.SceneName)
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

