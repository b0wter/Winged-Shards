import BaseScene from './BaseScene';
import { PlayerEntity, PlayerState } from '~/entities/Player';
import { Enemy } from '~/entities/Enemy';
import PlayerInput from '~/input/PlayerInput';
import { ColliderCollection } from './ColliderCollection';
import PlayerPlate from '~/interface/PlayerPlate';
import * as Weapons from '~/entities/templates/Weapons';
import { Teams } from '~/entities/Teams';
import { Projectile } from '~/entities/Projectile';
import KeyboardMouseInput from '~/input/KeyboardMouseInput';
import TilemapDefinition from './TilemapDefinition';
import EnemyTiledObject from '~/utilities/EnemyTiledObject';
import { MediumTankTemplate, LightHoverTankTemplate, HoverScoutTemplate, SupportHoverTankTemplate, MediumTank } from '~/entities/templates/Tanks';
import { asHardPointEquipment } from '~/entities/Hardpoint';
import { SmallShieldGenerator } from '~/entities/templates/ShieldGenerators';
import { Navigation } from '~/utilities/Navigation';
import PhysicalEntity from '~/entities/PhysicalEntity';
import { EnemyTemplates, EnemyTemplate } from '~/entities/templates/Enemies';
import { PrefitTank } from '~/entities/templates/PrefitTanks';
import { WeaponTemplate } from '~/entities/Weapon';
import { Equipment } from '~/entities/Equipment';
import { DefeatScene } from './DefeatScene';
import { EnemyMarker } from '~/entities/EnemyMarker';

export default abstract class GameplayScene extends BaseScene
{
    private static readonly PlayerSpawnTag = "spawn_player"
    private static readonly EnemySpawnTag = "spawn_enemy"
    private static readonly EntitiesTag = "entities"
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

    protected navmeshLayer!: Phaser.Tilemaps.ObjectLayer

    protected objectivesLayer?: Phaser.Tilemaps.ObjectLayer

    private leftEntranceObjective = false

    private finishedInitialization = false

    private previousPlayerState: PlayerState[] = []
    
    public navigation!: Navigation

    private enemyMarkers: EnemyMarker[] = []

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
            this.events.on("resume", this.resume)
            this.events.on("pause", () => console.log("paused"))
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
            this.navmeshLayer = this.map.getObjectLayer("navmesh")
            this.navigation = new Navigation(this.navMesh.buildMeshFromTiled("mesh", this.navmeshLayer, 64))
            this.tilemapDefinitions.forEach(def => this.createTilemapLayer(this.map, def))
            this.createEntities(this.map.objects)
            this.userInputs.push(new KeyboardMouseInput(this, this.players[0]))
        }
        this.finishedInitialization = true
    }

    resume(playerStates? : PlayerState[])
    {
        console.log("Resuming a previous scene.")
        this.userInputs.forEach(i => i.activate())

        if(this.players.length === 0) {
            this.previousPlayerState = playerStates ?? []
            return
        } else {
            this.previousPlayerState = []
        }
        if(playerStates === undefined) {
            return
        }
        console.log(playerStates, this.players)
        for (let index = 0; index < playerStates.length; index++) {
            this.players[index].importState(playerStates[index])
        }
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

    protected createEntities(layers: Phaser.Tilemaps.ObjectLayer[])
    {
        const playerSpawn = GameplayScene.PlayerSpawnTag
        const enemySpawn = GameplayScene.EnemySpawnTag
        const layer = layers.find(x => x.name === GameplayScene.EntitiesTag)
        layer?.objects.forEach(x => { 
            if(x.type === playerSpawn) { 
                if(this.players.length < this.numberOfPlayers)
                    this.players.push(this.createPlayer(x.x, x.y, 0, this.players.length));
            }
            else if(x.type === enemySpawn) {
                const properties = EnemyTiledObject.fromTileObject(x)
                this.createEnemy(x.x, x.y, properties!.angle, EnemyTemplates[properties!.template])
            }
        })
        this.previousPlayerState = []
    }

    private createPlayer(x, y, angle: number, index: number)
    {
        const data = this.registry.get(index.toString()) as PrefitTank

        const tank = data.tank.instantiate()  //new MediumTankTemplate().instantiate()
        const player = new PlayerEntity(this, x, y, angle, tank, this.colliders.addEntityFunc)
        for(let i = 0; i < data.equipment.length; i++)
        {
            const current = data.equipment[i]
            if((current as WeaponTemplate).projectile !== undefined)
            {
                const weapon = current as WeaponTemplate
                player.tank.hardpoints[i].equipment = asHardPointEquipment(weapon.instantiate(this, this.colliders.addProjectileFunc, Teams.Players))
                player.tank.hardpoints[i].equipmentGroup = i
            }
            else
            {
                const eq = current as Equipment
                player.tank.hardpoints[i].equipment = asHardPointEquipment(eq)
            }
        }
        this.createInterface(player, this.playerInterfaces)
        player.addKilledCallback(this.onPlayerKilled.bind(this))
        if(this.previousPlayerState.length !== 0)
            player.importState(this.previousPlayerState[this.players.length])
        return player
    }

    private createEnemy(x, y, angle, template: EnemyTemplate)
    {
        const enemy = template.instatiate(this, x, y, angle, this.colliders.addEntityFunc, this.colliders.addProjectileFunc)
        enemy.addKilledCallback(x => this.removeEnemy(x as Enemy))
        enemy.addVisibilityChangedCallback((e, isVisible) => {
            if(!isVisible) {
                //TODO: should one remove the callback?
                const marker = new EnemyMarker(this, e.x, e.y, e)
                e.addKilledCallback(_ => marker.destroy(true))
                this.add.existing(marker)
            }
        })
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
        this.userInputs.forEach(x => x.update())
        for(let i = 0; i < this.players.length; i++)
            this.players[i].update(t, dt, this.userInputs[i])

        this.enemies.forEach(x => x.update(t, dt, this.players))

        this.switchSceneIfOnObjective(this.players, this.objectivesLayer)
        this.sceneSpecificUpdate(t, dt)
    }

    private switchSceneIfOnObjective(players: PlayerEntity[], objectives: Phaser.Tilemaps.ObjectLayer | undefined)
    {
        const objective = this.arePlayersOnObjective(players, objectives)
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
        if(objectives === undefined || players.length === 0)
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
        this.leftEntranceObjective = false
        this.userInputs.forEach(i => i.deactivate());
        (this.scene.get(sceneName) as GameplayScene).resume(this.players.map(p => p.exportState()))
        this.scene.switch(sceneName)
    }

    public computeWallIntersection(ray: Phaser.Geom.Line)
    {
        const tiles = this.collisionLayer.getTilesWithinShape(ray)
        return tiles.every(t => t.index === -1)
    }

    private onPlayerKilled(p: PhysicalEntity)
    {
        const player = p as PlayerEntity
        this.players.forEach( (item, index) => {
            if(item === player) this.players.splice(index,1);
        });
        if(this.players.length === 0)
        {
            this.cameras.main.fadeOut(2500, 0, 0, 0, (_, progress) => { if(progress >= 0.9999) { 
                this.scene.stop()
                this.scene.start(DefeatScene.SceneName)
            }})
        }
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