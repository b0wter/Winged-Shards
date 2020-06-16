import Phaser from 'phaser'

export default class ButtonInput
{
    constructor(public isDown: boolean,
                public durationDown: number,
                public firstFrameDown: boolean
                )
    { }

    static FromRightMouseButton(pointer: Phaser.Input.Pointer, lastFrameDown: boolean)
    {
        const rightButtonDown = pointer.rightButtonDown();
        return new ButtonInput(rightButtonDown, -1, !lastFrameDown && rightButtonDown)
    }

    static FromLeftMouseButton(pointer: Phaser.Input.Pointer, lastFrameDown: boolean)
    {
        return new ButtonInput(pointer.primaryDown, pointer.downTime, !lastFrameDown && pointer.primaryDown)
    }

    public static Empty() { return new ButtonInput(false, 0, false) }
}
