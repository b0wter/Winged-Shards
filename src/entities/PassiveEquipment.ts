import Equipment from './Equipment';
import StatusChange from './StatusChange';

export default abstract class PassiveEquipment extends Equipment
{
    /**
     * 
     * @param t game time (in milliseconds)
     * @param dt time passed since last update (in milliseconds)
     */
    public abstract update(t: number, dt: number) : StatusChange
}