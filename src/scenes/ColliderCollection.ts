import Phaser from 'phaser'
import PlayerEntity from '~/entities/Player'
import { Enemy } from '~/entities/Enemy'
import { Projectile } from '~/entities/Projectile'
import PhysicalEntity from '~/entities/PhysicalEntity'

export default class ColliderCollection
{
    public players!: Phaser.Physics.Arcade.Group
    public playerProjectiles!: Phaser.Physics.Arcade.Group
    public enemies!: Phaser.Physics.Arcade.Group
    public enemyProjectiles!: Phaser.Physics.Arcade.Group
    public environment : Phaser.Tilemaps.StaticTilemapLayer

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
        this._scene.physics.add.collider(this.playerProjectiles, this.enemyProjectiles, playerHitsEnemy)
        this._scene.physics.add.collider(this.playerProjectiles, this.players, playerHitsPlayer)
        this._scene.physics.add.collider(this.enemyProjectiles, this.players, enemyHitsPlayer)
        this._scene.physics.add.collider(this.enemyProjectiles, this.enemies, enemyHitsEnemy)
        this._scene.physics.add.collider(this.players, this.enemies, (player, enemy) => console.log('Player and enemy collided.'))
    }

    public addPlayer(player: PlayerEntity)
    {
        this._scene.physics.add.collider(player, this.environment)
        this.players.add(player)
        player.addKilledCallback(this.removePlayer.bind(this))
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

    public removeEnemy(enemy: Enemy | PhysicalEntity)
    {
        enemy = enemy as Enemy
        this.enemies.remove(enemy)
    }

    public addPlayerProjectile(projectile: Projectile)
    {
        this._scene.physics.add.collider(projectile, this.environment)
        this.playerProjectiles.add(projectile)
        
    }
}