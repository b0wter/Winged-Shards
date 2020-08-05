import { TriggeredEquipment } from '~/entities/TriggeredEquipment';
import MiniCooldownBar from './MiniCooldownBar';

const cooldownBarWidth = 100
const cooldownBarMarginTop = 4
const cooldownBarOffsetX = 20

export class TriggeredEquipmentPlate
{
    private _bars: MiniCooldownBar[] = []
    private _equipmentGroupText: Phaser.GameObjects.Text

    constructor(scene: Phaser.Scene, x: number, y: number,
                private _equipmentGroup: number,
                private _equipment: TriggeredEquipment[]
               )
    {
        _equipment.forEach(e => {
            const bar = (new MiniCooldownBar(scene, x + cooldownBarOffsetX, y + this._bars.length * cooldownBarMarginTop, e))
            this._bars.push(bar)
            scene.add.existing(bar)
            e.addCooldownChangedCallback((_, remaining) => {
                bar.current = remaining
                bar.draw()
            })
        })
        this._equipmentGroupText = scene.add.text(x, y, _equipmentGroup.toString())
    }
}