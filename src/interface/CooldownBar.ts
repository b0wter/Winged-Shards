import VerticalStatusBar from './VerticalStatusBar';

const DefaultBorderSize = 0
const DefaultBarHeight = 2
const DefaultBackground = Phaser.Display.Color.HexStringToColor("#2E3436") //new Phaser.Display.Color(200, 200, 200) // new Color(200, 200, 200)
const DefaultForeground = Phaser.Display.Color.HexStringToColor("#808080") //new Phaser.Display.Color(40, 40, 40)
const DefaultBorder = Phaser.Display.Color.HexStringToColor("#A0A0A0")

export default class CooldownBar extends VerticalStatusBar
{
    private _index: number

    constructor(scene, x, y, width, min, max, index, current = -1, height = DefaultBarHeight, borderSize = DefaultBorderSize)
    {
        super(scene, x, y, width, height, borderSize, DefaultBackground, DefaultForeground, min, max, current, DefaultBorder)
        this._index = index + 1
    }

    protected writeText(x, y, width, height) 
    {
        this.text.text = this._index?.toString()
        this.text.y = y + height - this.text.height
		this.text.x = x + width / 2 - this.text.width / 2
    }
}