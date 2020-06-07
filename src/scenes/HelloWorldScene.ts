import Phaser from 'phaser'
import Preloader from './Preloader'
import KeyboardMouseInput from './../input/KeyboardMouseInput'
import PlayerInput from './../input/PlayerInput'
import PlayerEntity from './../entities/Player'
import * as Projectile from '~/entities/Projectile'
import { Teams } from './../entities/Teams'

export default class HelloWorldScene extends Phaser.Scene
{
    readonly plattforms = [];
    private map!: Phaser.Tilemaps.Tilemap
    private player!: PlayerEntity
    private environmentCollisions!: Phaser.Tilemaps.StaticTilemapLayer
    private stage!: Phaser.Tilemaps.StaticTilemapLayer
    private enemyProjectiles = []
    private playerProjectiles = []
    private enemies = []
    private bulletsGroup?: Phaser.Physics.Arcade.Group

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
        this.load.image('projectile_01', 'images/projectiles/projectile-green.png')
        this.load.tilemapTiledJSON('map', 'maps/test.json')
    }

    create()
    {
        this.map = this.createMap()
        this.bulletsGroup = this.physics.add.group({ classType: Projectile.Projectile, runChildUpdate: true, collideWorldBounds: true})
        this.environmentCollisions = this.createCollisionTileset(this.map);
        this.stage = this.createTilesets(this.map)
        this.player = this.createPlayer();
        this.physics.add.collider(this.player, this.environmentCollisions)
        this.userInput = new KeyboardMouseInput(this, this.player)
        this.physics.add.collider(this.bulletsGroup, this.environmentCollisions, (a, _) => { a.destroy()})
    }

    private createPlayer()
    {
        const player = new PlayerEntity(this, 400, 250, 'spaceship_01', undefined)
        player.setBounce(0.1)
        player.setCollideWorldBounds(true)
        return player
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

        if(this.userInput.bumperLeft().firstFrameDown)
            this.createShot(this.player.x, this.player.y, this.player.angle)

        // overlap - physics!
    }

    private createShot(x, y, angle)
    {
        var shot = Projectile.fromTemplate(this, x, y, Teams.Players, angle, Projectile.LightLaserTemplate, this.bulletsGroup)
    }
}
