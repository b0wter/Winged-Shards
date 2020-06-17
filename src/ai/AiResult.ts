import Equipment from './../entities/Equipment'

export default class AiResult
{
    get desiredAngle() { return this._desiredAngle }

    get desiredVelocity() { return this._desiredVelocity }

    get equipmentTriggers() { return this._equipmentTriggers }

    constructor(private _desiredAngle = 0,
                private _desiredVelocity = Phaser.Math.Vector2.ZERO,
                private _equipmentTriggers : [Equipment, boolean][] = []
               )
    {
        //
    }

    public static Empty() { return new AiResult() }
}