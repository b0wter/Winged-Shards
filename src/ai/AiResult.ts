import { TriggeredEquipment } from '../entities/TriggeredEquipment'

export default class AiResult
{
    get desiredAngle() { return this._desiredAngle }

    get desiredVelocity() { return this._desiredVelocity }

    get equipmentTriggers() { return this._equipmentTriggers }

    get route() { return this._route }

    constructor(private _desiredAngle,
                private _desiredVelocity,
                private _equipmentTriggers : [TriggeredEquipment, boolean][],
                private _route: Phaser.Geom.Point[]
               )
    {
        //
    }
}