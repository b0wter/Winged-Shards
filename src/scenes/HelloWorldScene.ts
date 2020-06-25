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
import TilemapDefinition from './TilemapDefinition'

export default class HelloWorldScene extends GameplayScene
{
    protected get mapName() { return "map" }

    protected get tilemapDefinitions() { return [ new TilemapDefinition("base_layer", "dungeon", "tiles") ]}
    protected get collisionTilemapDefinition() { return new TilemapDefinition("collision", "collision", "collision_tiles")}

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

    protected sceneSpecificUpdate(t: number, dt: number)
    {
        //
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
