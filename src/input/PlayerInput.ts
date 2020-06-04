import Phaser from 'phaser'
import AxisInput from './AxisInput'
import TriggerAxisInput from './TriggerAxisInput'
import ButtonInput from './ButtonInput'

export default abstract class PlayerInput {
	abstract leftAxis(): AxisInput
	abstract rightAxis(): AxisInput
	abstract triggerAxis(): TriggerAxisInput

	// The usual four buttons on the right side of a pas
	abstract action1(): ButtonInput
	abstract action2(): ButtonInput
	abstract action3(): ButtonInput
	abstract action4(): ButtonInput

	abstract digital1(): ButtonInput
	abstract digital2(): ButtonInput
	abstract digital3(): ButtonInput
	abstract digital4(): ButtonInput

	abstract bumperLeft(): ButtonInput
	abstract bumperRight(): ButtonInput

	constructor()
	{
	}
}

