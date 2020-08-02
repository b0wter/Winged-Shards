import HorizontalStatusBar from './HorizontalStatusBar';

const DefaultBarHeight = 6
const DefaultBorderSize = 0
const DefaultBackground = Phaser.Display.Color.HexStringToColor("#2E3436") //new Phaser.Display.Color(200, 200, 200) // new Color(200, 200, 200)
const DefaultForeground = Phaser.Display.Color.HexStringToColor("#808080") //new Phaser.Display.Color(40, 40, 40)
const DefaultBorder = Phaser.Display.Color.HexStringToColor("#A0A0A0")
const DefaultBarWidth = 100

export default class MiniCooldownBar extends HorizontalStatusBar
{
    private _ammoCounter: Phaser.GameObjects.Text

    constructor(scene: Phaser.Scene, x, y, min, max, current = -1)
    {
        super(scene, x, y, DefaultBarWidth, DefaultBarHeight, DefaultBorderSize, DefaultBackground, DefaultForeground, min, max, current, DefaultBorder)
        this._ammoCounter = scene.add.text(x + DefaultBarWidth + 5, y, "10/100", { fontSize: 8 } )
    }

    protected writeText(x, y, width, height) 
    {
        //
    }

    public draw()
    {
        super.draw()
    }
}