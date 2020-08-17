import { TriggeredEquipment } from '../entities/TriggeredEquipment'

export default class AiResult
{
    get desiredAngle() { return this._desiredAngle }

    get desiredVelocity() { return this._desiredVelocity }

    get equipmentTriggers() { return this._equipmentTriggers }

    get route() { return this._route }

    get isVisible() { return this._isVisible }

    constructor(private _desiredAngle : number,
                private _desiredVelocity : Phaser.Math.Vector2,
                private _equipmentTriggers : [TriggeredEquipment, boolean][],
                private _route: Phaser.Geom.Point[],
                private _isVisible: boolean
               )
    {
        //
    }
}