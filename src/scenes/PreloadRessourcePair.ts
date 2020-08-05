export class PreloadRessourcePair
{
    constructor(public filename: string,
                public key: string)
    {
        //
    }
}

export class ConfigurablePreloadRessourcePair extends PreloadRessourcePair
{
    constructor(filename: string, key: string, public options: any)
    {
        super(filename, key)
    }
}

export class PreloadRessourceList
{
    public readonly images: PreloadRessourcePair[] = []
    public readonly spritesheets: ConfigurablePreloadRessourcePair[] = []
    public readonly tilemaps: PreloadRessourcePair[] = []

    public addImage(key: string, filename: string)
    {
        this.images.push(new PreloadRessourcePair(filename, key))
    }

    public addSpritesheet(key: string, filename: string, options: any)
    {
        this.spritesheets.push(new ConfigurablePreloadRessourcePair(filename, key, options))
    }

    public addTilemap(key: string, filename: string)
    {
        this.tilemaps.push(new PreloadRessourcePair(filename, key))
    }

    public load(scene: Phaser.Scene)
    {
        this.images.forEach(x => scene.load.image(x.key, x.filename))
        this.spritesheets.forEach(x => scene.load.spritesheet(x.key, x.filename, x.options))
        this.tilemaps.forEach(x => scene.load.tilemapTiledJSON(x.key, x.filename))
    }
}

export class FullRessourceList extends PreloadRessourceList
{
    constructor()
    {
        super()
        // --- MAPS ---
        this.addTilemap('campaign_01_room_001_map', 'maps/campaign_01_room_001.json')
        this.addTilemap('campaign_01_room_002_map', 'maps/campaign_01_room_002.json')
        this.addTilemap('campaign_01_room_003_map', 'maps/campaign_01_room_003.json')
        this.addTilemap('campaign_01_room_004_map', 'maps/campaign_01_room_004.json')
        this.addTilemap('campaign_01_room_005_map', 'maps/campaign_01_room_005.json')
        this.addTilemap('campaign_01_room_006_map', 'maps/campaign_01_room_006.json')
        this.addTilemap('campaign_01_room_007_map', 'maps/campaign_01_room_007.json')
        this.addTilemap('defeat', 'maps/defeat.json')

        // --- BASIC TILESETS ---
        this.addImage('tiles', 'images/tilesets/scifi_floor.png')
        this.addImage('heights', 'images/tilesets/heights.png')
        this.addImage('collision_tiles', 'images/tilesets/collision.png')

        // --- ENEMIES ---
        this.addImage('spaceship_01', 'images/ships/orange_01.png')
        this.addImage('spaceship_02', 'images/ships/red_01.png')

        // --- TANKS ---
        this.addImage('red_tank', 'images/tanks/red.png')
        this.addImage('green_tank', 'images/tanks/green.png')
        this.addImage('yellow_tank', 'images/tanks/yellow.png')
        this.addImage('blue_tank', 'images/tanks/blue.png')
        this.addImage('grey_tank', 'images/tanks/grey.png')
        this.addImage('hover_tank_01', 'images/tanks/hover_tank_01.png')
        this.addImage('hover_tank_02', 'images/tanks/hover_tank_02.png')
        this.addImage('hover_tank_03', 'images/tanks/hover_tank_03.png')
        this.addImage('hover_tank_04', 'images/tanks/hover_tank_04.png')
        this.addImage('hover_tank_05', 'images/tanks/hover_tank_05.png')

        // --- TURRETS ---        
        this.addImage('red_tank_turret', 'images/tanks/turret_red.png')
        this.addImage('green_tank_turret', 'images/tanks/turret_green.png')
        this.addImage('yellow_tank_turret', 'images/tanks/turret_yellow.png')
        this.addImage('blue_tank_turret', 'images/tanks/turret_blue.png')
        this.addImage('grey_tank_turret', 'images/tanks/turret_grey.png')
        this.addImage('hover_tank_turret_single_barrel', 'images/tanks/hover_tank_turret_single_barrel.png')
        this.addImage('hover_tank_turret_dual_laser', 'images/tanks/hover_tank_turret_dual_laser.png')
        this.addImage('hover_tank_turret_dual_barrel', 'images/tanks/hover_tank_turret_dual_barrel.png')

        // --- EQUIPMENT ---
        this.addImage('shield_regular', 'images/equipment/shield_regular.png')
        this.addImage('shield_circular', 'images/equipment/shield_circular_irregular_small.png')

        // --- PROJECTILES ---
        this.addImage('fusion_01', 'images/projectiles/fusion-01.png')
        this.addImage('projectile_01', 'images/projectiles/projectile-green.png')
        this.addImage('bullet', 'images/projectiles/bullet.png')
        this.addImage('bullet_medium', 'images/projectiles/bullet_medium.png')

        // --- EFFECTS ---
        this.addImage('debris', 'images/effects/debris.png')
        this.addImage('particle_blue', 'images/effects/particle-blue.png')
        this.addImage('particle_red', 'images/effects/particle-red.png')
        this.addImage('question_mark', 'images/effects/question_mark_red.png')
        this.addSpritesheet('explosion_small', 'images/effects/explosion-small.png', { frameWidth: 46, frameHeight: 46})

        // --- UI ---
        this.addImage('ability_frame', 'images/ui/ability_frame.png')
        this.addImage('ability_dummy', 'images/ui/ability_dummy.png')
    }
}