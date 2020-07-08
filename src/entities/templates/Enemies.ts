import { ActiveEquipmentTemplate } from '../TriggeredEquipment'
import GameplayScene from '~/scenes/GameplayScene'
import { AddEntityFunc, AddProjectileFunc } from '~/scenes/ColliderCollection'
import { Enemy } from '../Enemy'
import ClampedNumber from '~/utilities/ClampedNumber'
import { Teams } from '../Teams'
import { LightLaser } from './Weapons'

export class EnemyTemplate
{
    public name = ""
    public spriteKey = ""
    public shield = 0
    public hull = 0
    public structure = 0
    public maxVelocity = 0
    public equipment : ActiveEquipmentTemplate[] = [ ]

    public instatiate(scene: GameplayScene, x: number, y: number, angle: number, colliderFunc: AddEntityFunc, bulletsColliderFunc: AddProjectileFunc)
    {
        const equipment = this.equipment.map(x => x.instantiate(scene, bulletsColliderFunc, Teams.Enemies, 0, 0))
        return new Enemy(scene, x, y, this.spriteKey, angle, colliderFunc, new ClampedNumber(this.shield), new ClampedNumber(this.hull), new ClampedNumber(this.structure), this.maxVelocity, equipment)
    }
}

export const LightFighter : EnemyTemplate =
    Object.assign(new EnemyTemplate(), {
        name: "light_fighter",
        spriteKey : "spaceship_02",
        shield: 40,
        hull: 20,
        structure: 10,
        maxVelocity: 150,
        equipment: [ LightLaser ]
    })

export const EnemyTemplates : { [id: string] : EnemyTemplate; } = { 
    "light_fighter": LightFighter 
}