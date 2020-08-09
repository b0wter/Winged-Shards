import { PlayerEntity } from '~/entities/Player'
import { Enemy } from '~/entities/Enemy'
import { Projectile } from '~/entities/Projectile'

export type EntityRequestType<T> = () => T[]

export interface IEntityProvider<T>
{
    all() : T[]
}

export interface IPlayerProvider extends IEntityProvider<PlayerEntity> { }
export interface IEnemyProvider extends IEntityProvider<Enemy> { }
export interface IProjectileProvider extends IEntityProvider<Projectile> { }

export abstract class SceneEntityProvider<T> implements IEntityProvider<T>
{
    constructor(private _requestEnemiesFromScene : EntityRequestType<T>)
    {
        //
    }

    public all()
    {
        return this._requestEnemiesFromScene()
    }
}

export class ScenePlayerProvider extends SceneEntityProvider<PlayerEntity> implements IPlayerProvider { }
export class SceneEnemyProvider extends SceneEntityProvider<Enemy> implements IEnemyProvider { }
export class SceneProjectileProvider extends SceneEntityProvider<Projectile> implements IProjectileProvider { }