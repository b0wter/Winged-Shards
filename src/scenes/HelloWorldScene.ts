import Phaser from 'phaser'
import Preloader from './Preloader'
import KeyboardMouseInput from './../input/KeyboardMouseInput'
import PlayerInput from './../input/PlayerInput'
import PlayerEntity from './../entities/Player'
import * as Projectile from '~/entities/Projectile'
import { Teams } from './../entities/Teams'
import * as Weapon from './../entities/Weapon'
import { Enemy, LightFighter as EnemyLightFighter } from '~/entities/Enemy'
import HullBar from '../interface/HullBar'
import ShieldBar from '../interface/ShieldBar'
import StructureBar from '../interface/StructureBar'
import HeatBar from '~/interface/HeatBar'
import PlayerPlate from '~/interface/PlayerPlate'
import { ColliderCollection, AddPlayerFunc, AddEnemyFunc } from './ColliderCollection'
import BaseScene from './BaseScene'
import GameplayScene from './GameplayScene'
import { PreloadRessourceList } from './PreloadRessourcePair'

export default class HelloWorldScene extends GameplayScene
{
    protected get mapName() { return "map" }

	constructor()
	{
        super('hello-world')
    }
    
    protected createPreloadRessourcePairs()
    {
        const pairs = new PreloadRessourceList
        pairs.addImage('tiles', 'images/tilesets/dungeon.png')
        pairs.addImage('collision_tiles', 'images/tilesets/collision.png')
        pairs.addImage('spaceship_01', 'images/ships/orange_01.png')
        pairs.addImage('spaceship_02', 'images/ships/red_01.png')
        pairs.addImage('projectile_01', 'images/projectiles/projectile-green.png')
        pairs.addImage('shield_regular', 'images/equipment/shield_regular.png')
        pairs.addImage('shield_circular', 'images/equipment/shield_circular_irregular_small.png')
        pairs.addImage('debris', 'images/effects/debris.png')
        pairs.addImage('particle_blue', 'images/effects/particle-blue.png')
        pairs.addImage('particle_red', 'images/effects/particle-red.png')
        pairs.addImage('fusion_01', 'images/projectiles/fusion-01.png')
        pairs.addSpritesheet('explosion_small', 'images/effects/explosion-small.png', { frameWidth: 46, frameHeight: 46})
        pairs.addTilemap('map', 'maps/test.json')
        return pairs
    }



    update(t: number, dt: number)
    {
        const player = this.players[0]
        this.userInputs.forEach(x => x.update())

        const leftAxis = this.userInputs[0].leftAxis()
        player.setVelocity(leftAxis.horizontal * 200, leftAxis.vertical * 200)

        const rightAxis = this.userInputs[0].rightAxis()
        player.setAngle(rightAxis.direction) 

        player.update(t, dt, this.userInputs[0])

        this.enemies.forEach(x => x.update(t, dt, [ player ]))
        // overlap - physics!
    }

    public computeWallIntersection(ray: Phaser.Geom.Line)
    {
        //const collider = this.physics.add.collider(ray, this.environmentCollisions)
        return true
        // getTilesWithinShape() <-----------


        /*
        const start = ray.getPointA()
        const end = ray.getPointB()
        const tileSize = this.map.tileHeight
        const tileDiagonal = Math.sqrt(tileSize * tileSize)
        const angle = Phaser.Math.Angle.BetweenPoints(start, end)
        let remainingDistance = Phaser.Math.Distance.BetweenPoints(start, end)
        const step = new Phaser.Math.Vector2(tileDiagonal * Math.cos(angle * Phaser.Math.DEG_TO_RAD), tileDiagonal * Math.sin(angle * Phaser.Math.DEG_TO_RAD))

        let breaker = 0
        let current = ray.getPointA()
        do
        {
            const tile = this.map.getTileAtWorldXY(current.x, current.y, true)
            current = current.add(step)
            remainingDistance = Phaser.Math.Distance.BetweenPoints(current, ray.getPointB())
            breaker++
            if(breaker >= 1000){
                console.log('breaker triggered for ray test')
                return false
            }
        }
        while(remainingDistance > 0)
        console.log(breaker)
        return false
        */
    }
}
