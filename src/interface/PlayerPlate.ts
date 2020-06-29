//
// Represents a combination of shield/hull/structure/heat bar
// and additional status text.
//

import HorizontalStatusBar from './HorizontalStatusBar';
import VerticalStatusBar from './VerticalStatusBar';
import ClampedNumber from '~/utilities/ClampedNumber';
import ShieldBar from './ShieldBar';
import StructureBar from './StructureBar';
import HullBar from './HullBar';
import HeatBar from './HeatBar';
import StatusBar from './StatusBar';
import { TriggeredEquipment, EquipmentCooldownChangedCallback } from '~/entities/TriggeredEquipment';
import CooldownBar from './CooldownBar';

export default class PlayerPlate
{
    public static readonly HorizontalMargin = 3
    public static readonly VerticalMargin = 3

    private shieldBar: HorizontalStatusBar
    private hullBar: HorizontalStatusBar
    private structureBar: HorizontalStatusBar
    private heatBar: VerticalStatusBar
    private equipmentBars: CooldownBar[] = []

    private readonly bars: StatusBar[]

    public get width()
    {
        return this.shieldBar.width + PlayerPlate.HorizontalMargin + this.heatBar.width
    }
    
    public get height()
    {
        return this.heatBar.height
    }

    public get end()
    {
        return this.shieldBar.x + this.width
    }

    constructor(scene: Phaser.Scene, x: number, y: number, shield: ClampedNumber, hull: ClampedNumber, structure: ClampedNumber, heat: ClampedNumber, equipment: [number, TriggeredEquipment][])
    {
        shield.addChangeListener(this.updateShields.bind(this))
        hull.addChangeListener(this.updateHull.bind(this))
        structure.addChangeListener(this.updateStructure.bind(this))
        heat.addChangeListener(this.updateHeat.bind(this))
        this.shieldBar      = new ShieldBar     (scene, x, y, 300, shield.min, shield.max, shield.current)
        this.hullBar        = new HullBar       (scene, x, this.shieldBar.y + PlayerPlate.VerticalMargin + this.shieldBar.height, this.shieldBar.width, hull.min, hull.max, hull.current)
        this.structureBar   = new StructureBar  (scene, x, this.hullBar.y + PlayerPlate.VerticalMargin + this.hullBar.height, this.shieldBar.width, structure.min, structure.max, structure.current)
        this.heatBar        = new HeatBar       (scene, this.shieldBar.x + PlayerPlate.HorizontalMargin + this.shieldBar.width, y, this.shieldBar.height + this.hullBar.height + this.structureBar.height + 2 * PlayerPlate.VerticalMargin, heat.min, heat.max, heat.current)
        this.bars = [ this.shieldBar, this.hullBar, this.structureBar, this.heatBar ]

        const cooldownBars = this.addEquipmentStatusBars(scene, equipment, this.heatBar.x + this.heatBar.width + PlayerPlate.HorizontalMargin, y, this.shieldBar.height)
        cooldownBars.forEach(b => this.bars.push(b))

        this.bars.forEach(x => scene.add.existing(x))
    }

    private addEquipmentStatusBars(scene: Phaser.Scene, equipment: [number, TriggeredEquipment][], xOffset: number, yOffset: number, rowHeight: number) 
    {
        // There are six equipment groups, thus the bars are displayed in two columns and three rows:
        //   0   1
        //   2   3
        //   4   5
        //
        const rowWidth = rowHeight
        let computeXOffset = function(index) {
            if(index % 2 === 0)
                return xOffset
            else
                return xOffset + rowWidth + PlayerPlate.HorizontalMargin
        }
        let computeYOffset = function(index) {
            const row = Math.floor(index/2)
            return row * (rowHeight + PlayerPlate.VerticalMargin) + yOffset
        }

        const existingEquipment = equipment.filter(([_, e]) => e !== undefined)

        return existingEquipment.map(([i,e]) => this.addEquipmentStatusBar(scene, e, computeXOffset(i), computeYOffset(i), rowWidth, rowHeight, i))
    }

    private addEquipmentStatusBar(scene: Phaser.Scene, e: TriggeredEquipment, x: number, y: number, width: number, height: number, index: number)
    {
        const bar = new CooldownBar(scene, x, y, height, 0, e.cooldown, index, 0, width)
        e.addCooldownChangedCallback((e, remaining) => bar.current = remaining)
        return bar
    }

    private updateShields(shields: ClampedNumber)
    {
        if(this.shieldBar !== undefined)
        {
            this.shieldBar.current = shields.current
            this.draw()
        }
    }

    private updateHull(hull: ClampedNumber)
    {
        if(this.hullBar !== undefined)
        {
            this.hullBar.current = hull.current
            this.draw()
        }
    }

    private updateStructure(structure: ClampedNumber)
    {
        if(this.structureBar !== undefined)
        {
            this.structureBar.current = structure.current
            this.draw()
        }
    }

    private updateHeat(heat: ClampedNumber)
    {
        if(this.heatBar !== undefined)
        {
            this.heatBar.current = heat.current
            this.draw()
        }
    }

    private updateCooldowns()
    {

    }

    public draw()
    {
        this.bars.forEach(x => x.draw())
    }
}