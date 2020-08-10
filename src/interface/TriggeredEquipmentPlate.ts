import { TriggeredEquipment } from '~/entities/TriggeredEquipment';
import MiniCooldownBar from './MiniCooldownBar';

const cooldownBarWidth = 100
const cooldownBarMarginTop = 2
const cooldownBarOffsetX = 20

export class TriggeredEquipmentPlate
{
    private _bars: MiniCooldownBar[] = []
    private _equipmentGroupText: Phaser.GameObjects.Text

    public get height() : number
    {
        return this._bars.reduce((acc: number, bar: MiniCooldownBar) => acc + bar.height, 0)
    }

    constructor(scene: Phaser.Scene, x: number, y: number,
                private _equipmentGroup: number,
                private _equipment: TriggeredEquipment[]
               )
    {
        _equipment.forEach(e => {
            const barHeight = this._bars.reduce((acc, bar) => acc + bar.height + cooldownBarMarginTop, 0)
            const bar = (new MiniCooldownBar(scene, x + cooldownBarOffsetX, y + barHeight, e))
            this._bars.push(bar)
            scene.add.existing(bar)
        })
        this._equipmentGroupText = scene.add.text(x, y + 1, _equipmentGroup.toString(), {fontSize: 12})
    }
}