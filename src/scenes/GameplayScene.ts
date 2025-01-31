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
import { Mrpas } from 'mrpas'
import { HeightLayer } from '~/utilities/HeightLayer';
import { ScenePlayerProvider, SceneEnemyProvider, IEnemyProvider, IPlayerProvider, PlayerProviderCollection, EnemyProviderCollection, IProviderCollection } from '~/providers/EntityProvider';
import { IInputProvider, SceneInputProvider } from '~/providers/InputProvider';
import InitialPosition from '~/utilities/InitialPosition';
import { ILineOfSightProvider, SceneLineOfSightProvider } from '~/providers/LineOfSightProdiver'
import { DummySpawner, Spawner } from '~/entities/Spawner';

export default abstract class GameplayScene extends BaseScene
{
    private static readonly PlayerSpawnTag = "spawn_player"
    private static readonly EnemySpawnTag = "spawn_enemy"
    private static readonly EnemySpawnerTag = "enemy_spawner"
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
    protected spawners: Spawner[] = []
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
    protected readonly layers: Phaser.Tilemaps.TilemapLayer[] = []

    /**
     * Tilemap layer used for collisions with the map itself.
     */
    protected collisionLayer!: Phaser.Tilemaps.TilemapLayer

    /**
     * Tilemap layer used to determine the height of the playing field.
     */
    protected heightsLayer!: HeightLayer

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

    /**
     * Single tilemap definition for the heights layer.
     */
    protected abstract get heightTilemapDefition()

    protected navmeshLayer!: Phaser.Tilemaps.ObjectLayer

    protected objectivesLayer?: Phaser.Tilemaps.ObjectLayer

    private leftEntranceObjective = false

    private finishedInitialization = false

    private previousPlayerState: PlayerState[] = []
    
    public navigation!: Navigation

    public fov!: Mrpas

    private lastVisibilityCheck = 0
    private readonly visibilityCheckInterval = 333

    private playerProvider : IPlayerProvider = new ScenePlayerProvider(() => this.players)
    private enemyProvider : IEnemyProvider = new SceneEnemyProvider(() => this.enemies)
    private inputProvider = (playerIndex: number) => this.userInputs[playerIndex]
    private lineOfSightProvider : ILineOfSightProvider = new SceneLineOfSightProvider(this.computeLineOfSight.bind(this), this.computeTileVisibility.bind(this))
    private tileVisiblity : boolean[][] = []
    private playerProviderCollection! : IProviderCollection
    private enemyProviderCollection! : IProviderCollection

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
            this.playerProviderCollection = new PlayerProviderCollection(this.playerProvider, this.enemyProvider, this.lineOfSightProvider)
            this.enemyProviderCollection = new EnemyProviderCollection(this.playerProvider, this.enemyProvider, this.lineOfSightProvider)
            this.map = this.createMap(this.mapName)
            this.initVisibilityMap()
            this.collisionLayer = this.createCollisionTilemapLayer(this.map, this.collisionTilemapDefinition)!
            this.colliders = new ColliderCollection(this, 
                                                    this.collisionLayer, 
                                                    this.playerBulletHitsPlayer.bind(this),
                                                    this.playerBulletHitsEnemy.bind(this),
                                                    this.enemyBulletHitsEnemy.bind(this),
                                                    this.enemyBulletHitsPlayer.bind(this)
                                                    )
            this.heightsLayer = this.createHeightTilemapLayer(this.map, this.heightTilemapDefition)
            this.objectivesLayer = this.map.objects.find(l => l.name === GameplayScene.ObjectivesTag)
            this.navmeshLayer = this.map.getObjectLayer("navmesh")!
            this.navigation = new Navigation(this.navMesh.buildMeshFromTiled("mesh", this.navmeshLayer, 16))
            this.tilemapDefinitions.forEach(def => this.layers.push(this.createTilemapLayer(this.map, def)!))
            this.createEntities(this.map.objects)
            this.userInputs.push(new KeyboardMouseInput(this, this.players[0]))
            this.fov = this.initFov(this.map)

            console.log(`map size (in pixels): ${this.map.widthInPixels}, ${this.map.heightInPixels}`)
            //this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
            this.cameras.main.setZoom(1.25)
            this.cameras.main.centerOn(this.map.widthInPixels / 2, this.map.heightInPixels / 2)
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
        for (let index = 0; index < playerStates.length; index++) {
            this.players[index].importState(playerStates[index])
        }
    }

    private initVisibilityMap()
    {
        for(let x = 0; x < this.map.width; x++)
        {
            const row : boolean[] = []
            for(let y = 0; y < this.map.height; y++)
            {
                row.push(false)
            }
            this.tileVisiblity.push(row)
        }
    }

    private initFov(map: Phaser.Tilemaps.Tilemap) : Mrpas
    {
        const fov = new Mrpas(map.width, map.height, (x, y) => {
            const pHeights = this.players.map(p => this.heightsLayer.getHeightAtWorldXY(p.x, p.y))
            const tHeight = this.heightsLayer.getHeight(x, y)
            const isLowerHeight = pHeights.some(p => p > tHeight)
            const isEqualHeight = pHeights.some(p => p === tHeight)
            const tile = this.collisionLayer.getTileAt(x, y)
            const isTransparent = tile === null || tile.index === -1

            if(isLowerHeight)
                return true
            else if(isEqualHeight)
                return isTransparent
            else
                return false
        })
        return fov
    }

    protected createCollisionCollection(environment: Phaser.Tilemaps.TilemapLayer, playerBulletHitsPlayer, playerBulletHitsEnemy, enemyBulletHitsEnemy, enemyBulletHitsPlayer)
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
        const enemySpawner = GameplayScene.EnemySpawnerTag
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
            else
            {
                const playerSpawnProperty = x.properties.find(p => p.value === playerSpawn)
                const enemySpawnProperty = x.properties.find(p => p.value === enemySpawn)
                const spawner = x.properties.find(p => p.value === enemySpawner)

                if(playerSpawnProperty) {
                    if(this.players.length < this.numberOfPlayers) {
                        const player = this.createPlayer(x.x, x.y, 0, this.players.length)
                        this.players.push(player);
                    }

                } else if(enemySpawnProperty) {
                    const properties = EnemyTiledObject.fromTileObject(x)
                    this.createEnemy(x.x, x.y, properties!.angle, EnemyTemplates[properties!.template])
                } else if(spawner) {
                    this.spawners.push(new DummySpawner(this, new InitialPosition(x.x, x.y, 0, 0), this.colliders.addEntityFunc, this.colliders.addProjectileFunc, this.playerProviderCollection));
                }
            }
        })
        this.previousPlayerState = []
    }

    private createPlayer(x, y, angle: number, index: number)
    {
        const data = this.registry.get(index.toString()) as PrefitTank

        const tank = data.tank.instantiate()
        const player = new PlayerEntity(this, new InitialPosition(x, y, angle, 0), tank, this.colliders.addEntityFunc, this.colliders.addPlayerProjectileFunc, index, new SceneInputProvider(() => this.inputProvider(index)), this.playerProviderCollection)
        for(let i = 0; i < data.triggeredEquipment.length; i++)
        {
            const weapon = data.triggeredEquipment[i][0]()
            const group = data.triggeredEquipment[i][1]
            player.tank.hardpoints[i].equipment = asHardPointEquipment(weapon)
            player.tank.hardpoints[i].equipmentGroup = group
        }

        for(let i = 0; i < data.equipment.length; i++)
        {
            if(i + data.triggeredEquipment.length >= player.tank.hardpoints.length)
                console.warn("Tried to create a tank with more equipment than hardpoints. Skipping creating of", data.equipment[i])
            else
                player.tank.hardpoints[i + data.triggeredEquipment.length].equipment = asHardPointEquipment(data.equipment[i])
        }

        if(index === 0) {
            this.cameras.main.startFollow(player.body!)
        }

        this.createInterface(player, this.playerInterfaces)
        player.addKilledCallback(this.onPlayerKilled.bind(this))
        if(this.previousPlayerState.length !== 0)
            player.importState(this.previousPlayerState[this.players.length])
        return player
    }

    private createEnemy(x, y, angle, template: EnemyTemplate)
    {
        const enemy = template.instatiate(this, new InitialPosition(x, y, angle, 0), this.colliders.addEntityFunc, this.colliders.addProjectileFunc, this.enemyProviderCollection)
        this.attachEnemy(enemy);
    }

    /**
     * Adds all the necessary callbacks to an instantiated enemy so its lifecycle can be managed by this scene
     */
    private attachEnemy(enemy: Enemy)
    {
        enemy.addKilledCallback(x => this.removeEnemy(x as Enemy))
        enemy.addVisibilityChangedCallback((e, isVisible) => {
            if(!isVisible) {
                //TODO: should one remove the callback?
                const marker = new EnemyMarker(this, e.x, e.y, e)
                e.addKilledCallback(_ => marker.destroy(true))
                e.addVisibilityChangedCallback(_ => marker.destroy(true))
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
            this.players[i].update(t, dt)

        this.enemies.forEach(x => x.update(t, dt))

        if(this.enemies.length === 0) {
            const spawnedEnemies = this.spawners.flatMap(x => x.nextWave())
            spawnedEnemies.forEach(x => this.attachEnemy(x));
        }

        this.updateProjectileVisibility(this.colliders.allProjectiles, this.players)

        this.updateTileVisibility(t, this.fov, this.players, this.layers.find(l => l.layer.name === "terrain")!, this.map)

        this.updateEnemyVisibility(this.layers.find(l => l.layer.name === "terrain")!, this.players, this.enemies)

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
        this.time.removeAllEvents()
        this.userInputs.forEach(i => i.deactivate());
        (this.scene.get(sceneName) as GameplayScene).resume(this.players.map(p => p.exportState()))
        this.scene.switch(sceneName)
    }

    protected computeLineOfSight(from: Phaser.Geom.Point, to: Phaser.Geom.Point)
    {
        const ray = new Phaser.Geom.Line(from.x, from.y, to.x, to.y)
        return this.computeWallIntersection(ray)
    }

    protected computeWallIntersection(ray: Phaser.Geom.Line)
    {
        const tiles = this.collisionLayer.getTilesWithinShape(ray)
        return tiles.every(t => t.index === -1)
    }

    protected computeTileVisibility(point: Phaser.Geom.Point)
    {
        const v = this.map.worldToTileXY(point.x, point.y)
        return this.tileVisiblity[v!.x][v!.y]
    }

    private updateProjectileVisibility(projectiles: Phaser.GameObjects.GameObject[], players: PlayerEntity[])
    {
        function check(players: PlayerEntity[], projectile: Phaser.GameObjects.GameObject, scene: GameplayScene) : boolean
        {
            const body = projectile.body as Phaser.Physics.Arcade.Body
            const projectileHeight = scene.heightsLayer.getHeightAtWorldXY(body.x, body.y)
            const playerIsHigherThanProjectile = players.map(p => scene.heightsLayer.getHeightAtWorldXY(p.x, p.y)).some(h => h > projectileHeight)
            if(playerIsHigherThanProjectile)
                return true
            const rays = players.map(p => new Phaser.Geom.Line(p.x, p.y, body.x, body.y))
            for(let i = 0; i < rays.length; i++)
                if(scene.computeWallIntersection(rays[i]))
                    return true
            return false
        }

        projectiles.forEach(p => (p as Projectile).visible = check(players, p, this))
    }

    private updateEnemyVisibility(layer: Phaser.Tilemaps.TilemapLayer, players: PlayerEntity[], enemies: Enemy[])
    {
        function check(enemy: Enemy, losCheck: (ray: Phaser.Geom.Line) => boolean) {
            const tile = layer.getTileAtWorldXY(enemy.x, enemy.y)
            if(tile !== null && tile !== undefined && tile.alpha === 1)
                return true
            const rays = players.map(p => new Phaser.Geom.Line(enemy.x, enemy.y, p.x, p.y))
            for(let i = 0; i < rays.length; i++)
                if(losCheck(rays[i]))
                    return true
            return false
        }

        const los = this.computeWallIntersection.bind(this)
        enemies.forEach(e => {
            const isVisible = check(e, los)
            if(isVisible != e.visible)
            {
                const xx = e.setVisible(isVisible)
            }
        })
    }

    private updateTileVisibility(t: number, fov: Mrpas, players: PlayerEntity[], layer: Phaser.Tilemaps.TilemapLayer, map: Phaser.Tilemaps.Tilemap)
    {
        const timePassed = t - this.lastVisibilityCheck
        if(timePassed < this.visibilityCheckInterval)
            return
        this.lastVisibilityCheck = t

        this.tileVisiblity.map((row) => row.map(r => r = false))

        for(let x = 0; x < map.width; x++) {
            for(let y = 0; y < map.height; y++) {
                const tile = layer.getTileAt(x, y)
                if(tile)
                    tile.alpha = 0.33
            }
        }
        players.forEach(p => {
            const tilePositon = this.map.worldToTileXY(p.x, p.y)
            fov.compute(tilePositon!.x, tilePositon!.y, Infinity, 
                (x, y) => {
                    const tile = layer.getTileAt(x, y)
                    if(tile)
                        return tile.alpha > 0.5
                    else
                        return false
                },
                (x, y) => {
                    const tile = layer.getTileAt(x, y)
                    if(tile)
                    {
                        tile.alpha = 1
                        this.tileVisiblity[x][y] = true
                    }
                }
            )
        })
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