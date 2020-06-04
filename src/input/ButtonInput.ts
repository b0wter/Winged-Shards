import Phaser from 'phaser'

export default class ButtonInput
{
    constructor(public isDown: boolean,
                public durationDown: number,
                public firstFrameDown: boolean
                )
    { }

    static FromKey(key: Phaser.Input.Keyboard.Key) : ButtonInput
    {
        const justDown = Phaser.Input.Keyboard.JustDown(key)
        return new ButtonInput(key.isDown, key.getDuration(), justDown)
    }

    static FromRightMouseButton(pointer: Phaser.Input.Pointer, lastFrameDown: boolean)
    {
        const rightButtonDown = pointer.rightButtonDown();
        return new ButtonInput(rightButtonDown, -1, !lastFrameDown && rightButtonDown)
    }

    static FromLeftMouseButton(pointer: Phaser.Input.Pointer, lastFrameDown: boolean)
    {
        return new ButtonInput(pointer.primaryDown, pointer.downTime, !lastFrameDown && pointer.primaryDown)
    }
}
