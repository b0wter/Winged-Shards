import HorizontalStatusBar from './HorizontalStatusBar';

export default class FullscreenStatusBar extends HorizontalStatusBar
{
    constructor(scene: Phaser.Scene, centerX: number, centerY: number, width: number, height: number, borderSize: number, background: Phaser.Display.Color, foreground: Phaser.Display.Color, borderColor: Phaser.Display.Color)
    {
        super(scene, centerX - width / 2, centerY - height / 2, width, height, borderSize, background, foreground, 0, 1, 0, borderColor)
    }

    protected writeText(x, y, width, height)
    {
        const current = (this.current * 100).toFixed()
        const content = `${current}%`
        this.text.text = content
        this.text.y = y + height / 2 - this.text.height / 2
        this.text.x = x + width / 2 - this.text.width / 2
    }

    protected fillBar(x, y, width, height)
    {
        console.log(x, y, width, height)
        this.fillRect(x, y, width * this.percentage, height)
    }
}