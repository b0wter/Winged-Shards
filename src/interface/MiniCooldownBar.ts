import HorizontalStatusBar from './HorizontalStatusBar';
import { TriggeredEquipment } from '~/entities/TriggeredEquipment';
import { MagazineProjectileWeapon, Weapon, ProjectileWeapon } from '~/entities/Weapon';
import { INFINITY_SYMBOL } from '~/utilities/Constants';

const DefaultBarHeight = 12
const DefaultBorderSize = 0
const DefaultBackground = Phaser.Display.Color.HexStringToColor("#2E3436") //new Phaser.Display.Color(200, 200, 200) // new Color(200, 200, 200)
const DefaultForeground = Phaser.Display.Color.HexStringToColor("#808080") //new Phaser.Display.Color(40, 40, 40)
const DefaultReloadForeground = Phaser.Display.Color.HexStringToColor("#B2B000")
const DefaultDestroyedColor = Phaser.Display.Color.HexStringToColor("#7F0000")
const DefaultBorder = Phaser.Display.Color.HexStringToColor("#A0A0A0")
const DefaultBarWidth = 100

export default class MiniCooldownBar extends HorizontalStatusBar
{
    private _ammoCounter: Phaser.GameObjects.Text
    private _equipmentIsReloading = false
    private _equipmentIsDestroyed = false

    constructor(scene: Phaser.Scene, x, y, equipment: TriggeredEquipment) // min, max, current = -1)
    {
        super(scene, x, y, DefaultBarWidth, DefaultBarHeight, DefaultBorderSize, DefaultBackground, DefaultForeground, 0, equipment.completeCooldown, 0, DefaultBorder)
        this._ammoCounter = scene.add.text(x + DefaultBarWidth + 5, y, "", { fontSize: 12 } )
        if((equipment as MagazineProjectileWeapon).shotsPerMagazine !== undefined)
        {
            const weapon = equipment as MagazineProjectileWeapon
            weapon.addReloadChangedCallback((w, remaining) => {
                if(this._equipmentIsReloading === false)
                {
                    this._equipmentIsReloading = true
                    this.max = w.magazineReload
                }
                this.current = remaining
                this.draw()
            })
            weapon.addReloadFinishedCallback((w) => {
                this._ammoCounter.text = w.shotsLeftInMagazine.toFixed() + " / " + (w.ammo.current - w.shotsLeftInMagazine).toFixed()
                this._equipmentIsReloading = false
                this.max = w.completeCooldown
                this.current = 0
                this.draw()
            })
            weapon.addNumberOfUsesCallback((e) => {
                const w = e as MagazineProjectileWeapon
                // -1 because the callback is triggered before shotsLeftInMagazine is reduced
                this._ammoCounter.text = (w.shotsLeftInMagazine - 1).toFixed() + " / " + (w.ammo.current - w.shotsLeftInMagazine + 1).toFixed() 
            })
        }
        else
        {
            if(equipment.numberOfUses === Number.POSITIVE_INFINITY)
                this._ammoCounter.text = INFINITY_SYMBOL
            else
                this._ammoCounter.text = equipment.numberOfUses.toFixed()
            equipment.addNumberOfUsesCallback((e) => {
                this._ammoCounter.text = equipment.numberOfUses.toFixed()
            })
        }

        equipment.addCooldownChangedCallback((e, remaining) => {
            this.current = remaining
            this.draw()
        })

        equipment.addEquipmentDestroyedCallback((e, isDestroyed) => {
            this._equipmentIsDestroyed = isDestroyed
            this._ammoCounter.text = "DESTROYED"
            this.draw()
        })
    }

    protected writeText(x, y, width, height) 
    {
        //
    }

    public draw()
    {
        if(this._equipmentIsDestroyed)
            this.drawDestroyed()
        else
            this.drawNonDestroyed()
    }

    protected drawDestroyed()
    {
        this.clear()
        this.fillStyle(DefaultDestroyedColor.color)
        this.fillRect(this._border, this._border, this.width - (2 * this._border), this.height - (2 * this._border))
    }

    protected drawNonDestroyed()
    {
        this.clear()

        // border (fills entire rectangle since it's easier)
        this.fillStyle(this._borderColor.color)
        this.fillRect(0, 0, this.width, this.height)

        // background
        this.fillStyle(this._backgroundColor.color)
        this.fillRect(this._border, this._border, this.width - (2 * this._border), this.height - (2 * this._border))

        // actual content
        this.fillStyle(this._equipmentIsReloading ? DefaultReloadForeground.color : this._foregroundColor.color)

        this.fillBar(this._border, this._border, this.width - (2 * this._border), this.height - (2 * this._border))
        // The text is offset independently from the actual status bar and as such needs the global coordinates of the content!
        this.writeText(this._border + this.x, this._border + this.y, this.width - (2 * this._border), this.height - (2 * this._border))
    }
}