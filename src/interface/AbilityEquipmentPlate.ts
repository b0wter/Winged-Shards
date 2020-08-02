import { TriggeredEquipment } from '~/entities/TriggeredEquipment';
import MiniCooldownBar from './MiniCooldownBar';

const cooldownBarWidth = 100
const cooldownBarMarginTop = 4
const cooldownBarOffsetX = 20

export default class AbilityEquipmentPlate
{
    //private _bars: MiniCooldownBar[] = []
    //private _equipmentGroupText: Phaser.GameObjects.Text
    private icon : Phaser.GameObjects.Graphics
    private text: Phaser.GameObjects.Text
    private cooldownText?: Phaser.GameObjects.Text

    constructor(scene: Phaser.Scene, x: number, y: number,
                private _equipmentGroup: number,
                private _equipment: TriggeredEquipment,
                private _width: number
               )
    {
        this.icon = this.addIcon(scene, x, y, _width)
        this.text = this.addText(scene, x, y, _width, _equipment.numberOfUses.toFixed())
        this.cooldownText = this.addCooldownText(scene, x, y, _width, _equipment)
        _equipment.addCooldownChangedCallback((e, remaining) => {
            this.update(remaining, e.numberOfUses)
        })
    }

    private addIcon(scene, x, y, width)
    {
        const icon = new Phaser.GameObjects.Graphics(scene, undefined)
        icon.x = x
        icon.y = y
        icon.fillStyle(new Phaser.Display.Color(60, 60, 60).color)
        icon.fillRect(0, 0, width, width)
        scene.add.existing(icon)
        return icon
    }

    private addText(scene, x, y, width, content: string)
    {
        const text = new Phaser.GameObjects.Text(scene, x, y + 51 + 3, content, {})
        text.setOrigin(0.5, 0)
        text.setPosition(x + width / 2, y + width + 5)
        scene.add.existing(text)
        return text
    }

    private addCooldownText(scene, x, y, width, equipment: TriggeredEquipment)
    {
        if(equipment.completeCooldown <= 3500)
            return undefined
        
        const text = new Phaser.GameObjects.Text(scene, x + width / 2, y + width / 2, "", {})
        text.setOrigin(0.5, 0.5)
        text.setPosition(x + width / 2, y + width / 2)
        scene.add.existing(text)
        return text
    }

    private update(remaining: number, numberOfUses: number)
    {
        this.text.text = numberOfUses === Number.POSITIVE_INFINITY ? "Inf" : numberOfUses.toFixed()
        if(this.cooldownText !== undefined)
        {
            this.cooldownText.text = (remaining / 1000).toPrecision(2)
        }
    }
}