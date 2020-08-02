import AbilityEquipmentPlate from './AbilityEquipmentPlate';
import { AbilityEquipment } from '~/entities/AbilityEquipment';

export default class AbilitiesPlate
{
    private static readonly PlateWidth = 51
    private static readonly PlateHeight = 51
    private static readonly PlateMargin = 2

    private plates : AbilityEquipmentPlate[] = []

    public get width()
    {
        return this.plates.length * (AbilitiesPlate.PlateMargin + AbilitiesPlate.PlateWidth)
    }

    constructor(scene: Phaser.Scene, equipment: [number, AbilityEquipment][], xOffset: number, yOffset: number)
    {
        for(let i = 0; i < equipment.length; i++)
        {
            const p = this.addAbility(scene, i, equipment[i][1], xOffset + i * (AbilitiesPlate.PlateWidth + AbilitiesPlate.PlateMargin), yOffset)
            this.plates.push(p)
        }
    }

    private addAbility(scene: Phaser.Scene, index: number, e: AbilityEquipment, xOffset, yOffset) : AbilityEquipmentPlate
    {
        return new AbilityEquipmentPlate(scene, xOffset, yOffset, index, e, AbilitiesPlate.PlateWidth)
    }
}