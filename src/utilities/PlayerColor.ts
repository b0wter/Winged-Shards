import Color = Phaser.Display.Color

export default class PlayerColor
{
    private static readonly lightenAmount = 20
    private static readonly darkenAmount = 20

    public get lighter() { return this._lighter.color }
    public get normal() { return this._normal.color }
    public get darker() { return this._darker.color }
    public get darkest() { return this._darkest.color }

    private _lighter: Color
    private _normal: Color
    private _darker: Color
    private _darkest: Color

    constructor(color: Color)
    {
        this._normal = color
        this._lighter = color.clone()
        this._lighter.desaturate(PlayerColor.lightenAmount) // .lighten(PlayerColor.lightenAmount)
        this._darker = color.clone()
        this._darker.darken(PlayerColor.darkenAmount)
        this._darkest = color.clone()
        this._darkest.darken(2 * PlayerColor.darkenAmount)
    }
}