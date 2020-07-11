import { TriggeredEquipmentTemplate } from '../TriggeredEquipment'
import GameplayScene from '~/scenes/GameplayScene'
import { AddEntityFunc, AddProjectileFunc } from '~/scenes/ColliderCollection'
import { Enemy } from '../Enemy'
import ClampedNumber from '~/utilities/ClampedNumber'
import { Teams } from '../Teams'
import { TripleLaserTemplate, TripleLaster } from './Weapons'

export abstract class EnemyTemplate
{
    public readonly abstract name: string
    public readonly abstract spriteKey 
    public readonly abstract shield
    public readonly abstract hull
    public readonly abstract structure
    public readonly abstract maxVelocity
    public readonly abstract equipment : TriggeredEquipmentTemplate[]

    public instatiate(scene: GameplayScene, x: number, y: number, angle: number, colliderFunc: AddEntityFunc, bulletsColliderFunc: AddProjectileFunc)
    {
        const equipment = this.equipment.map(x => x.instantiate(scene, bulletsColliderFunc, Teams.Enemies, 0, 0))
        return new Enemy(scene, x, y, this.spriteKey, angle, colliderFunc, new ClampedNumber(this.shield), new ClampedNumber(this.hull), new ClampedNumber(this.structure), this.maxVelocity, equipment)
    }
}

export class LightFighter extends EnemyTemplate {
    public readonly name = "light_fighter"
    public readonly spriteKey = "spaceship_02"
    public readonly shield = 40
    public readonly hull = 20
    public readonly structure = 10
    public readonly maxVelocity = 175
    public readonly equipment = [ TripleLaster ]
}

export const EnemyTemplates : { [id: string] : EnemyTemplate; } = { 
    "light_fighter": new LightFighter ()
}