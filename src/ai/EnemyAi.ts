import Ai from './Ai';
import AiResult from './AiResult';
import { PlayerEntity } from '~/entities/Player';
import { Enemy } from '~/entities/Enemy';
import Phaser from 'phaser'
import Point = Phaser.Geom.Point
import { ILineOfSightProvider } from '~/providers/LineOfSightProdiver';

export type NavigateBetween = (a: Point, b: Point) => Point[]

export abstract class EnemyAi extends Ai
{
    public abstract compute(x: number, y: number, enemey: Enemy, players: PlayerEntity[], lineOfSight: ILineOfSightProvider, groupActive, navigateBetween: NavigateBetween) : AiResult

    protected active = false

    protected inactivityAiResult(enemy: Enemy)
    {
        return new AiResult(enemy.angle, Phaser.Math.Vector2.ZERO, enemy.equipment.map(x => [x, false]), [], false)
    }
}