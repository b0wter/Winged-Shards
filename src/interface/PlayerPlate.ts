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
import MiniCooldownBar from './MiniCooldownBar';
import { TriggeredEquipmentPlate } from './TriggeredEquipmentPlate';
import AbilityEquipmentPlate from './AbilityEquipmentPlate'
import { SmallShieldGenerator } from '~/entities/templates/ShieldGenerators';
import { Shotgun } from '~/entities/templates/Weapons';
import AbilitiesPlate from './AbilitiesPlate';

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

    constructor(scene: Phaser.Scene, x: number, y: number, shield: ClampedNumber, hull: ClampedNumber, structure: ClampedNumber, heat: ClampedNumber, equipment: [number, TriggeredEquipment[]][])
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

        this.addEquipmentStatusBars(scene, equipment, this.heatBar.x + this.heatBar.width + PlayerPlate.HorizontalMargin, y, this.heatBar.height)

        this.bars.forEach(x => scene.add.existing(x))
    }

    private addEquipmentStatusBars(scene: Phaser.Scene, equipment: [number, TriggeredEquipment[]][], xOffset: number, yOffset: number, height: number) : TriggeredEquipmentPlate[]
    {
        //const abilities: AbilityEquipmentPlate[] = []
        //for(let i = 0; i < 4; i++)
        //    abilities.push(new AbilityEquipmentPlate(scene, xOffset, yOffset, i, [ new Shotgun() ]))
        const abilities = new AbilitiesPlate(scene, equipment[0][1], xOffset, yOffset)

        const plates: TriggeredEquipmentPlate[] = []
        equipment.forEach(([index, equipment]) => {
            if(equipment.length !== 0)
                plates.push(new TriggeredEquipmentPlate(scene, xOffset + abilities.width, yOffset, index, equipment))
        })
        return plates
        /*
        equipment = equipment.filter(([_, e]) => e !== undefined && e.length !== 0)
        // There are six equipment groups, thus the bars are displayed in two columns and three rows:
        //   0   1
        //   2   3
        //   4   5
        //
        const rowWidth = 100 //rowHeight
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

        return existingEquipment.map(([i,e]) => this.addEquipmentStatusBar(scene, e[0], computeXOffset(i), computeYOffset(i), rowWidth, rowHeight, i))
        */
    }

    private addEquipmentStatusBar(scene: Phaser.Scene, e: TriggeredEquipment, x: number, y: number, width: number, height: number, index: number)
    {
        const bar = new MiniCooldownBar(scene, x, y, 0, e.completeCooldown, -1) //, index, 0)//height)
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