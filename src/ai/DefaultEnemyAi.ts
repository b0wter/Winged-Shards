import { EnemyAi, NavigateBetween, SeesPlayer } from './EnemyAi';
import { PlayerEntity } from '~/entities/Player';
import AiResult from './AiResult';
import { Enemy } from '~/entities/Enemy';
import { TriggeredEquipment } from '~/entities/TriggeredEquipment';
import Phaser from 'phaser'
import Point = Phaser.Geom.Point
import RAD_TO_DEG = Phaser.Math.RAD_TO_DEG
import DEG_TO_RAD = Phaser.Math.DEG_TO_RAD
import Vector2 = Phaser.Math.Vector2

export default class DefaultEnemyAi extends EnemyAi
{
    /**
     * Minimal distance to keep from the player. If the player moves close the enemy will try to back away.
     */
    get minimalDistance() { return this._minimalDistance }
    /**
     * Maximum distance to keep from the player. If the player is farther away the enemy will try to close the distance.
     */
    get maximalDistance() { return this._maximalDistance }
    /**
     * Determines wether the enemy will spam shots even if it has no LOS to the player or is out of reach.
     */
    get shootAlways() { return this._shootAlways }

    get activityDistance() { return this._activityDistance }

    private lastPlayerSeenAt?: Point = undefined

    constructor(private _minimalDistance: number,
                private _maximalDistance: number,
                private _activityDistance: number,
                private _shootAlways: boolean = false
                )
    {
        super()
    }
            
    public compute(t: number, dt: number, enemy: Enemy, players: PlayerEntity[], seesPlayer: SeesPlayer, groupActive: boolean, navigateBetween: NavigateBetween) : AiResult
    {
        // Make some basic checks to see if we can compute anything useful.
        //
        if(enemy === undefined) return this.inactivityAiResult(enemy)
        if(players === undefined || players === null || players.length === 0) return this.inactivityAiResult(enemy)

        const visiblePlayers = players.filter(p => seesPlayer(p))
        if(visiblePlayers.length === 0 && this.lastPlayerSeenAt === undefined) return this.inactivityAiResult(enemy)
        /*
        const playersInRange = players.map((p: PlayerEntity) : [PlayerEntity, number] => [p, Phaser.Math.Distance.Between(p.x, p.y, enemy.x, enemy.y)])
                                     .filter(x => x[1] <= (this.active ? Number.MAX_SAFE_INTEGER : this._activityDistance)).sort(x => x[1])
                                     */
        //const distances = players.map(p => Phaser.Math.Distance.Between(p.x, p.y, enemy.x, enemy.y))
        //console.log(players[0].x, players[0].y, enemy.x, enemy.y, Phaser.Math.Distance.Between(players[0].x, players[0].y, enemy.x, enemy.y))


        //if(playersInRange.length === 0) return this.inactivityAiResult(enemy)

        const target = this.findPriorityTarget(enemy, players, seesPlayer, this.lastPlayerSeenAt)
        if(target === undefined) {
            this.active = false
            return this.inactivityAiResult(enemy)
        }
        else
        {
            const targetPoint = (target.target as PlayerEntity).point ?? (target.target as Point)
            const hasLineOfSight = target.hasLineOfSight
            const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, targetPoint.x, targetPoint.y)
            const wantsToBackOff = distance < this.minimalDistance
            const wantsToClose = distance > this.maximalDistance
            const route = navigateBetween(enemy.point, targetPoint); if(route === undefined) { return this.inactivityAiResult(enemy) };
            const nextRoutePoint = route[1]
            const angleToLook = this.turnTo(dt, enemy.x, enemy.y, enemy.angle, enemy.angularSpeed, targetPoint)
            const angleToMove = this.turnTo(dt, enemy.x, enemy.y, enemy.angle, enemy.angularSpeed, nextRoutePoint) * (wantsToBackOff ? -1 : 1)

            this.lastPlayerSeenAt = targetPoint
            this.active = true

            const speed = wantsToBackOff || wantsToClose || !hasLineOfSight ? enemy.maxVelocity : 0
            const desiredVelocity = new Vector2(Math.cos(angleToMove * DEG_TO_RAD) * RAD_TO_DEG, Math.sin(angleToMove * DEG_TO_RAD) * RAD_TO_DEG).normalize().scale(speed)

            const triggers = enemy.equipment.map(this.shouldTrigger.bind(this))

            return new AiResult(angleToLook, desiredVelocity, triggers)
        }
    }

    private findPriorityTarget(enemy: Enemy, players: PlayerEntity[], seesPlayer: SeesPlayer, lastPlaterSeenAt?: Point) : {target: PlayerEntity | Point | undefined, hasLineOfSight: boolean }
    {
        let mapDistance = function(p: PlayerEntity) : [PlayerEntity, number] { return [p, Phaser.Math.Distance.Between(p.x, p.x, enemy.x, enemy.y)] }
        const playersInRange = players.filter(p => seesPlayer(p)).map(mapDistance).sort(([_, distance]) => distance)
        if(playersInRange.length !== 0)
            return { target: playersInRange[0][0], hasLineOfSight: true }
        else
            return { target: lastPlaterSeenAt, hasLineOfSight: false }
    }

    /**
     * 
     * @param x X coordinate of this entity
     * @param y Y coordinate of this entity
     * @param angle Angle of the this entity
     * @param player Player this entity wants to target
     */
    private turnTo(dt, x, y, angle, angularSpeed, point: Point)
    {
        const targetLookAt = Phaser.Math.Angle.Between(x, y, point.x, point.y) * Phaser.Math.RAD_TO_DEG
        return targetLookAt
    }

    private shouldTrigger(e: TriggeredEquipment) : [TriggeredEquipment, boolean]
    {
        return [e, this.active && this.shootAlways];
    }
}