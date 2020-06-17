import Phaser from 'phaser'
import { UI_TEXT_DEPTH, UI_ELEMENTS_DEPTH } from '~/utilities/Constants'

export default abstract class StatusBar extends Phaser.GameObjects.Graphics
{
    get max() { return this._max }
    get min() { return this._min }
    get current() { return this._current }
    set current(value: number) {
        this._current = Math.max(Math.min(this.max, value), 0)
    }
    get percentage() { return this.current / this.max }
    get width() { return this._width }
    get height() { return this._height }

    protected text: Phaser.GameObjects.Text

    constructor(scene: Phaser.Scene,
                x: number, y: number,
                protected _width: number,
                protected _height: number,
                protected _border: number,
                protected _backgroundColor: Phaser.Display.Color,
                protected _foregroundColor: Phaser.Display.Color,
                protected _min: number,
                protected _max: number,
                protected _current: number = -1,
                protected _borderColor = new Phaser.Display.Color(160, 160, 160)
                )
    {
        super(scene)
        this.depth = UI_ELEMENTS_DEPTH
        this.x = x;
        this.y = y;
        this.text = scene.add.text(x, y, "")
        this.text.depth = UI_TEXT_DEPTH
        if(_current === -1) 
            this._current = _max
        else
            this._current = Math.max(Math.min(this._current, this._max), 0)
        this.draw()
    }

    public draw()
    {
        this.clear()

        // border (fills entire rectangle since it's easier)
        this.fillStyle(this._borderColor.color)
        this.fillRect(0, 0, this.width, this.height)

        // background
        this.fillStyle(this._backgroundColor.color)
        this.fillRect(this._border, this._border, this.width - (2 * this._border), this.height - (2 * this._border))

        // actual content
        this.fillStyle(this._foregroundColor.color)

        this.fillBar(this._border, this._border, this.width - (2 * this._border), this.height - (2 * this._border))
        // The text is offset independently from the actual status bar and as such needs the global coordinates of the content!
        this.writeText(this._border + this.x, this._border + this.y, this.width - (2 * this._border), this.height - (2 * this._border))
    }

    protected abstract fillBar(x: number, y: number, width: number, height: number)
    protected abstract writeText(x: number, y: number, width: number, height: number)
}