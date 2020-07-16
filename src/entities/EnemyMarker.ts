import { Enemy, VisibilityChangedCallback } from './Enemy';

export class EnemyMarker extends Phaser.Physics.Arcade.Image
{
    private _callback: VisibilityChangedCallback

    constructor(scene: Phaser.Scene, 
                x: number, y: number,
                enemy: Enemy)
    {
        super(scene, x, y, 'question_mark')
        this._callback = (e: Enemy, isVisible: boolean) => {
            if(isVisible) {
                e.removeVisibilityChangedCallback(this._callback)
                this.destroy(true)
            }
        }
        enemy.addVisibilityChangedCallback(this._callback)
    }
}