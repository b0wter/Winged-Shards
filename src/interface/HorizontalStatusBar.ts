import StatusBar from './StatusBar';
import * as Constants from './../utilities/Constants'

export default abstract class HorizontalStatusBar extends StatusBar
{
    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, borderSize: number, background: Phaser.Display.Color, foreground: Phaser.Display.Color, min: number, max: number, current: number, borderColor: Phaser.Display.Color = new Phaser.Display.Color(160, 160, 160))
    {
        super(scene, x, y, width, height, borderSize, background, foreground, min, max, current, borderColor)
    }

    protected fillBar(x, y, width, height)
    {
        this.fillRect(x, y, width * this.percentage, height)
    }

    protected writeText(x, y, width, height)
    {
        const max = this.max.toFixed()
        const current = this.current.toFixed().padStart(max.length, " ")
        const content = `${current} / ${max}`
        this.text.text = content
        this.text.y = y + height / 2 - this.text.height / 2
        this.text.x = x + width / 2 - this.text.width / 2
    }
}