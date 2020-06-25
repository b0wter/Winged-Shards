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

export default class PlayerPlate
{
    public static readonly HorizontalMargin = 2
    public static readonly VerticalMargin = 2

    private shieldBar: HorizontalStatusBar
    private hullBar: HorizontalStatusBar
    private structureBar: HorizontalStatusBar
    private heatBar: VerticalStatusBar

    private readonly bars: StatusBar[]

    public get width()
    {
        return this.shieldBar.width + PlayerPlate.HorizontalMargin + this.heatBar.width
    }

    public get end()
    {
        return this.shieldBar.x + this.width
    }

    constructor(scene: Phaser.Scene, x: number, y: number, shield: ClampedNumber, hull: ClampedNumber, structure: ClampedNumber, heat: ClampedNumber)
    {
        shield.addChangeListener(this.updateShields.bind(this))
        hull.addChangeListener(this.updateHull.bind(this))
        structure.addChangeListener(this.updateStructure.bind(this))
        heat.addChangeListener(this.updateHeat.bind(this))
        this.shieldBar      = new ShieldBar     (scene, x, y, 300, shield.min, shield.max, shield.current)
        this.hullBar        = new HullBar       (scene, x, this.shieldBar.y + PlayerPlate.VerticalMargin + this.shieldBar.height, this.shieldBar.width, hull.min, hull.max, hull.current)
        this.structureBar   = new StructureBar  (scene, x, this.hullBar.y + PlayerPlate.VerticalMargin + this.hullBar.height, this.shieldBar.width, structure.min, structure.max, structure.current)
        this.heatBar        = new HeatBar       (scene, this.shieldBar.x + PlayerPlate.HorizontalMargin + this.shieldBar.width, y, this.shieldBar.height + this.hullBar.height + this.structureBar.height + 4, heat.min, heat.max, heat.current)
        this.bars = [ this.shieldBar, this.hullBar, this.structureBar, this.heatBar ]
        this.bars.forEach(x => scene.add.existing(x))
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

    public draw()
    {
        this.bars.forEach(x => x.draw())
    }
}