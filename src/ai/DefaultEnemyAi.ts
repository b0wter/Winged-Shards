import EnemyAi from './EnemyAi';
import PlayerEntity from '~/entities/Player';
import AiResult from './AiResult';
import { Enemy } from '~/entities/Enemy';
import { TriggeredEquipment } from '~/entities/TriggeredEquipment';

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

    constructor(private _minimalDistance: number,
                private _maximalDistance: number,
                private _activityDistance: number,
                private _shootAlways: boolean = false
                )
    {
        super()
    }
            
    public compute(t: number, dt: number, enemy: Enemy, players: PlayerEntity[], seesPlayer: (PlayerEntity) => boolean) : AiResult
    {

        // add a class-level active flag?
        

        if(enemy === undefined) return this.inactivityAiResult(enemy)
        if(players === undefined || players === null || players.length === 0) return this.inactivityAiResult(enemy)

        const visiblePlayers = players.filter(p => seesPlayer(p))
        if(visiblePlayers.length === 0) return this.inactivityAiResult(enemy)
        /*
        const playersInRange = players.map((p: PlayerEntity) : [PlayerEntity, number] => [p, Phaser.Math.Distance.Between(p.x, p.y, enemy.x, enemy.y)])
                                     .filter(x => x[1] <= (this.active ? Number.MAX_SAFE_INTEGER : this._activityDistance)).sort(x => x[1])
                                     */
        //const distances = players.map(p => Phaser.Math.Distance.Between(p.x, p.y, enemy.x, enemy.y))
        //console.log(players[0].x, players[0].y, enemy.x, enemy.y, Phaser.Math.Distance.Between(players[0].x, players[0].y, enemy.x, enemy.y))

        let mapDistance = function(p: PlayerEntity) : [PlayerEntity, number] { return [p, Phaser.Math.Distance.Between(p.x, p.x, enemy.x, enemy.y)] }
        const playersInRange = players.filter(p => seesPlayer(p)).map(mapDistance).sort(([_, distance]) => distance)

        if(playersInRange.length === 0) return this.inactivityAiResult(enemy)
        this.active = true
        const nearestPlayer = playersInRange[0]//[0]
        const desiredAngle = this.turnToPlayer(dt, enemy.x, enemy.y, enemy.angle, enemy.angularSpeed, nearestPlayer[0])
        const desiredVelocity = nearestPlayer[1] <= this.maximalDistance ? Phaser.Math.Vector2.ZERO : new Phaser.Math.Vector2(nearestPlayer[0].x - enemy.x, nearestPlayer[0].y - enemy.y).normalize().scale(enemy.maxVelocity)
        //console.log(nearestPlayer[1], this.maximalDistance, nearestPlayer[1] <= this.maximalDistance, desiredVelocity)
        const triggers = enemy.equipment.map(this.shouldTrigger.bind(this))
        return new AiResult(desiredAngle, desiredVelocity, triggers)
    }

    private findPriorityTarget(enemy: Enemy, players: PlayerEntity[])
    {

    }

    /**
     * 
     * @param x X coordinate of this entity
     * @param y Y coordinate of this entity
     * @param angle Angle of the this entity
     * @param player Player this entity wants to target
     */
    private turnToPlayer(dt, x, y, angle, angularSpeed, player: PlayerEntity)
    {
        const targetLookAt = Phaser.Math.Angle.Between(x, y, player.x, player.y) * Phaser.Math.RAD_TO_DEG
        return targetLookAt
    }

    private shouldTrigger(e: TriggeredEquipment) : [TriggeredEquipment, boolean]
    {
        return [e, this.active && this.shootAlways];
    }
}