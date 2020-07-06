import Phaser from 'phaser'
import { PlayerEntity } from '~/entities/Player'
import { Enemy } from '~/entities/Enemy'
import { Projectile } from '~/entities/Projectile'
import PhysicalEntity from '~/entities/PhysicalEntity'
import { Teams } from '~/entities/Teams'

export type AddPlayerFunc = (_: PlayerEntity) => void
export type AddPlayerProjectileFunc = (_: Projectile) => void
export type AddEnemyFunc = (_: Enemy) => void
export type AddEnemyProjectileFunc = (_: Projectile) => void
export type AddEntityFunc = (_: PhysicalEntity, __: Teams) => void
export type AddProjectileFunc = (_: Projectile) => void

export class ColliderCollection
{
    protected players!: Phaser.Physics.Arcade.Group
    protected playerProjectiles!: Phaser.Physics.Arcade.Group
    protected enemies!: Phaser.Physics.Arcade.Group
    protected enemyProjectiles!: Phaser.Physics.Arcade.Group
    protected readonly environment : Phaser.Tilemaps.StaticTilemapLayer
    protected readonly environmentColliders: Phaser.Physics.Arcade.Collider[] = []

    private _scene: Phaser.Scene

    constructor(scene: Phaser.Scene, environment: Phaser.Tilemaps.StaticTilemapLayer, playerHitsPlayer, playerHitsEnemy, enemyHitsEnemy, enemyHitsPlayer)
    {
        this._scene = scene
        this.environment = environment
        this.createGroups(scene)
        this.addCollisionCallbacks(playerHitsPlayer, playerHitsEnemy, enemyHitsEnemy, enemyHitsPlayer)
    }

    private createGroups(scene: Phaser.Scene)
    {
        this.players = scene.physics.add.group({ classType: PlayerEntity, runChildUpdate: true, collideWorldBounds: true})
        this.playerProjectiles = scene.physics.add.group({ classType: Projectile, runChildUpdate: true, collideWorldBounds: true})
        this.enemies= scene.physics.add.group({ classType: Enemy, runChildUpdate: true, collideWorldBounds: true})
        this.enemyProjectiles = scene.physics.add.group({ classType: Projectile, runChildUpdate: true, collideWorldBounds: true})
    }

    private addCollisionCallbacks(playerHitsPlayer, playerHitsEnemy, enemyHitsEnemy, enemyHitsPlayer)
    {
        this._scene.physics.add.collider(this.playerProjectiles, this.environment, (a, _) => { this.playerProjectiles.remove(a); a.destroy()})
        this._scene.physics.add.collider(this.enemyProjectiles, this.environment, (a, _) => { this.enemyProjectiles.remove(a); a.destroy()})
        this._scene.physics.add.collider(this.playerProjectiles, this.enemies, playerHitsEnemy)
        this._scene.physics.add.collider(this.playerProjectiles, this.players, playerHitsPlayer)
        this._scene.physics.add.collider(this.enemyProjectiles, this.players, enemyHitsPlayer)
        this._scene.physics.add.collider(this.enemyProjectiles, this.enemies, enemyHitsEnemy)
        this._scene.physics.add.collider(this.players, this.enemies, (player, enemy) => {(player as PhysicalEntity)?.setVelocity(0,0); (enemy as PhysicalEntity)?.setVelocity(0, 0)})
        this._scene.physics.add.collider(this.players, this.players, (a, b) => (b as PhysicalEntity)?.setVelocity(0,0))
        this._scene.physics.add.collider(this.enemies, this.enemies, (a, b) => (b as PhysicalEntity)?.setVelocity(0,0))
    }

    public addPlayer(player: PlayerEntity)
    {
        this.environmentColliders.push(this._scene.physics.add.collider(player, this.environment))
        this.players.add(player)
        player.addKilledCallback(this.removePlayer.bind(this))
    }

    public addPlayerFunc() : AddPlayerFunc
    {
        return this.addPlayer.bind(this)
    }

    public removePlayer(player: PlayerEntity | PhysicalEntity)
    {
        player = player as PlayerEntity
        this.players.remove(player)
    }

    public addEnemy(enemy: Enemy)
    {
        this._scene.physics.add.collider(enemy, this.environment)
        this.enemies.add(enemy)
        enemy.addKilledCallback(this.removeEnemy.bind(this))
    }

    public addEnemyFunc() : AddEnemyFunc
    {
        return this.addEnemy.bind(this)
    }

    public removeEnemy(enemy: Enemy | PhysicalEntity)
    {
        enemy = enemy as Enemy
        this.enemies.remove(enemy)
    }

    public addEntity(p: PhysicalEntity, t: Teams)
    {
        switch(t)
        {
            case Teams.Players:
                this.addPlayer(p as PlayerEntity)
                break
            case Teams.Enemies:
                this.addEnemy(p as Enemy)
                break
            case Teams.Allies:
                console.warn("addProjectile is not defined for allies")
                break
            case Teams.Neutral:
                console.warn("addProjectile is not defined for neutrals")
                break
            case Teams.World:
                console.warn("addProjectile is not defined for world")
                break
            default:
                console.warn("addEntity called with a team that is not implemented!", t)
                break
        }
    }

    public get addEntityFunc() : AddEntityFunc
    {
        return this.addEntity.bind(this)
    }

    public addPlayerProjectile(projectile: Projectile)
    {
        this._scene.physics.add.collider(projectile, this.environment, (bullet, _) => bullet.destroy())
        this.playerProjectiles.add(projectile)
        //TODO: add kill callback
    }

    public get addPlayerProjectileFunc() : AddPlayerProjectileFunc
    {
        return this.addPlayerProjectile.bind(this)
    }

    public addEnemyProjectile(projectile: Projectile)
    {
        this._scene.physics.add.collider(projectile, this.environment, (bullet, _) => bullet.destroy())
        this.enemyProjectiles.add(projectile)
        //TODO: add kill callback
    }

    public get addEnemyProjectileFunc() : AddEnemyProjectileFunc
    {
        return this.addEnemyProjectile.bind(this)
    }

    public addProjectile(projectile: Projectile)
    {
        switch(projectile.team)
        {
            case Teams.Players:
                this.addPlayerProjectile(projectile)
                break
            case Teams.Enemies:
                this.addEnemyProjectile(projectile)
                break
            case Teams.Allies:
                console.warn("addProjectile is not defined for allies")
                break
            case Teams.Neutral:
                console.warn("addProjectile is not defined for neutrals")
                break
            case Teams.World:
                console.warn("addProjectile is not defined for world")
                break
            default:
                console.warn("addEntity called with a team that is not implemented!", projectile.team)
                break
        }
    }

    public get addProjectileFunc() : AddProjectileFunc
    {
        return this.addProjectile.bind(this)
    }
}