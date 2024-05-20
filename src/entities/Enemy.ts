import Phaser from 'phaser'
import { Teams } from './Teams'
import PhysicalEntity from './PhysicalEntity'
import { PlayerEntity } from './Player'
import ClampedNumber from './../utilities/ClampedNumber'
import DefaultEnemyAi from '~/ai/DefaultEnemyAi'
import { TriggeredEquipment } from './TriggeredEquipment'
import { AddEntityFunc, AddProjectileFunc } from '~/scenes/ColliderCollection'
import GameplayScene from '~/scenes/GameplayScene'
import Point = Phaser.Geom.Point
import InitialPosition from '~/utilities/InitialPosition'
import { ScenePlayerProvider, IPlayerProvider, IProviderCollection } from '~/providers/EntityProvider'
import { ILineOfSightProvider } from '~/providers/LineOfSightProdiver'
import { ParticleHelpers } from '~/helpers/Particles'

export type VisibilityChangedCallback = (_: Enemy, isVisible: boolean) => void

export class Enemy extends PhysicalEntity
{
    public get angularSpeed() { return this._angularSpeed }
    private _angularSpeed = 120

    public get velocity() { const b = this.body as Phaser.Physics.Arcade.Body; return b.velocity ?? new Phaser.Math.Vector2(0,0)}

    public get maxVelocity() { return this._maxVelocity }

    private _ai = new DefaultEnemyAi(300, ((this.equipment.map(e => e.range)).sort()[0] ?? 500) - 100 , 1000, true)

    public get equipment() { return this._equipment }

    private _debugRouteElements : Phaser.GameObjects.Line[] = []
    private _debugColor = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)

    private _visibilityChangedCallbacks: VisibilityChangedCallback[] = []

    constructor(scene: GameplayScene, 
                position: InitialPosition,
                spriteKey: string, 
                shields: ClampedNumber, 
                hull: ClampedNumber, 
                structure: ClampedNumber, 
                heat: ClampedNumber,
                private _heatDissipation: number,
                private _maxVelocity: number,
                collider: AddEntityFunc, 
                private _projectileCollider: AddProjectileFunc,
                private _equipment: TriggeredEquipment[],
                private _providerCollection: IProviderCollection
               )
    {
        super(scene, 
              position,
              spriteKey, 
              Teams.Enemies, 
              shields,
              hull,
              structure,
              heat,
              collider,
             )
        this.visible = false
    }

    protected killInternal()
    {
        this._debugRouteElements.forEach(x => x.destroy())
    }

    protected killEffect()
    {
        if(this.visible === false)
            return
        ParticleHelpers.killEffect(this.scene, this.x, this.y, 2.0)
    }   

    public update(t: number, dt: number)
    {
        this.updatePlayerInteraction(t, dt, this._providerCollection.players.all())
        this.heatValue.substract(this._heatDissipation * dt / 1000)
    }

    private updatePlayerInteraction(t: number, dt: number, players: PlayerEntity[])
    {
        if(players === undefined || players === null || players.length === 0)
            return

        const ai = this._ai.compute(t, dt, this, players, this._providerCollection.los, false, this.gameplayScene.navigation.betweenFunc())

        // Difference in degrees of the actual direction the enemy is facing and the target.
        // This is the amount of turning the enemy needs to do.
        const difference = Phaser.Math.Angle.ShortestBetween(this.angle, ai.desiredAngle)

        const sign = Math.sign(difference)
        // The maximum amount of turning possible in dt. This needs to be clamped.
        let turning = this.angularSpeed * sign * dt / 1000
        turning = sign === 1 ? Math.min(turning, difference) : Math.max(turning, difference)

        this.angle += turning
        this.setVelocity(ai.desiredVelocity.x, ai.desiredVelocity.y)

        ai.equipmentTriggers.forEach(x => { if(x[1]) { this.fireWeapon(t, x[0]) }} )

        //this.debugRouteElements(this.point, ai.route)
    }

    public seesPointFromAllEdges(point: Phaser.Geom.Point) : boolean
    {
        const w = this.width / 2
        const h = this.height / 2
        const points = [ new Point(this.x + w, this.y), new Point(this.x - w, this.y), new Point(this.x, this.y + h), new Point(this.x, this.y - h) ]
        const visible = points.map(p => this._providerCollection.los.seesPoint(p, point))
        const reduced = visible.reduce((a, b) => a && b)
        return reduced
    }

    private fireWeapon(t: number, e: TriggeredEquipment)
    {
        const angle = () => this.angle
        const position = (_: any) => new Phaser.Geom.Point(this.x, this.y)

        if(this.remainingHeatBudget >= e.heatPerTrigger)
        {
            const heatGenerated = e.trigger(this.scene as GameplayScene, this._projectileCollider, position, angle, this._providerCollection, t, this.name, this.team)
            this.heatValue.add(heatGenerated)
        }
    }

    private debugRouteElements(start: Phaser.Geom.Point, route: Phaser.Geom.Point[])
    {
        this._debugRouteElements.forEach(x => x.destroy())
        if(route.length <= 1) {
            return
        }
        else {
            if(start.x !== route[0].x || start.y !== route[0].y)
                route.unshift(start)
            for(let i = 1; i < route.length; i++) {
                const line = this.scene.add.line(0, 0, route[i-1].x, route[i-1].y, route[i].x, route[i].y, this._debugColor)
                line.setOrigin(0,0)
                line.setLineWidth(2)
                this._debugRouteElements.push(line)
            }
        }
    }

    public addVisibilityChangedCallback(c: VisibilityChangedCallback)
    {
        this._visibilityChangedCallbacks.push(c)
    }

    public removeVisibilityChangedCallback(c: VisibilityChangedCallback)
    {
        this._visibilityChangedCallbacks.forEach( (item, index) => {
            if(item === c) this._visibilityChangedCallbacks.splice(index,1);
          });
    }

    public setVisible(value: boolean)
    {
        if(value != this.visible) {
            super.setVisible(value)
            this._visibilityChangedCallbacks.forEach(c => c(this, value))
        }
        return this
    }
}