import StatusBar from './StatusBar';

export default abstract class VerticalStatusBar extends StatusBar
{
    constructor(scene: Phaser.Scene, x: number, y: number, width: number, height: number, borderSize: number, background: Phaser.Display.Color, foreground: Phaser.Display.Color, min: number, max: number, current: number, borderColor: Phaser.Display.Color = new Phaser.Display.Color(160, 160, 160))
    {
        super(scene, x, y, width, height, borderSize, background, foreground, min, max, current, borderColor)
    }

   protected fillBar(x, y, width, height)
   {
       const missing = (1 - this.percentage) * height
       const remaining = this.percentage * height
       this.fillRect(x, y + missing, width, remaining)
   }
}