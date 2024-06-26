import { Projectile, ProjectileTemplate } from './Projectile';
import PhysicalEntity from './PhysicalEntity';
import { IProviderCollection } from '~/providers/EntityProvider';
import InitialPosition from '~/utilities/InitialPosition';
import { Teams } from './Teams';
import { Damage } from './DamageType';
import { AddProjectileFunc } from '~/scenes/ColliderCollection';
import { ParticleHelpers } from '~/helpers/Particles';

export class Missile extends Projectile
{
    private _lastTarget? : PhysicalEntity

    public get point() { return new Phaser.Geom.Point(this.x, this.y) }
    public readonly maxSpeed;
    
    private lastLineOfSightUpdate = 0

    constructor(scene: Phaser.Scene, 
                position: InitialPosition,
                spriteKey: string, 
                team: Teams,
                damage: Damage,
                colliderFunc: AddProjectileFunc,
                friendlyFire: boolean,
                ignoresShields: boolean,
                ignoresHull: boolean,
                range: number,
                pierces: boolean,
                pierceHitsContinuously: boolean,
                ownerId: string,
                innerRotationSpeed: number,
                size: Phaser.Math.Vector2,
                providerCollection: IProviderCollection,
                public readonly acquisitionRange: number,
                public readonly angularSpeed: number,
                public readonly isHoming: boolean,
                public activationDelay: number,
                public currentTime: number,
                scale = 1
                )
    {
        super(
            scene,
            position,
            spriteKey,
            team,
            damage,
            colliderFunc,
            friendlyFire,
            ignoresShields,
            ignoresHull,
            range,
            pierces,
            pierceHitsContinuously,
            ownerId,
            innerRotationSpeed,
            size,
            providerCollection,
            currentTime,
            scale
        )
        this.maxSpeed = position.velocity
    }
   
    public internalUpdate(t: number, dt: number, providerCollection: IProviderCollection)
    {
        if(this.isHoming === false || this._createdAt + this.activationDelay > t) {
            console.log("Missile inactive")
            return
        }

        let distanceToTarget = -1
        if(this.isLastTargetStillValid(this._lastTarget, providerCollection) === false)
        {
            const result = this.findTarget(providerCollection)
            if(result !== undefined) {
                result[0].addKilledCallback((p) => this._lastTarget = undefined)
                distanceToTarget = result[1]
                this._lastTarget = result[0]
            }
        }

        if(this._lastTarget === undefined) {
            console.log('missile did not find target')
            return
        }

        const desiredAngle = Phaser.Math.Angle.BetweenPoints(this.point, this._lastTarget) * Phaser.Math.RAD_TO_DEG
        const difference = Phaser.Math.Angle.ShortestBetween(this.angle, desiredAngle)
        const sign = Math.sign(difference)
        let turning = this.angularSpeed * sign * dt / 1000
        turning = sign === 1 ? Math.min(turning, difference) : Math.max(turning, difference)
        this.angle += turning
        try {
            this.setVelocityX(Math.cos(this.rotation) * this.maxSpeed)
            this.setVelocityY(Math.sin(this.rotation) * this.maxSpeed)
        } catch(error) { }
    }

    private isLastTargetStillValid(target: PhysicalEntity | undefined, provider: IProviderCollection)
    {
        if(target === undefined)
            return false
        
        if(target.active === false)
            return false

        if(provider.los.isVisiblePoint(target.point) === false)
            return false

        /*
        if(provider.los.seesPoint(target.point, this.point) === false)
            return false
        */

        return true
    }

    private findTarget(providerCollection: IProviderCollection) : [PhysicalEntity, number] | undefined
    {
        const foesInRange = providerCollection.foes.all().filter(p => Phaser.Math.Distance.BetweenPoints(this.point, p.point) <= this.acquisitionRange)
        //const visibleFoesInRange = foesInRange.filter(p => providerCollection.los.isVisiblePoint(p.point))
        const visibleFoesInRange = foesInRange.filter(p => providerCollection.los.seesPoint(p.point, this.point))
        if(visibleFoesInRange.length === 0)
            return undefined
        
        const initialValue : [PhysicalEntity, number] =  [visibleFoesInRange[0], 999]
        const nearestTarget = foesInRange.reduce(([p, d] : [PhysicalEntity, number], next : PhysicalEntity) => {
            const distance = Phaser.Math.Distance.BetweenPoints(next.point, this.point)
            if(distance < d) {
                const newValue : [PhysicalEntity, number] = [next, distance]
                return newValue
            }
            else
            {
                const newValue : [PhysicalEntity, number] = [p, d]
                return newValue
            }
        } , initialValue)
        return nearestTarget
    }

    protected killEffect()
    {
        console.log('pew pew')
        if(this.visible === false)
            return
        ParticleHelpers.explosionRegular(this.scene, this.x, this.y)
    }
}

export abstract class MissileTemplate extends ProjectileTemplate
{
    public abstract acquisitionRange: number
    public abstract angularSpeed: number
    public abstract homing: boolean
    public abstract activationDelay: number

    public instantiate(scene: Phaser.Scene, 
                       x: number, y: number, 
                       team: Teams, 
                       angle: number, 
                       colliderFunc: AddProjectileFunc, 
                       ownerId: string, 
                       providerCollection: IProviderCollection,
                       currentTime: number)
    {
        const missile = new Missile(
            scene,
            new InitialPosition(x, y, angle, this.velocity),
            this.spriteKey, 
            team, 
            this.damage, 
            colliderFunc,
            this.friendlyFire, 
            this.ignoresShields, 
            this.ignoresHull,
            this.range,
            this.pierces,
            this.pierceHitsContinuously,
            ownerId,
            this.innerRotationSpeed,
            this.size,
            providerCollection,
            this.acquisitionRange,
            this.angularSpeed,
            this.homing,
            this.activationDelay,
            currentTime
            )
        return <Projectile><unknown>missile
    }
}