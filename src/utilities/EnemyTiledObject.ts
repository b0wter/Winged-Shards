export default class EnemyTiledObject
{
    private static readonly AiTag = "ai"
    private static readonly AngleTag = "angle"
    private static readonly HeatPercentageTag = "heat_percentage"
    private static readonly ShieldPercentageTag = "shield_percentage"
    private static readonly HullPercentageTag = "hull_percentage"
    private static readonly StructurePercentageTag = "structure_percentage"
    private static readonly Template = "template"
    private static readonly Group = "group"
    private static readonly AllEnemyPropertyTags = [ 
        EnemyTiledObject.AiTag, EnemyTiledObject.AngleTag, EnemyTiledObject.HeatPercentageTag, EnemyTiledObject.ShieldPercentageTag,
        EnemyTiledObject.HullPercentageTag, EnemyTiledObject.StructurePercentageTag, EnemyTiledObject.Template, EnemyTiledObject.Group
    ]

    constructor(
        public ai: string,
        public angle: number,
        public heat: number,
        public shield: number,
        public hull: number,
        public structure: number,
        public template: string,
        public group: string
    )
    { 
        //
    }

    public static fromTileObject(object: Phaser.Types.Tilemaps.TiledObject)
    {
        if(object === undefined) {
            console.error("Reading properties from a tile object failed because the object is undefined.")
            return undefined
        } else if(object.properties === undefined || object.properties.length === 0) {
            console.error("Reading properties from a tile object failed because the properties of the object are either undefined or empty.")
            return undefined
        } else {
            const mappedProperties : any[] = EnemyTiledObject.AllEnemyPropertyTags.map(t => EnemyTiledObject.readPropertyFromObjectLayerObject(object, t, undefined))
            if(mappedProperties.find(p => p === undefined)) {
                console.error("Could not read one or more properties from a tile object.")
                return undefined
            } else {
                return new EnemyTiledObject(mappedProperties[0], mappedProperties[1], mappedProperties[2], mappedProperties[3], mappedProperties[4], mappedProperties[5], mappedProperties[6], mappedProperties[7])
            }
        }

    }

    protected static readPropertyFromObjectLayerObject<T>(object: Phaser.Types.Tilemaps.TiledObject, property: string, fallback: T)
    {
        if(object === undefined)
            return fallback
        if(object.properties === undefined || object.properties.length === 0)
            return fallback

        const val = object.properties.find(x => x.name === property)?.value ?? fallback
        return val
    }
}