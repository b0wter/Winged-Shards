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
import { AbilityEquipment } from '~/entities/AbilityEquipment';
import { Weapon } from '~/entities/Weapon';

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

    private addEquipmentStatusBars(scene: Phaser.Scene, equipment: [number, TriggeredEquipment[]][], xOffset: number, yOffset: number, height: number) 
    {
        const abilities : [number, AbilityEquipment[]][] = equipment.filter(([index, items]) => items.length > 0 && items.every(i => i.kind === AbilityEquipment.class))
                                                                    .map(([index, items]) => [index, items.map(i => <AbilityEquipment>i)])

        const weapons : [number, Weapon[]][] = equipment.filter(([index, items]) => items.every(i => i.kind === Weapon.class))
                                                        .map(([index, items]) => [index, items.map(i => <Weapon>i)])

        if(abilities.length + weapons.length !== equipment.length)
            console.warn("There were mixed combinations of weapons and abilities. This is currently not supported.")

        const aPlate = this.addAbilityStatusBars(scene, abilities, xOffset, yOffset)
        const wPlate = this.addWeaponStatusBars(scene, weapons, xOffset + 5 + aPlate.width, yOffset)
    }

    private addAbilityStatusBars(scene: Phaser.Scene, equipment: [number, AbilityEquipment[]][], xOffset: number, yOffset: number)
    {
        equipment.forEach(e => ([_, items]) => {
            if(items.length != 1)
                console.warn("An attempt was made to create an ability plate for multiple abilities at once.")
        })
        const mappedEquipment : [number, AbilityEquipment][] = equipment.map(([number, items]) => [number, items[0]])
        const abilities = new AbilitiesPlate(scene, mappedEquipment, xOffset, yOffset)
        return abilities
    }

    private addWeaponStatusBars(scene: Phaser.Scene, weapons: [number, Weapon[]][], xOffset: number, yOffset: number)
    {
        const plates: TriggeredEquipmentPlate[] = []
        weapons.forEach(([index, equipment]) => {
            if(equipment.length !== 0)
                plates.push(new TriggeredEquipmentPlate(scene, xOffset, yOffset, index, equipment))
        })
        return plates
    }

    private addEquipmentStatusBar(scene: Phaser.Scene, e: TriggeredEquipment, x: number, y: number, width: number, height: number, index: number)
    {
        const bar = new MiniCooldownBar(scene, x, y, e) //, index, 0)//height)
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