import { EnemyAi, NavigateBetween } from './EnemyAi';
import { Enemy } from '~/entities/Enemy';
import { PlayerEntity } from '~/entities/Player';
import AiResult from './AiResult';
import { ILineOfSightProvider } from '~/providers/LineOfSightProdiver';

export class StateBasedEnemyAi extends EnemyAi
{
    public compute(t: number, dt: number, enemy: Enemy, players: PlayerEntity[], lineOfSight: ILineOfSightProvider, groupActive: boolean, navigateBetween: NavigateBetween) : AiResult
    {
        return new AiResult(0, 0, [], [], true)
    }
}