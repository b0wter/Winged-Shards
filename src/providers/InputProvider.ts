import PlayerInput from '~/input/PlayerInput';

export type InputRequestType = () => PlayerInput

export interface IInputProvider
{
    request() : PlayerInput
}

export class SceneInputProvider
{
    constructor(private inputs: InputRequestType)
    {
        //
    }

    request() : PlayerInput
    {
        return this.inputs()
    }
}