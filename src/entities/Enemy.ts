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
import { ScenePlayerProvider, IPlayerProvider } from '~/providers/EntityProvider'

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
                collider: AddEntityFunc, 
                private _projectileCollider: AddProjectileFunc,
                shields: ClampedNumber, 
                hull: ClampedNumber, 
                structure: ClampedNumber, 
                private _maxVelocity: number,
                private _equipment: TriggeredEquipment[],
                private _playerProvider: IPlayerProvider
               )
    {
        super(scene, 
              position,
              spriteKey, 
              Teams.Enemies, 
              shields,
              hull,
              structure,
              new ClampedNumber(Number.MAX_SAFE_INTEGER), 
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
        const particles = this.scene.add.particles('particle_red')
        const emitter = particles.createEmitter({ lifespan: (a) => Math.random()*750})
        emitter.setPosition(this.x, this.y)
        emitter.setSpeed(150)
        emitter.setAlpha((p, k, t) => Math.sqrt(1 - t)) //1 - t)
        emitter.stop()
        emitter.explode(20, this.x, this.y)
        setTimeout(() => emitter.remove(), 750)
    }   

    public update(t: number, dt: number)
    {
        this.updatePlayerInteraction(t, dt, this._playerProvider.all())
    }

    private updatePlayerInteraction(t: number, dt: number, players: PlayerEntity[])
    {
        if(players === undefined || players === null || players.length === 0) 
            return

        const ai = this._ai.compute(t, dt, this, players, this.seesPoint.bind(this), false, this.gameplayScene.navigation.betweenFunc())

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

    public seesPoint(point: Phaser.Geom.Point) : boolean
    {
        const ray = new Phaser.Geom.Line(this.x, this.y, point.x, point.y)
        var intersects = this.gameplayScene.computeWallIntersection(ray)
        return intersects
    }

    public seesPointFromAllEdges(point: Phaser.Geom.Point) : boolean
    {
        const w = this.width / 2
        const h = this.height / 2
        const points = [ new Point(this.x + w, this.y), new Point(this.x - w, this.y), new Point(this.x, this.y + h), new Point(this.x, this.y - h) ]
        const visible = points.map(p => { const ray = new Phaser.Geom.Line(p.x, p.y, point.x, point.y); return this.gameplayScene.computeWallIntersection(ray) })
        const reduced = visible.reduce((a, b) => a && b)
        return reduced
    }

    private fireWeapon(t: number, e: TriggeredEquipment)
    {
        const angle = () => this.angle
        const position = (_: any) => new Phaser.Geom.Point(this.x, this.y)

        e.trigger(this.scene as GameplayScene, this._projectileCollider, position, angle, t, this.name, this.team)
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