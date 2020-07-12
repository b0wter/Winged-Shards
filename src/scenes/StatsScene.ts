import BaseScene from './BaseScene';
import { PreloadRessourceList } from './PreloadRessourcePair';
import { AllTemplates } from '~/entities/templates/Weapons';

export class StatsScene extends BaseScene
{
    constructor()
    {
        super("stats")
    }

    create()
    {
        const text = AllTemplates.map(t => t.stats).join("\r\n\r\n")
        this.add.text(20, 20, text)
    }

    createPreloadRessourcePairs()
    {
        return new PreloadRessourceList()
    }
}