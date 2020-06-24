import Phaser from 'phaser'
import Preloader from './Preloader'
import KeyboardMouseInput from './../input/KeyboardMouseInput'
import PlayerInput from './../input/PlayerInput'
import PlayerEntity from './../entities/Player'
import * as Projectile from '~/entities/Projectile'
import { Teams } from './../entities/Teams'
import * as Weapon from './../entities/Weapon'
import { Enemy, LightFighter as EnemyLightFighter } from '~/entities/Enemy'
import HullBar from '../interface/HullBar'
import ShieldBar from '../interface/ShieldBar'
import StructureBar from '../interface/StructureBar'
import HeatBar from '~/interface/HeatBar'
import PlayerPlate from '~/interface/PlayerPlate'
import { ColliderCollection, AddPlayerFunc, AddEnemyFunc } from './ColliderCollection'
import BaseScene from './BaseScene'
import GameplayScene from './GameplayScene'

export default class HelloWorldScene extends GameplayScene
{
	constructor()
	{
        super('hello-world')
	}

	preload()
    {
        this.load.setBaseURL('http://localhost:8000')

        this.load.image('tiles', 'images/tilesets/dungeon.png')
        this.load.image('collision_tiles', 'images/tilesets/collision.png')
        this.load.image('spaceship_01', 'images/ships/orange_01.png')
        this.load.image('spaceship_02', 'images/ships/red_01.png')
        this.load.image('projectile_01', 'images/projectiles/projectile-green.png')
        this.load.image('shield_regular', 'images/equipment/shield_regular.png')
        this.load.image('shield_circular', 'images/equipment/shield_circular_irregular_small.png')
        this.load.image('debris', 'images/effects/debris.png')
        this.load.image('particle_blue', 'images/effects/particle-blue.png')
        this.load.image('particle_red', 'images/effects/particle-red.png')
        this.load.image('fusion_01', 'images/projectiles/fusion-01.png')
        this.load.spritesheet('explosion_small', 'images/effects/explosion-small.png', { frameWidth: 46, frameHeight: 46})
        this.load.tilemapTiledJSON('map', 'maps/test.json')
    }

    create()
    {
        this.map = this.createMap()
        const environmentCollisions = this.createCollisionTileset(this.map)
        this.colliders = new ColliderCollection(this, 
                                                environmentCollisions, 
                                                this.playerBulletHitsPlayer.bind(this),
                                                this.playerBulletHitsEnemy.bind(this),
                                                this.enemyBulletHitsEnemy.bind(this),
                                                this.enemyBulletHitsPlayer.bind(this)
                                                )
        this.baseLayer = this.createTilesets(this.map)
        this.createEntities(this.map.objects)
        this.players.forEach(p => this.physics.add.collider(p, environmentCollisions))
        this.userInputs.push(new KeyboardMouseInput(this, this.players[0]))
    }

    private createEntities(layers: Phaser.Tilemaps.ObjectLayer[])
    {
        const playerSpawn = "spawn_player"
        const enemySpawn = "spawn_enemy"
        const layer = layers.find(x => x.name === "entities")
        layer?.objects.forEach(x => { 
            if(x.type === playerSpawn) { 
                if(this.players.length < this.numberOfPlayers)
                    this.players.push(this.createPlayer(x.x, x.y, x.properties?.find(p => p.name === "angle").value ?? 0));
            }
            else if(x.type === enemySpawn) {
                this.createEnemy(x.x, x.y, x.properties?.find(p => p.name === "angle").value ?? 0)
            }
        })
    }

    private createExplisionAnimation()
    {
        const frameNumbers = this.anims.generateFrameNumbers('explosion_small', { start: 0, end: 10 })
        const animation = this.anims.create({ key: 'explode', frames: frameNumbers, frameRate: 4, repeat: 0, hideOnComplete: true})
        return (animation as Phaser.Animations.Animation)
    }

    private explode(x, y)
    {
        const particles = this.add.particles('particle_blue')
        const emitter = particles.createEmitter({ lifespan: (a) => Math.random()*750})
        emitter.setPosition(x, y)
        emitter.setSpeed(150)
        emitter.setAlpha((p, k, t) => Math.sqrt(1 - t)) //1 - t)
        emitter.stop()
        emitter.explode(20, x, y)
        setTimeout(() => emitter.remove(), 750)
    }

    private createPlayer(x, y, angle)
    {
        const player = new PlayerEntity(this, x, y, angle, 'spaceship_01', this.colliders.addEntityFunc)
        const weapon = Weapon.LightLaser.instantiate(this, this.colliders.addProjectileFunc, Teams.Players, 0, 0)
        const fusionGun = Weapon.FusionGun.instantiate(this, this.colliders.addProjectileFunc, Teams.Players, 0, 0)
        player.primaryEquipmentGroup.push(weapon)
        player.secondaryEquipmentGroup.push(fusionGun)
        this.createInterface(player)
        return player
    }

    private createEnemy(x, y, angle)
    {
        const enemy = EnemyLightFighter.instatiate(this, x, y, angle, this.colliders.addEntityFunc, this.colliders.addProjectileFunc)
        enemy.addKilledCallback(x => this.removeEnemy(x as Enemy))
        this.enemies.push(enemy)
    }

    private removeEnemy(e: Enemy)
    {
        if(e === undefined) return
        this.enemies.forEach( (item, index) => {
            if(item === e) this.enemies.splice(index,1);
        }); 
    }

    private createMap()
    {
        var map = this.make.tilemap({ key: 'map' })
        return map
    }

    private createCollisionTileset(map)
    {
        const collision_tileset = this.map.addTilesetImage('collision', 'collision_tiles')
        const collisions = this.map.createStaticLayer('collision', collision_tileset, 0, 0)
        collisions.setCollisionByExclusion([-1], true)
        return collisions
    }

    private createTilesets(map)
    {
        const tileset = this.map.addTilesetImage('dungeon', 'tiles')
        const plattforms = this.map.createStaticLayer('base_layer', tileset, 0, 0)
        return plattforms
    }

    private createInterface(player: PlayerEntity)
    {
        const player1 = new PlayerPlate(this, 5, 5, player.shieldValue, player.hullValue, player.structureValue, player.heatValue)
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

        this.enemies.forEach(x => x.update(t, dt, [ player ]))
        // overlap - physics!
    }

    private playerBulletHitsPlayer(bullet, target)
    {
        const p = bullet as Projectile.Projectile
        p.scaleDamage(0.33)
        p?.hit(target)
    }

    private playerBulletHitsEnemy(bullet, target)
    {
        const p = bullet as Projectile.Projectile
        p?.hit(target)
    }

    private enemyBulletHitsPlayer(bullet, target)
    {
        const p = bullet as Projectile.Projectile
        p?.hit(target)
    }

    private enemyBulletHitsEnemy(bullet, target)
    {
        const p = bullet as Projectile.Projectile
        p?.hit(target)
    }

    public computeWallIntersection(ray: Phaser.Geom.Line)
    {
        //const collider = this.physics.add.collider(ray, this.environmentCollisions)
        return true
        // getTilesWithinShape() <-----------


        /*
        const start = ray.getPointA()
        const end = ray.getPointB()
        const tileSize = this.map.tileHeight
        const tileDiagonal = Math.sqrt(tileSize * tileSize)
        const angle = Phaser.Math.Angle.BetweenPoints(start, end)
        let remainingDistance = Phaser.Math.Distance.BetweenPoints(start, end)
        const step = new Phaser.Math.Vector2(tileDiagonal * Math.cos(angle * Phaser.Math.DEG_TO_RAD), tileDiagonal * Math.sin(angle * Phaser.Math.DEG_TO_RAD))

        let breaker = 0
        let current = ray.getPointA()
        do
        {
            const tile = this.map.getTileAtWorldXY(current.x, current.y, true)
            current = current.add(step)
            remainingDistance = Phaser.Math.Distance.BetweenPoints(current, ray.getPointB())
            breaker++
            if(breaker >= 1000){
                console.log('breaker triggered for ray test')
                return false
            }
        }
        while(remainingDistance > 0)
        console.log(breaker)
        return false
        */
    }
}
