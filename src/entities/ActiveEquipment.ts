import Equipment from './Equipment';
import StatusChange from './StatusChange';

/**
 * Equipment that is not running all the time but also not actively triggerd:
 * E. g. engines that only produce heat while moving.
 */
export default abstract class ActiveEquipment extends Equipment
{
    public abstract update(t: number, dt: number, active: boolean) : StatusChange
}