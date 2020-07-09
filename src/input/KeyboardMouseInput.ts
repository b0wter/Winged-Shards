import Phaser from 'phaser'
import PlayerInput from './PlayerInput'
import AxisInput from './AxisInput'
import TriggerAxisInput from './TriggerAxisInput'
import KeyCodes = Phaser.Input.Keyboard.KeyCodes
import ButtonInput from './ButtonInput'

export default class KeyboardMouseInput extends PlayerInput
{
	private cursor!: Phaser.Types.Input.Keyboard.CursorKeys
	private readonly pointer: Phaser.Input. Pointer
	private pointerLeftDown = false
	private pointerRightDown = false

	private action1Key!: Phaser.Input.Keyboard.Key
	private action2Key!: Phaser.Input.Keyboard.Key
	private action3Key!: Phaser.Input.Keyboard.Key
	private action4Key!: Phaser.Input.Keyboard.Key
	private action1IsDown = false
	private action2IsDown = false
	private action3IsDown = false
	private action4IsDown = false
	private action1Input = ButtonInput.Empty()
	private action2Input = ButtonInput.Empty()
	private action3Input = ButtonInput.Empty()
	private action4Input = ButtonInput.Empty()

	private digital1Key!: Phaser.Input.Keyboard.Key
	private digital2Key!: Phaser.Input.Keyboard.Key
	private digital3Key!: Phaser.Input.Keyboard.Key
	private digital4Key!: Phaser.Input.Keyboard.Key
	private digital1IsDown = false
	private digital2IsDown = false
	private digital3IsDown = false
	private digital4IsDown = false
	private digital1Input = ButtonInput.Empty()
	private digital2Input = ButtonInput.Empty()
	private digital3Input = ButtonInput.Empty()
	private digital4Input = ButtonInput.Empty()

	private bumperLeftInput = ButtonInput.Empty()
	private bumperRightInput = ButtonInput.Empty()

	constructor(private scene: Phaser.Scene, 
				private player: Phaser.GameObjects.Container)
	{
		super()

		this.activate()

		this.pointer = scene.input.activePointer
		scene.input.mouse.disableContextMenu()
	}

	activate()
	{
		this.cursor 	= this.scene.input.keyboard.addKeys({up: KeyCodes.W, down: KeyCodes.S, left: KeyCodes.A, right: KeyCodes.D}) //scene.input.keyboard.createCursorKeys()
		this.action1Key = this.scene.input.keyboard.addKey(KeyCodes.Q, true, false)
		this.action2Key = this.scene.input.keyboard.addKey(KeyCodes.E, true, false)
		this.action3Key = this.scene.input.keyboard.addKey(KeyCodes.F, true, false)
		this.action4Key = this.scene.input.keyboard.addKey(KeyCodes.G, true, false)
		this.digital1Key = this.scene.input.keyboard.addKey(KeyCodes.ONE, true, false)
		this.digital2Key = this.scene.input.keyboard.addKey(KeyCodes.TWO, true, false)
		this.digital3Key = this.scene.input.keyboard.addKey(KeyCodes.THREE, true, false)
		this.digital4Key = this.scene.input.keyboard.addKey(KeyCodes.FOUR, true, false)
	}

	deactivate()
	{
		this.scene.input.keyboard.removeCapture(KeyCodes.W)
		this.scene.input.keyboard.removeCapture(KeyCodes.A)
		this.scene.input.keyboard.removeCapture(KeyCodes.S)
		this.scene.input.keyboard.removeCapture(KeyCodes.D)
		this.scene.input.keyboard.removeCapture(KeyCodes.E)
		this.scene.input.keyboard.removeCapture(KeyCodes.F)
		this.scene.input.keyboard.removeCapture(KeyCodes.G)
		this.scene.input.keyboard.removeCapture(KeyCodes.ONE)
		this.scene.input.keyboard.removeCapture(KeyCodes.TWO)
		this.scene.input.keyboard.removeCapture(KeyCodes.THREE)
		this.scene.input.keyboard.removeCapture(KeyCodes.FOUR)
		this.scene.input.keyboard.removeKey(KeyCodes.W)
		this.scene.input.keyboard.removeKey(KeyCodes.A)
		this.scene.input.keyboard.removeKey(KeyCodes.S)
		this.scene.input.keyboard.removeKey(KeyCodes.D)
		this.scene.input.keyboard.removeKey(KeyCodes.E)
		this.scene.input.keyboard.removeKey(KeyCodes.F)
		this.scene.input.keyboard.removeKey(KeyCodes.G)
		this.scene.input.keyboard.removeKey(KeyCodes.ONE)
		this.scene.input.keyboard.removeKey(KeyCodes.TWO)
		this.scene.input.keyboard.removeKey(KeyCodes.THREE)
		this.scene.input.keyboard.removeKey(KeyCodes.FOUR)
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

		const displacement = horizontal + vertical === 0 ? 0 : 1

        return new AxisInput(horizontal, vertical, direction, displacement)
	}

	rightAxis()
	{
		const deltaX = this.pointer.deltaX
		const deltaY = this.pointer.deltaY

		let direction = 0;
		if(this.pointer.worldX !== 0 || this.pointer.worldY !== 0)
			direction = Phaser.Math.Angle.Between(this.player.x, this.player.y, this.pointer.worldX, this.pointer.worldY) * Phaser.Math.RAD_TO_DEG

		const displacement = deltaX + deltaY === 0 ? 0 : 1

        return new AxisInput(deltaX, deltaY, direction, displacement)
	}

	triggerAxis()
	{
		return new TriggerAxisInput(0, 0)
	}

	private createButtonInput(key: Phaser.Input.Keyboard.Key, lastFirstDown, setFirstDown) 
	{ 
		const isDown = key.isDown
		const duration = key.getDuration()
		const firstDown = (isDown === true) && (lastFirstDown === false)
		setFirstDown(key.isDown)
		const input = new ButtonInput(isDown, duration, firstDown)
		return input
	}

	private setAction1() { this.action1Input = this.createButtonInput(this.action1Key, this.action1IsDown, (isDown) => this.action1IsDown = isDown)}
	private setAction2() { this.action2Input = this.createButtonInput(this.action2Key, this.action2IsDown, (isDown) => this.action2IsDown = isDown)}
	private setAction3() { this.action3Input = this.createButtonInput(this.action3Key, this.action3IsDown, (isDown) => this.action3IsDown = isDown)}
	private setAction4() { this.action4Input = this.createButtonInput(this.action4Key, this.action4IsDown, (isDown) => this.action4IsDown = isDown)}
	get action1() { return this.action1Input }
	get action2() { return this.action2Input }
	get action3() { return this.action3Input }
	get action4() { return this.action4Input }

	setBumperLeft()  
	{ 
		const bi = ButtonInput.FromLeftMouseButton(this.pointer, this.pointerLeftDown) 
		this.pointerLeftDown = bi.isDown
		this.bumperLeftInput = bi
	}
	get bumperLeft() { return this.bumperLeftInput }
	setBumperRight() 
	{
		const bi = ButtonInput.FromRightMouseButton(this.pointer, this.pointerRightDown)
		this.pointerRightDown = bi.isDown
		this.bumperRightInput = bi
	}
	get bumperRight() { return this.bumperRightInput }

	private setDigital1() { return this.createButtonInput(this.digital1Key, this.digital1IsDown, (isDown) => this.digital1IsDown = isDown)}
	private setDigital2() { return this.createButtonInput(this.digital2Key, this.digital2IsDown, (isDown) => this.digital2IsDown = isDown)}
	private setDigital3() { return this.createButtonInput(this.digital3Key, this.digital3IsDown, (isDown) => this.digital3IsDown = isDown)}
	private setDigital4() { return this.createButtonInput(this.digital4Key, this.digital4IsDown, (isDown) => this.digital4IsDown = isDown)}
	get digital1() { return this.digital1Input }
	get digital2() { return this.digital2Input }
	get digital3() { return this.digital3Input }
	get digital4() { return this.digital4Input }

	public update()
	{
		this.setAction1()
		this.setAction2()
		this.setAction3()
		this.setAction4()

		this.setDigital1()
		this.setDigital2()
		this.setDigital3()
		this.setDigital4()

		this.setBumperLeft()
		this.setBumperRight()
	}
}