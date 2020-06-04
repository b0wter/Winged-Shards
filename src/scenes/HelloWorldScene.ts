import Phaser from 'phaser'
import Preloader from './Preloader'
import KeyboardMouseInput from './../input/KeyboardMouseInput'
import PlayerInput from './../input/PlayerInput'

export default class HelloWorldScene extends Phaser.Scene
{
    readonly plattforms = [];
    private map!: Phaser.Tilemaps.Tilemap
    private player!: Phaser.Physics.Arcade.Sprite
    private collisions!: Phaser.Tilemaps.StaticTilemapLayer
    private stage!: Phaser.Tilemaps.StaticTilemapLayer

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
        this.load.image('spaceship_01', 'images/orange_01.png')
        this.load.tilemapTiledJSON('map', 'maps/test.json')
    }

    create()
    {
        this.map = this.createMap()
        this.collisions = this.createCollisionTileset(this.map);
        this.stage = this.createTilesets(this.map)
        this.player = this.createPlayer();
        this.physics.add.collider(this.player, this.collisions)
        this.userInput = new KeyboardMouseInput(this, this.player)
    }

    private createPlayer()
    {
        var player = this.physics.add.sprite(400, 250, 'spaceship_01')
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
    }
}
