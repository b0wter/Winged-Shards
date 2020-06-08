import Phaser from 'phaser'
import Preloader from './Preloader'
import KeyboardMouseInput from './../input/KeyboardMouseInput'
import PlayerInput from './../input/PlayerInput'
import PlayerEntity from './../entities/Player'
import * as Projectile from '~/entities/Projectile'
import { Teams } from './../entities/Teams'
import * as Weapon from './../entities/Weapon'
import { Enemy } from '~/entities/Enemy'

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
        this.load.tilemapTiledJSON('map', 'maps/test.json')
    }

    create()
    {
        this.map = this.createMap()
        this.playersGroup = this.physics.add.group({ classType: PlayerEntity, runChildUpdate: true, collideWorldBounds: true})
        this.playerBulletsGroup = this.physics.add.group({ classType: Projectile.Projectile, runChildUpdate: true, collideWorldBounds: true})
        this.enemiesGroup = this.physics.add.group({ classType: Enemy, runChildUpdate: true, collideWorldBounds: true})
        this.enemyBulletsGroup = this.physics.add.group({ classType: Projectile.Projectile, runChildUpdate: true, collideWorldBounds: true})
        this.environmentCollisions = this.createCollisionTileset(this.map);
        this.stage = this.createTilesets(this.map)

        this.player = this.createPlayer();
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
    }

    private createPlayer()
    {
        const player = new PlayerEntity(this, 400, 250, 'spaceship_01', undefined)
        player.setBounce(0.1)
        player.setCollideWorldBounds(true)
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
        // Ist das erforderlich? Ist ja embedded?
        const tileset = this.map.addTilesetImage('dungeon', 'tiles')
        const plattforms = this.map.createStaticLayer('base_layer', tileset, 0, 0)
        return plattforms
    }

    update(t: number, dt: number)
    {
        const leftAxis = this.userInput.leftAxis()
        this.player.setVelocityX(leftAxis.horizontal * 200)
        this.player.setVelocityY(leftAxis.vertical * 200)

        const rightAxis = this.userInput.rightAxis()
        this.player.setAngle(rightAxis.direction) 

        this.player.update(t, dt, this.userInput)

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
}
