import Phaser from 'phaser'
import HorizontalStatusBar from '~/interface/HorizontalStatusBar'
import FullscreenStatusBar from '~/interface/FullscreenProgressBar'
import Color = Phaser.Display.Color
import ShieldBar from '~/interface/ShieldBar'

export class PreloadScene extends Phaser.Scene
{
    private graphics!: Phaser.GameObjects.Graphics
    private progressBar!: HorizontalStatusBar
    private width!: number
    private height!: number

    constructor()
    {
        super("preload")
    }

    create()
    {
        let { width, height } = this.sys.game.canvas;
        this.width = width
        this.height = height
    }

    preload()
    {
        this.initProgressBar()
        this.load.on("progress", this.progress.bind(this))
        this.load.on("complete", this.complete.bind(this))
        this.preloadRessources()
    }

    preloadRessources()
    {
        console.log("Starting preloading of ressources.")
        this.load.image('tiles', 'images/tilesets/scifi_floor.png')
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
        this.load.tilemapTiledJSON('campaign_01_room_002_map', 'maps/campaign_01_room_002.json')
        this.load.image('tiles', 'images/tilesets/scifi_floor.png')
        this.load.tilemapTiledJSON('defeat', 'maps/defeat.json')
    }

    initProgressBar()
    {
        console.log("Initializing progress bar.")
        this.progressBar = new FullscreenStatusBar(this, this.cameras.main.centerX, this.cameras.main.centerY, 1920 * 0.8, 200, 4, new Color(200, 200, 200), new Color(150, 150, 150), new Color(50, 50, 50))
        this.progressBar.draw()
        console.log(this.progressBar)
    }

    progress(percentage: number)
    {
        console.log("Updating progress.", this.progressBar)
        this.progressBar.current = percentage
        this.progressBar.draw()
    }

    complete()
    {
        setTimeout(() => {
            this.cameras.main.fadeOut(500, 0, 0, 0, (_, progress) => {
                if(progress >= 0.9999) {
                    this.scene.stop()
                    this.scene.start("campaign_01_room_001")
                }
            })
        }, 500)
    }
}