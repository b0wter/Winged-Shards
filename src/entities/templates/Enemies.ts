import { TriggeredEquipmentTemplate, TriggeredEquipment } from '../TriggeredEquipment'
import GameplayScene from '~/scenes/GameplayScene'
import { AddEntityFunc, AddProjectileFunc } from '~/scenes/ColliderCollection'
import { Enemy } from '../Enemy'
import ClampedNumber from '~/utilities/ClampedNumber'
import { Teams } from '../Teams'
import { TripleLaserTemplate, TripleLaser, LightLaser, LightLaserTemplate } from './Weapons'
import InitialPosition from '~/utilities/InitialPosition'
import { ScenePlayerProvider, IPlayerProvider } from '~/providers/EntityProvider'
import { ILineOfSightProvider } from '~/providers/LineOfSightProdiver'

export abstract class EnemyTemplate
{
    public readonly abstract name: string
    public readonly abstract spriteKey 
    public readonly abstract shield
    public readonly abstract hull
    public readonly abstract structure
    public readonly abstract maxVelocity
    public readonly abstract maxHeat
    public readonly abstract heatDissipation
    public readonly abstract equipment : TriggeredEquipmentTemplate[]

    public instatiate(scene: GameplayScene, position: InitialPosition, colliderFunc: AddEntityFunc, bulletsColliderFunc: AddProjectileFunc, playerProvider: IPlayerProvider, lineOfSight: ILineOfSightProvider)
    {
        const equipment = this.equipment.map(e => e())
        return new Enemy(scene, 
                         position, 
                         this.spriteKey, 
                         new ClampedNumber(this.shield), 
                         new ClampedNumber(this.hull), 
                         new ClampedNumber(this.structure), 
                         new ClampedNumber(this.maxHeat, 0, 0), 
                         this.heatDissipation, 
                         this.maxVelocity, 
                         colliderFunc, 
                         bulletsColliderFunc, 
                         equipment, 
                         playerProvider, 
                         lineOfSight
                        )
    }
}

export class LightFighter extends EnemyTemplate {
    name = "light_fighter"
    spriteKey = "spaceship_02"
    shield = 40
    hull = 20
    structure = 10
    maxVelocity = 175
    maxHeat = 100
    heatDissipation = 10
    equipment = [ LightLaserTemplate ]
}

export const EnemyTemplates : { [id: string] : EnemyTemplate; } = { 
    "light_fighter": new LightFighter ()
}