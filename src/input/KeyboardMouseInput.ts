import Phaser from 'phaser'
import PlayerInput from './PlayerInput'
import AxisInput from './AxisInput'
import TriggerAxisInput from './TriggerAxisInput'
import KeyCodes = Phaser.Input.Keyboard.KeyCodes
import ButtonInput from './ButtonInput'

export default class KeyboardMouseInput extends PlayerInput
{
	private readonly cursor: Phaser.Types.Input.Keyboard.CursorKeys
	private readonly pointer: Phaser.Input. Pointer
	private pointerLeftDown = false
	private pointerRightDown = false

	private readonly action1Key: Phaser.Input.Keyboard.Key
	private readonly action2Key: Phaser.Input.Keyboard.Key
	private readonly action3Key: Phaser.Input.Keyboard.Key
	private readonly action4Key: Phaser.Input.Keyboard.Key

	private readonly digital1Key: Phaser.Input.Keyboard.Key
	private readonly digital2Key: Phaser.Input.Keyboard.Key
	private readonly digital3Key: Phaser.Input.Keyboard.Key
	private readonly digital4Key: Phaser.Input.Keyboard.Key

	constructor(scene: Phaser.Scene, 
				private player: Phaser.Physics.Arcade.Sprite)
	{
		super()
		this.cursor = scene.input.keyboard.addKeys({up: KeyCodes.W, down: KeyCodes.S, left: KeyCodes.A, right: KeyCodes.D}) //scene.input.keyboard.createCursorKeys()
		this.action1Key = scene.input.keyboard.addKey(KeyCodes.Q, true, false)
		this.action2Key = scene.input.keyboard.addKey(KeyCodes.E, true, false)
		this.action3Key = scene.input.keyboard.addKey(KeyCodes.F, true, false)
		this.action4Key = scene.input.keyboard.addKey(KeyCodes.G, true, false)
		this.digital1Key = scene.input.keyboard.addKey(KeyCodes.ONE, true, false)
		this.digital2Key = scene.input.keyboard.addKey(KeyCodes.TWO, true, false)
		this.digital3Key = scene.input.keyboard.addKey(KeyCodes.THREE, true, false)
		this.digital4Key = scene.input.keyboard.addKey(KeyCodes.FOUR, true, false)

		this.pointer = scene.input.activePointer
		scene.input.mouse.disableContextMenu()
	}

	leftAxis()
	{
		let horizontal = 0;
		let vertical = 0;

        if(this.cursor.left?.isDown ?? false) {
        	horizontal = -1 
        } else if (this.cursor.right?.isDown ?? false) {
            horizontal = 1
        } else {
            horizontal = 0
		}

        if(this.cursor.up?.isDown ?? false) {
            vertical = -1
        } else if (this.cursor.down?.isDown ?? false) {
        	vertical = 1
        } else {
        	vertical = 0
        }
        const direction = Phaser.Math.Angle.Between(0, 0, horizontal, vertical)

        return new AxisInput(horizontal, vertical, direction)
	}

	rightAxis()
	{
		const deltaX = this.pointer.deltaX
		const deltaY = this.pointer.deltaY

		let direction = 0;
		if(this.pointer.worldX !== 0 || this.pointer.worldY !== 0)
			direction = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.pointer.worldX, this.pointer.worldY) * Phaser.Math.RAD_TO_DEG + 90.0

        return new AxisInput(deltaX, deltaY, direction)
	}

	triggerAxis()
	{
		return new TriggerAxisInput(0, 0)
	}

	action1() { return ButtonInput.FromKey(this.action1Key) }
	action2() { return ButtonInput.FromKey(this.action2Key) }
	action3() { return ButtonInput.FromKey(this.action3Key) }
	action4() { return ButtonInput.FromKey(this.action4Key) }

	bumperLeft()  
	{ 
		const bi = ButtonInput.FromLeftMouseButton(this.pointer, this.pointerLeftDown) 
		this.pointerLeftDown = bi.isDown
		return bi
	}
	bumperRight() 
	{
		const bi = ButtonInput.FromRightMouseButton(this.pointer, this.pointerRightDown)
		this.pointerRightDown = bi.isDown
		return bi
	}

	digital1() { return ButtonInput.FromKey(this.digital1Key) }
	digital2() { return ButtonInput.FromKey(this.digital2Key) }
	digital3() { return ButtonInput.FromKey(this.digital3Key) }
	digital4() { return ButtonInput.FromKey(this.digital4Key) }
}