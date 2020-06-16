import Phaser from 'phaser'

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
        console.log('creating status bar')
        this.x = x; 
        this.y = y;
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
        this.fillRect(this.x, this.y, this.width, this.height)

        // background
        this.fillStyle(this._backgroundColor.color)
        this.fillRect(this.x + this._border, this.y + this._border, this.width - (2 * this._border), this.height - (2 * this._border))

        // actual content
        this.fillStyle(this._foregroundColor.color)

        this.fillBar(this.x + this._border, this.y + this._border, this.width - (2 * this._border), this.height - (2 * this._border))
    }

    protected abstract fillBar(x: number, y: number, width: number, height: number)
}