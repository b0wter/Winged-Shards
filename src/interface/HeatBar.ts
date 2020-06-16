import VerticalStatusBar from './VerticalStatusBar';

const DefaultBarWidth = 64
const DefaultBorderSize = 4
const DefaultBackground = Phaser.Display.Color.HexStringToColor("#2E3436") //new Phaser.Display.Color(200, 200, 200) // new Color(200, 200, 200)
const DefaultForeground = Phaser.Display.Color.HexStringToColor("#CE5C00") //new Phaser.Display.Color(40, 40, 40)
const DefaultBorder = Phaser.Display.Color.HexStringToColor("#F57900")

export default class HeatBar extends VerticalStatusBar
{
    constructor(scene, x, y, height, min, max, current = -1)
    {
        super(scene, x, y, DefaultBarWidth, height, DefaultBorderSize, DefaultBackground, DefaultForeground, min, max, current, DefaultBorder)
    }
}