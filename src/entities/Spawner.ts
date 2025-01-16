import { Scene } from "phaser";
import { Enemy } from "./Enemy";
import Entity from "./Entity";
import { Teams } from './Teams'
import { EnemyTemplate, EnemyTemplates, LightFighter } from "./templates/Enemies";
import { AddEntityFunc, AddProjectileFunc } from "~/scenes/ColliderCollection";
import { IProviderCollection } from "~/providers/EntityProvider";
import GameplayScene from "~/scenes/GameplayScene";
import InitialPosition from "~/utilities/InitialPosition";

/**
 * Represents a stage spawned by a spawner. A stage may spawn multiple waves
 */
export class Stage
{
    constructor(public readonly waves: Wave[]) { }
}


/**
 * Represents a wave spawned by a spawner.
 * All entities of a wave will be spawned at the same time and will only be spawned once
 */
export class Wave
{
    constructor(public readonly spawns: Spawn[]) { }

    public spawn(scene: GameplayScene, position: InitialPosition, colliderFunc: AddEntityFunc, bulletsColliderFunc: AddProjectileFunc, providerCollection: IProviderCollection)
    {
        this.spawns.forEach(s => s.spawn(scene, position, colliderFunc, bulletsColliderFunc, providerCollection))
    }
}


export class Spawn
{
    constructor(public readonly enemy: EnemyTemplate, public readonly count: number, public readonly delay: number)
    { }

    public spawn(scene: GameplayScene, position: InitialPosition, colliderFunc: AddEntityFunc, bulletsColliderFunc: AddProjectileFunc, providerCollection: IProviderCollection)
    {
        this.enemy.instatiate(scene, position, colliderFunc, bulletsColliderFunc, providerCollection)
    }
}


export class Spawner extends Entity
{
    protected _currentWave: number = 0;
    protected _waves: Wave[] = [];

    public get currentWave() { return this._currentWave }

    constructor(protected readonly _scene: GameplayScene, typeName, team: Teams,
        protected readonly _position: InitialPosition,
        protected readonly _colliderFunc: AddEntityFunc,
        protected readonly _bulletsColliderFunc: AddProjectileFunc,
        protected readonly _providerCollection: IProviderCollection)
    {
        super(_scene, typeName, team);
        console.log(`created spawner @ ${_position.x} - ${_position.y}`)
    }

    public nextWave() : Enemy[] {
        this._currentWave++;
        const enemies = this._waves[this._currentWave - 1].spawn(this._scene, this._position, this._colliderFunc, this._bulletsColliderFunc, this._providerCollection)
        console.warn("spawner not fully implemented --- nextWave() needs to return the spawned enemies!" )
        return [];
    }

    public update(t: number, dt: number)
    {

    }

}

export class DummySpawner extends Spawner
{
    constructor(scene: GameplayScene, position: InitialPosition, colliderFunc: AddEntityFunc, bulletsColliderFunc: AddProjectileFunc, providerCollection: IProviderCollection)
    {
        super(scene, "dummy", Teams.Players, position, colliderFunc, bulletsColliderFunc, providerCollection)
    }

    public nextWave() {
        this._currentWave++;
        const enemies = [ (new LightFighter()).instatiate(this._scene, this._position, this._colliderFunc, this._bulletsColliderFunc, this._providerCollection) ]
        return enemies;
    }
}