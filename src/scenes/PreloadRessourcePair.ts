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
}