import { TriggeredEquipment } from '~/entities/TriggeredEquipment';
import MiniCooldownBar from './MiniCooldownBar';

const cooldownBarWidth = 100
const cooldownBarMarginTop = 5
const cooldownBarOffsetX = 20

export class TriggeredEquipmentPlate
{
    private _bars: MiniCooldownBar[] = []
    private _equipmentGroupText: Phaser.GameObjects.Text
    private readonly margin = 2

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
            /*
            const barHeight = () => { 
                let height
                if(this._bars.length === 0) { 
                    height = 0 
                } else { 
                    height = this._bars.length * (this._bars[0].height + this.margin) 
                } 
                console.log(height, this._bars.length)
                return height
            }
            */
            const barHeight = this._bars.reduce((acc, bar) => acc + bar.height + cooldownBarMarginTop, 0)
            console.log(barHeight)
            const bar = (new MiniCooldownBar(scene, x + cooldownBarOffsetX, y + barHeight + cooldownBarMarginTop, e))
            this._bars.push(bar)
            scene.add.existing(bar)
        })
        this._equipmentGroupText = scene.add.text(x, y, _equipmentGroup.toString())
    }
}