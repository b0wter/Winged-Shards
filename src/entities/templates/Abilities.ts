import { AbilityEquipment } from '../AbilityEquipment';
import { HardPointSize, HardPointType } from '../Hardpoint';
import { Manufacturers } from '~/utilities/Manufacturers';
import { MaxStatusChange, CurrentStatusChange } from '../StatusChanges';
import { TriggeredEquipmentTemplate } from '../TriggeredEquipment';

export class DummyAbility extends AbilityEquipment
{
    completeCooldown = 10000
    cooldown = 10000
    hardPointSize = HardPointSize.Medium
    hardPointType = HardPointType.WithoutExtras
    heatPerTrigger = 20
    iconSpriteKey = 'ability_dummy'
    manufacturer = Manufacturers.Roskosmos
    modelName = "Dummy Ability"
    maxStatusChange = MaxStatusChange.zero
    numberOfUses = 25
    range = 150
}
export const DummyAbilityTemplate : TriggeredEquipmentTemplate = () => new DummyAbility()