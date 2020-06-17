import EnemyAi from './EnemyAi';

export default class DefaultEnemyAi extends EnemyAi
{
    /**
     * Minimal distance to keep from the player. If the player moves close the enemy will try to back away.
     */
    get minimalDistance() { return this._minimalDistance }
    /**
     * Maximum distance to keep from the player. If the player is farther away the enemy will try to close the distance.
     */
    get maximalDistance() { return this._maximalDistance }
    /**
     * Determines wether the enemy will spam shots even if it has no LOS to the player or is out of reach.
     */
    get shootAlways() { return this._shootAlways }

    constructor(private _minimalDistance: number,
                private _maximalDistance: number,
                private _shootAlways: boolean = false
                )
    {
        super()
    }
            
}