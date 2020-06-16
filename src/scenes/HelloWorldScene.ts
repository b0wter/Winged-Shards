import Phaser from 'phaser'
import Preloader from './Preloader'
import KeyboardMouseInput from './../input/KeyboardMouseInput'
import PlayerInput from './../input/PlayerInput'
import PlayerEntity from './../entities/Player'
import * as Projectile from '~/entities/Projectile'
import { Teams } from './../entities/Teams'
import * as Weapon from './../entities/Weapon'
import { Enemy } from '~/entities/Enemy'
import HullBar from '../interface/HullBar'
import ShieldBar from '../interface/ShieldBar'
import StructureBar from '../interface/StructureBar'
import HeatBar from '~/interface/HeatBar'
import PlayerPlate from '~/interface/PlayerPlate'

export default class HelloWorldScene extends Phaser.Scene
{
    readonly plattforms = [];
    private map!: Phaser.Tilemaps.Tilemap
    private player!: PlayerEntity
    private environmentCollisions!: Phaser.Tilemaps.StaticTilemapLayer
    private stage!: Phaser.Tilemaps.StaticTilemapLayer
    private playerBulletsGroup?: Phaser.Physics.Arcade.Group
    private playersGroup?: Phaser.Physics.Arcade.Group
    private enemyBulletsGroup?: Phaser.Physics.Arcade.Group
    private enemiesGroup?: Phaser.Physics.Arcade.Group
    private enemies: Enemy[] = []
    private explosion?: Phaser.Animations.Animation

    private userInput!: PlayerInput

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
        this.load.spritesheet('explosion_small', 'images/effects/explosion-small.png', { frameWidth: 46, frameHeight: 46})
        this.load.tilemapTiledJSON('map', 'maps/test.json')
    }

    create()
    {
        this.explosion = this.createExplisionAnimation()

        this.map = this.createMap()
        this.playersGroup = this.physics.add.group({ classType: PlayerEntity, runChildUpdate: true, collideWorldBounds: true})
        this.playerBulletsGroup = this.physics.add.group({ classType: Projectile.Projectile, runChildUpdate: true, collideWorldBounds: true})
        this.enemiesGroup = this.physics.add.group({ classType: Enemy, runChildUpdate: true, collideWorldBounds: true})
        this.enemyBulletsGroup = this.physics.add.group({ classType: Projectile.Projectile, runChildUpdate: true, collideWorldBounds: true})
        this.environmentCollisions = this.createCollisionTileset(this.map);
        this.stage = this.createTilesets(this.map)

        this.player = this.createPlayer();
        this.playersGroup.add(this.player)
        this.physics.add.collider(this.player, this.environmentCollisions)

        const enemy = this.createEnemy()
        this.enemies.push(enemy)
        this.physics.add.collider(enemy, this.environmentCollisions)

        this.userInput = new KeyboardMouseInput(this, this.player)

        this.physics.add.collider(this.playerBulletsGroup, this.environmentCollisions, (a, _) => { this.playerBulletsGroup?.remove(a); a.destroy()})
        this.physics.add.collider(this.enemyBulletsGroup, this.environmentCollisions, (a, _) => { this.enemyBulletsGroup?.remove(a); a.destroy()})

        this.physics.add.collider(this.playerBulletsGroup, this.enemiesGroup, this.playerBulletHitsEnemy)
        this.physics.add.collider(this.playerBulletsGroup, this.playersGroup, (bullet, enemy) => console.log('friendly fire players'))
        this.physics.add.collider(this.enemyBulletsGroup, this.playersGroup, (bullet, player) => console.log('player hit'))
        this.physics.add.collider(this.enemyBulletsGroup, this.enemiesGroup, (bullet, enemy) => console.log('friendly fire enemies'))
        this.physics.add.collider(this.playersGroup, this.enemiesGroup, (player, enemy) => console.log('Player and enemy collided.'))

        this.createInterface(this.player)
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

    private createPlayer()
    {
        const player = new PlayerEntity(this, 400, 250, 'spaceship_01', undefined)
        //player.mainSprite.setCollideWorldBounds(true)
        const weapon = Weapon.fromTemplate(this, this.playerBulletsGroup, Teams.Players, Weapon.LightLaser)
        player.primaryEquipmentGroup.push(weapon)
        return player
    }

    private createEnemy()
    {
        const enemy = new Enemy(this, 400, 700, 'spaceship_02', 0, this.enemiesGroup, 40, 20, 10)
        return enemy
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
        /*
        const shieldbar = new ShieldBar(this, 5, 5, 500, 0, 200, 180)
        const hullbar = new HullBar(this, 5, 5 + shieldbar.y + shieldbar.height / 2, shieldbar.width, 0, 200, -1)
        const structurebar = new StructureBar(this, 5, 5 + hullbar.y + hullbar.height / 2, shieldbar.width, 0, 200, 100)
        this.add.existing(shieldbar)
        this.add.existing(hullbar)
        this.add.existing(structurebar)

        const heatbar = new HeatBar(this, shieldbar.x + 5 + shieldbar.width * 0.5, 5, (shieldbar.height + hullbar.height + structurebar.height) + 20, 0, 60, 30)
        this.add.existing(heatbar)
        */
    }

    update(t: number, dt: number)
    {
        this.userInput.update()

        const leftAxis = this.userInput.leftAxis()
        this.player.setVelocity(leftAxis.horizontal * 200, leftAxis.vertical * 200)

        const rightAxis = this.userInput.rightAxis()
        this.player.setAngle(rightAxis.direction) 

        this.player.update(t, dt, this.userInput)

        if (this.userInput.action1.firstFrameDown) {
            this.explode(this.player.x, this.player.y)
        }

        if (this.userInput.action2.firstFrameDown) {
        }

        this.enemies.forEach(x => x.update(t, dt, [ this.player ]))
        // overlap - physics!
    }

    private playerBulletHitsEnemy(bullet, target)
    {
        console.log('enemy hit')
        const projectile = bullet as Projectile.Projectile
        const enemy = target as Enemy
        enemy.takeDamage(projectile.damage)
        this.playerBulletsGroup?.remove(bullet)
        bullet.destroy()
    }

    public computeWallIntersection(ray: Phaser.Geom.Line)
    {
        return false;
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
    }
}
