import BaseScene from './BaseScene';
import PlayerEntity from '~/entities/Player';
import { Enemy, EnemyTemplate, LightFighter, EnemyTemplates } from '~/entities/Enemy';
import PlayerInput from '~/input/PlayerInput';
import { ColliderCollection } from './ColliderCollection';
import PlayerPlate from '~/interface/PlayerPlate';
import * as Weapon from '~/entities/Weapon';
import { Teams } from '~/entities/Teams';
import { Projectile } from '~/entities/Projectile';
import KeyboardMouseInput from '~/input/KeyboardMouseInput';
import TilemapDefinition from './TilemapDefinition';
import { Game } from 'phaser';
import EnemyTiledObject from '~/utilities/EnemyTiledObject';
import { DefaultFighterTemplate } from '~/entities/Ship';

export default abstract class GameplayScene extends BaseScene
{
    private static readonly PlayerSpawnTag = "spawn_player"
    private static readonly EnemySpawnTag = "spawn_enemy"
    private static readonly EnemyShipTypeTag = "ship_type"
    private static readonly EntitiesTag = "entities"
    private static readonly PathTag = "path"
    private static readonly ObjectivesTag = "objectives"
    private static readonly ObjectivesTargetTag = "target"

    /**
     * Contains all active PlayerEntity instances.
     * This collection is irrelevant for collision detection.
     */
    protected players: PlayerEntity[] = []
    /**
     * Contains the individual interface for the players.
     */
    protected playerInterfaces: PlayerPlate[] = []
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
    protected readonly layers: Phaser.Tilemaps.StaticTilemapLayer[] = []

    /**
     * Tilemap layer used for collisions with the map itself.
     */
    protected collisionLayer!: Phaser.Tilemaps.StaticTilemapLayer

    /**
     * Name of this map's ressource key.
     */
    protected abstract get mapName()

    /**
     * Contains the definitions of all tilesets required to render this map.
     */
    protected abstract get tilemapDefinitions() : TilemapDefinition[]

    /**
     * Single tilemap definition for the collision layer.
     */
    protected abstract get collisionTilemapDefinition()

    protected objectivesLayer?: Phaser.Tilemaps.ObjectLayer

    private leftEntranceObjective = false

    private finishedInitialization = false

    constructor(name: string)
    {
        super(name)
    }
    
    create()
    {
        this.leftEntranceObjective = false
        if(this.finishedInitialization === false)
        {
            console.log("Initializing a scene.")
            this.map = this.createMap(this.mapName)
            this.collisionLayer = this.createCollisionTilemapLayer(this.map, this.collisionTilemapDefinition)
            this.colliders = new ColliderCollection(this, 
                                                    this.collisionLayer, 
                                                    this.playerBulletHitsPlayer.bind(this),
                                                    this.playerBulletHitsEnemy.bind(this),
                                                    this.enemyBulletHitsEnemy.bind(this),
                                                    this.enemyBulletHitsPlayer.bind(this)
                                                    )
            this.objectivesLayer = this.map.objects.find(l => l.name === GameplayScene.ObjectivesTag)
            this.tilemapDefinitions.forEach(def => this.createTilemapLayer(this.map, def))
            this.createEntities(this.map.objects)
            //this.players.forEach(p => this.physics.add.collider(p, environmentCollisions))
            this.userInputs.push(new KeyboardMouseInput(this, this.players[0]))
        }
        this.finishedInitialization = true
    }

    protected createCollisionCollection(environment: Phaser.Tilemaps.StaticTilemapLayer, playerBulletHitsPlayer, playerBulletHitsEnemy, enemyBulletHitsEnemy, enemyBulletHitsPlayer)
    {
        return new ColliderCollection(this, 
            environment, 
            playerBulletHitsPlayer.bind(this),
            playerBulletHitsEnemy.bind(this),
            enemyBulletHitsEnemy.bind(this),
            enemyBulletHitsPlayer.bind(this)
            )
    }

    /**
     * Creates an interface plate for the given player. Will also add the new plate to `existingPlates`.
     * @param player The PlayerEntity which will be linked to this PlayerPlate instance. Is required to set the necessary callbacks.
     * @param existingPlates Array of already existing PlayerPlates. This is required to position the new plate accordingly.
     */
    protected createInterface(player: PlayerEntity, existingPlates: PlayerPlate[])
    {
        const originOffset = new Phaser.Math.Vector2(32, 998)
        const marginBetweenPlates = 50
        const indexOffset = existingPlates.length > 0 ? existingPlates[existingPlates.length - 1].end + marginBetweenPlates : 0 
        const plate = new PlayerPlate(this, originOffset.x + indexOffset, originOffset.y, player.shieldValue, player.hullValue, player.structureValue, player.heatValue, player.indexedEquipment)
        existingPlates.push(plate)
        return plate
    }

    private createMap(mapName: string)
    {
        var map = this.make.tilemap({ key: mapName })
        return map
    }

    protected createEntities(layers: Phaser.Tilemaps.ObjectLayer[])
    {
        const playerSpawn = GameplayScene.PlayerSpawnTag
        const enemySpawn = GameplayScene.EnemySpawnTag
        const layer = layers.find(x => x.name === GameplayScene.EntitiesTag)
        layer?.objects.forEach(x => { 
            if(x.type === playerSpawn) { 
                if(this.players.length < this.numberOfPlayers)
                    this.players.push(this.createPlayer(x.x, x.y, 0, undefined));
            }
            else if(x.type === enemySpawn) {
                const properties = EnemyTiledObject.fromTileObject(x)
                this.createEnemy(x.x, x.y, properties!.angle, EnemyTemplates[properties!.shipType])
            }
        })
    }

    private createPlayer(x, y, angle, template)
    {
        const ship = new DefaultFighterTemplate().instantiate()
        const player = new PlayerEntity(this, x, y, angle, ship, this.colliders.addEntityFunc)
        const laser1 = Weapon.LightLaser.instantiate(this, this.colliders.addProjectileFunc, Teams.Players, 0, 20)
        const laser2 = Weapon.LightLaser.instantiate(this, this.colliders.addProjectileFunc, Teams.Players, 0, -20)
        const laser3 = Weapon.LightLaser.instantiate(this, this.colliders.addProjectileFunc, Teams.Players, 20, 0)
        const fusionGun = Weapon.FusionGun.instantiate(this, this.colliders.addProjectileFunc, Teams.Players, 0, 0)
        player.primaryEquipmentGroup.push(laser1)
        player.primaryEquipmentGroup.push(laser2)
        player.primaryEquipmentGroup.push(laser3)
        player.tertiaryEquipmentGroup.push(fusionGun)
        this.createInterface(player, this.playerInterfaces)
        return player
    }

    private createEnemy(x, y, angle, template: EnemyTemplate)
    {
        const enemy = template.instatiate(this, x, y, angle, this.colliders.addEntityFunc, this.colliders.addProjectileFunc)
        enemy.addKilledCallback(x => this.removeEnemy(x as Enemy))
        this.enemies.push(enemy)
    }

    private removeEnemy(e: Enemy)
    {
        if(e === undefined) return
        this.enemies.forEach( (item, index) => {
            if(item === e) this.enemies.splice(index,1);
        }); 
        e.destroy()
    }

    update(t: number, dt: number)
    {
        const player = this.players[0]
        this.userInputs.forEach(x => x.update())

        const leftAxis = this.userInputs[0].leftAxis()
        player.setVelocity(leftAxis.horizontal * 200, leftAxis.vertical * 200)

        const rightAxis = this.userInputs[0].rightAxis()
        player.setAngle(rightAxis.direction) 

        player.update(t, dt, this.userInputs[0])

        if(this.mapName === "campaign_01_room_001_map")
        {
            console.log("update Room 1")
        }

        if(this.mapName === "campaign_01_room_002_map")
        {
            console.log("update Room 2")
        }

        this.enemies.forEach(x => x.update(t, dt, [ player ]))
        // overlap - physics!

        this.switchSceneIfOnObjective(this.players, this.objectivesLayer)

        this.sceneSpecificUpdate(t, dt)
    }

    private switchSceneIfOnObjective(players: PlayerEntity[], objectives: Phaser.Tilemaps.ObjectLayer | undefined)
    {
        const objective = this.arePlayersOnObjective(this.players, this.objectivesLayer)
        if(objective === undefined)
            this.leftEntranceObjective = true

        if(this.leftEntranceObjective)
        {
            if(objective !== undefined)
                this.switchScene(this.getTargetRoomFromObjective(objective))
        }
    }

    private arePlayersOnObjective(players: PlayerEntity[], objectives: Phaser.Tilemaps.ObjectLayer | undefined) : Phaser.Types.Tilemaps.TiledObject | undefined
    {
        if(objectives === undefined)
            return undefined
        const exits = this.objectivesLayer?.objects.filter(o => o.type === "objectives_change_room") ?? []
        const exitWithPlayers = exits.find(e => {
            const rectangle = new Phaser.Geom.Rectangle(e.x, e.y, e.width, e.height)
            return this.players.every(p => rectangle.contains(p.x, p.y))
        })
        return exitWithPlayers
    }

    private getTargetRoomFromObjective(object: Phaser.Types.Tilemaps.TiledObject)
    {
        if(object.properties === undefined || object.properties!.length === 0)
            return
        
        return object.properties.find(p => p.name === GameplayScene.ObjectivesTargetTag).value as string
    }

    protected switchScene(sceneName)
    {
        console.log(`Changing room to '${sceneName}'.`)
        this.scene.start(sceneName, this.players)
    }

    public computeWallIntersection(ray: Phaser.Geom.Line)
    {
        const tiles = this.collisionLayer.getTilesWithinShape(ray)
        return tiles.every(t => t.index === -1)
    }

    protected abstract sceneSpecificUpdate(t: number, dt: number)

    private playerBulletHitsPlayer(bullet, target)
    {
        const p = bullet as Projectile
        p.scaleDamage(0.33)
        p?.hit(target)
    }

    private playerBulletHitsEnemy(bullet, target)
    {
        const p = bullet as Projectile
        p?.hit(target)
    }

    private enemyBulletHitsPlayer(bullet, target)
    {
        const p = bullet as Projectile
        p?.hit(target)
    }

    private enemyBulletHitsEnemy(bullet, target)
    {
        const p = bullet as Projectile
        p?.hit(target)
    }
}