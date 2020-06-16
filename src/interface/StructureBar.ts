import HorizontalStatusBar from './HorizontalStatusBar'

const DefaultBarHeight = 24
const DefaultBorderSize = 4
const DefaultBackground = Phaser.Display.Color.HexStringToColor("#2E3436") //new Phaser.Display.Color(200, 200, 200) // new Color(200, 200, 200)
const DefaultForeground = Phaser.Display.Color.HexStringToColor("#AAAAAA") //new Phaser.Display.Color(40, 40, 40)
const DefaultBorder = Phaser.Display.Color.HexStringToColor("#FFFFFF")

export default class StructureBar extends HorizontalStatusBar
{
    constructor(scene, x, y, width, min, max, current = -1)
    {
        super(scene, x, y, width, DefaultBarHeight, DefaultBorderSize, DefaultBackground, DefaultForeground, min, max, current, DefaultBorder)
    }
}