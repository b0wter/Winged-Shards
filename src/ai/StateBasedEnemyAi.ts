import { EnemyAi, NavigateBetween } from './EnemyAi';
import { Enemy } from '~/entities/Enemy';
import { PlayerEntity } from '~/entities/Player';
import AiResult from './AiResult';
import { ILineOfSightProvider } from '~/providers/LineOfSightProdiver';
import { IPlayerProvider, IEnemyProvider } from '~/providers/EntityProvider';

export type AiStateChangeCondition = () => boolean

export class StateBasedEnemyAi extends EnemyAi
{
    public compute(t: number, dt: number, enemy: Enemy, players: PlayerEntity[], lineOfSight: ILineOfSightProvider, groupActive: boolean, navigateBetween: NavigateBetween) : AiResult
    {
        return new AiResult(0, 0, [], [], true)
    }
}

export class StateBasedAiResult
{
    constructor(public readonly aiResult: AiResult,
                public readonly newState: AiState)
    {
        //
    }
}

export class OwnerPositionProvider
{
    constructor(public readonly point : () => Phaser.Geom.Point,
                public readonly angle : () => number,
                public readonly velocity : () => Phaser.Math.Vector2
               )
    {
        //
    }
}

abstract class AiStateHiddenPropertes
{
    private _lastTarget?: PlayerEntity

    protected get lastTarget() { return this._lastTarget }
    protected set lastTarget(value) { this._lastTarget = value }
}

abstract class AiState extends AiStateHiddenPropertes
{

    protected get isSeenByPlayer() 
    {
        const playerPositions = this._playerProvider.all().map(p => p.point)
        const thisPosition = this._ownerPositionProvider.point()
        return playerPositions.some(p => this._lineOfSight.seesPoint(p, thisPosition))
    }

    constructor(protected _ownerPositionProvider: OwnerPositionProvider,
                protected _playerProvider: IPlayerProvider,
                protected _enemyProvider: IEnemyProvider,
                protected _lineOfSight: ILineOfSightProvider,
               )
    {
        super()
    }

    public abstract update(t: number, dt: number) : StateBasedAiResult

    protected visiblePlayers() : PlayerEntity[]
    {
        const players = this._playerProvider.all()
        const thisPosition = this._ownerPositionProvider.point()
        return players.filter(player => this._lineOfSight.seesPoint(player.point, thisPosition))
    }

    protected visiblePlayersWithDistance() : [PlayerEntity, number][]
    {
        const visiblePlayers = this.visiblePlayers()
        const thisPoint = this._ownerPositionProvider.point()
        return visiblePlayers.map(p => [p, Phaser.Math.Distance.BetweenPoints(p.point, thisPoint)])
    }
}

class IdleAiState extends AiState
{
    protected activityDistance = 1000
    protected minimalDistance = 300
    protected maximalDistance = 450

    public update(t: number, dt: number) : StateBasedAiResult
    {
        const thisPoint = this._ownerPositionProvider.point()
        const playersWithDistance = this.visiblePlayersWithDistance()
        const anyPlayerInActivityDistance = playersWithDistance.some(([_, distance]) => distance <= this.activityDistance)

        const target = this.selectTarget(this.lastTarget, playersWithDistance)

        const result = new AiResult(this._ownerPositionProvider.angle(), new Phaser.Math.Vector2(0, 0), [], [], playersWithDistance.length > 0)
        return new StateBasedAiResult(result, this)
    }

    private selectTarget(previousTarget: PlayerEntity | undefined, playersWithDistance: [PlayerEntity, number][]) : [PlayerEntity, number]
    {
        const previous = playersWithDistance.find(([p, _]) => p === previousTarget)

        // Return the previous target if it has not left the maximal distance.
        if(previous !== undefined && previous[1] < this.maximalDistance)
        {
            return previous
        }

        const nearestPlayer = playersWithDistance.reduce((previous, next) => {
            if(next[1] < previous[1]) return next
            else return previous
        })

        return nearestPlayer
    }
}
