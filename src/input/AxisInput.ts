import Phaser from 'phaser'
import TriggerAxisInput from './TriggerAxisInput'

export default class AxisInput extends TriggerAxisInput
{
	constructor(horizontal: number, 
				vertical: number,
				public direction: number,
				public displacement: number
				) 
	{
		super(horizontal, vertical)
	}
}
