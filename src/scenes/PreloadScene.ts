import Phaser from 'phaser'
import HorizontalStatusBar from '~/interface/HorizontalStatusBar'
import FullscreenStatusBar from '~/interface/FullscreenProgressBar'
import Color = Phaser.Display.Color
import ShieldBar from '~/interface/ShieldBar'
import { FullRessourceList } from './PreloadRessourcePair'
import TankSelectionScene from './TankSelectionScene'

export class PreloadScene extends Phaser.Scene
{
    public static readonly SceneName = "PreloadScene"

    private progressBar!: HorizontalStatusBar
    private width!: number
    private height!: number

    private nextScene = TankSelectionScene.SceneName

    constructor()
    {
        super(PreloadScene.SceneName)
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
        new FullRessourceList().load(this)
    }

    initProgressBar()
    {
        console.log("Initializing progress bar.")
        this.progressBar = new FullscreenStatusBar(this, this.cameras.main.centerX, this.cameras.main.centerY, 1920 * 0.8, 200, 4, new Color(200, 200, 200), new Color(150, 150, 150), new Color(50, 50, 50))
        this.add.existing(this.progressBar)
        this.progressBar.draw()
    }

    progress(percentage: number)
    {
        this.progressBar.current = percentage
        this.progressBar.draw()
    }

    complete()
    {
        setTimeout(() => {
            this.cameras.main.fadeOut(500, 0, 0, 0, (_, progress) => {
                if(progress >= 0.9999) {
                    this.scene.stop()
                    this.scene.start(this.nextScene)
                }
            })
        }, 500)
    }
}