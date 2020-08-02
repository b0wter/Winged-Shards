import { Equipment } from '~/entities/Equipment';
import AbilityEquipmentPlate from './AbilityEquipmentPlate';
import { TriggeredEquipment } from '~/entities/TriggeredEquipment';

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

    constructor(scene: Phaser.Scene, equipment: TriggeredEquipment[], xOffset: number, yOffset: number)
    {
        for(let i = 0; i < equipment.length; i++)
        {
            const p = this.addAbility(scene, i, equipment[i], xOffset + i * (AbilitiesPlate.PlateWidth + AbilitiesPlate.PlateMargin), yOffset)
            this.plates.push(p)
        }
    }

    private addAbility(scene: Phaser.Scene, index: number, e: TriggeredEquipment, xOffset, yOffset) : AbilityEquipmentPlate
    {
        return new AbilityEquipmentPlate(scene, xOffset, yOffset, index, e, AbilitiesPlate.PlateWidth)
    }
}