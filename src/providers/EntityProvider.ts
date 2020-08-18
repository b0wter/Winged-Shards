import { PlayerEntity } from '~/entities/Player'
import { Enemy } from '~/entities/Enemy'
import { Projectile } from '~/entities/Projectile'
import PhysicalEntity from '~/entities/PhysicalEntity'
import { ILineOfSightProvider } from './LineOfSightProdiver'

export type EntityRequestType<T> = () => T[]

export interface IEntityProvider<T>
{
    all() : T[]
}

export interface IPhysicalEntityProvider<E extends PhysicalEntity> extends IEntityProvider<E> { }
export interface IPlayerProvider extends IPhysicalEntityProvider<PlayerEntity> { }
export interface IEnemyProvider extends IPhysicalEntityProvider<Enemy> { }
export interface IProjectileProvider extends IEntityProvider<Projectile> { }

export interface IProviderCollection
{
    friendlies: IPhysicalEntityProvider<PhysicalEntity>
    foes: IPhysicalEntityProvider<PhysicalEntity>
    los: ILineOfSightProvider
    players: IPlayerProvider
    enemies: IEnemyProvider
}

export abstract class ProviderCollection implements IProviderCollection
{
    public abstract readonly friendlies : IPhysicalEntityProvider<PhysicalEntity>
    public abstract readonly foes : IPhysicalEntityProvider<PhysicalEntity>

    constructor(public readonly players: IPlayerProvider,
                public readonly enemies: IEnemyProvider,
                public readonly los: ILineOfSightProvider,
               )
    {
        //
    }
}

export class PlayerProviderCollection extends ProviderCollection
{
    public readonly friendlies = this.players
    public readonly foes = this.enemies

    constructor(public readonly players: IPlayerProvider,
                public readonly enemies: IEnemyProvider,
                public readonly los: ILineOfSightProvider,
               )
    {
        super(players, enemies, los)
    }
}

export class EnemyProviderCollection extends ProviderCollection
{
    public readonly friendlies = this.enemies
    public readonly foes = this.players

    constructor(public readonly players: IPlayerProvider,
                public readonly enemies: IEnemyProvider,
                public readonly los: ILineOfSightProvider,
               )
    {
        super(players, enemies, los)
    }
}

export abstract class SceneEntityProvider<T> implements IEntityProvider<T>
{
    constructor(private _requestEntitiesFromScene : EntityRequestType<T>)
    {
        //
    }

    public all()
    {
        return this._requestEntitiesFromScene()
    }
}

export class ScenePlayerProvider extends SceneEntityProvider<PlayerEntity> implements IPlayerProvider { }
export class SceneEnemyProvider extends SceneEntityProvider<Enemy> implements IEnemyProvider { }
export class SceneProjectileProvider extends SceneEntityProvider<Projectile> implements IProjectileProvider { }