import BaseScene from './BaseScene';
import PlayerEntity from '~/entities/Player';
import { Enemy } from '~/entities/Enemy';
import PlayerInput from '~/input/PlayerInput';
import { ColliderCollection } from './ColliderCollection';

export default class GameplayScene extends BaseScene
{
    /**
     * Contains all active PlayerEntity instances.
     * This collection is irrelevant for collision detection.
     */
    protected players: PlayerEntity[] = []
    /**
     * Contains all active Enemy instances.
     * This collection is irrelevant for collision detection.
     */
    protected enemies: Enemy[] = []
    protected userInputs: PlayerInput[] = []
    /**
     * Number of active players. Sets the number of spawned PlayerEntities.
     * Must not exceed 3 and should not be less than one.
     */
    protected numberOfPlayers = 1
    /**
     * Handles all collision interaction.
     */
    protected colliders!: ColliderCollection
    /**
     * The complete tilemap. Contains all layers (inclusing object layers).
     */
    protected map!: Phaser.Tilemaps.Tilemap
    /**
     * Main layer of this level's tilemap.
     */
    protected baseLayer!: Phaser.Tilemaps.StaticTilemapLayer

    constructor(name: string)
    {
        super(name)
    }
}