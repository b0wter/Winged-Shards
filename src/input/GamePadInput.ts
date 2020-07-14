import PlayerInput from './PlayerInput';
import AxisInput from './AxisInput';
import TriggerAxisInput from './TriggerAxisInput';
import ButtonInput from './ButtonInput';

export default class GamePadInput extends PlayerInput
{
    leftAxis(): AxisInput { return new AxisInput(0,0,0,0,false,false) }
	rightAxis(): AxisInput { return new AxisInput(0,0,0,0,false,false) }
	triggerAxis(): TriggerAxisInput { return new TriggerAxisInput(0, 0)}
	action1 = new ButtonInput(false, 0, false)
	action2 = new ButtonInput(false, 0, false)
	action3 = new ButtonInput(false, 0, false)
	action4 = new ButtonInput(false, 0, false)
	digital1 = new ButtonInput(false, 0, false)
	digital2 = new ButtonInput(false, 0, false)
	digital3 = new ButtonInput(false, 0, false)
	digital4 = new ButtonInput(false, 0, false)
	bumperLeft = new ButtonInput(false, 0, false)
    bumperRight = new ButtonInput(false, 0, false)
    update() { }
	activate() { }
	deactivate() { }
}