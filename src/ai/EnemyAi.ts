import Ai from './Ai';
import AiResult from './AiResult';
import PlayerEntity from '~/entities/Player';
import { Enemy } from '~/entities/Enemy';

export default abstract class EnemyAi extends Ai
{
    public abstract compute(x: number, y: number, enemey: Enemy, players: PlayerEntity[]) : AiResult
}