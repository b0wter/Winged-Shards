import EnemyAi from './EnemyAi';
import PlayerEntity from '~/entities/Player';
import AiResult from './AiResult';
import { Enemy } from '~/entities/Enemy';
import Equipment from '~/entities/Equipment';

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
            
    public compute(t: number, dt: number, enemy: Enemy, players: PlayerEntity[]) : AiResult
    {

        // add a class-level active flag?
        

        if(enemy === undefined) return AiResult.Empty()
        if(players === undefined || players === null || players.length === 0) return AiResult.Empty()
        const nearestPlayer = players.map((p: PlayerEntity) : [PlayerEntity, number] => [p, Phaser.Math.Distance.Between(p.x, p.y, enemy.x, enemy.y)])
                                     .filter(x => x[1] <= this._activityDistance).sort(x => x[1])[0][0]
        const desiredAngle = this.turnToPlayer(dt, enemy.x, enemy.y, enemy.angle, enemy.angularSpeed, nearestPlayer)
        const desiredVelocity = this.move()
        const triggers = enemy.allWeapons.map(this.shouldTrigger.bind(this))
        return new AiResult(desiredAngle, desiredVelocity, triggers)
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

    private move()
    {
        return new Phaser.Math.Vector2(0, 0)
    }

    private shouldTrigger(e: Equipment) : [Equipment, boolean]
    {
        return [e, this.shootAlways];
    }
}