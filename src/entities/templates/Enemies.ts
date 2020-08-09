import { TriggeredEquipmentTemplate, TriggeredEquipment } from '../TriggeredEquipment'
import GameplayScene from '~/scenes/GameplayScene'
import { AddEntityFunc, AddProjectileFunc } from '~/scenes/ColliderCollection'
import { Enemy } from '../Enemy'
import ClampedNumber from '~/utilities/ClampedNumber'
import { Teams } from '../Teams'
import { TripleLaserTemplate, TripleLaser, LightLaser, LightLaserTemplate } from './Weapons'
import InitialPosition from '~/utilities/InitialPosition'
import { ScenePlayerProvider, IPlayerProvider } from '~/providers/EntityProvider'

export abstract class EnemyTemplate
{
    public readonly abstract name: string
    public readonly abstract spriteKey 
    public readonly abstract shield
    public readonly abstract hull
    public readonly abstract structure
    public readonly abstract maxVelocity
    public readonly abstract equipment : TriggeredEquipmentTemplate[]

    public instatiate(scene: GameplayScene, position: InitialPosition, colliderFunc: AddEntityFunc, bulletsColliderFunc: AddProjectileFunc, playerProvider: IPlayerProvider)
    {
        const equipment = this.equipment.map(e => e())
        return new Enemy(scene, position, this.spriteKey, colliderFunc, bulletsColliderFunc, new ClampedNumber(this.shield), new ClampedNumber(this.hull), new ClampedNumber(this.structure), this.maxVelocity, equipment, playerProvider)
    }
}

export class LightFighter extends EnemyTemplate {
    public readonly name = "light_fighter"
    public readonly spriteKey = "spaceship_02"
    public readonly shield = 40
    public readonly hull = 20
    public readonly structure = 10
    public readonly maxVelocity = 175
    public readonly equipment = [ LightLaserTemplate ]
}

export const EnemyTemplates : { [id: string] : EnemyTemplate; } = { 
    "light_fighter": new LightFighter ()
}