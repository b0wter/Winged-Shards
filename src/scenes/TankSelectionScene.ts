import InterfaceScene from './InterfaceScene';
import * as Tanks from '~/entities/templates/Tanks'
import { Tank, TankTemplate } from '~/entities/Tank';
import { UI_TEXT_DEPTH } from '~/utilities/Constants';
import { manufacturerToString } from '~/utilities/Manufacturers';
import PlayerInput from '~/input/PlayerInput';
import KeyboardMouseInput from '~/input/KeyboardMouseInput';
import GamePadInput from '~/input/GamePadInput';
import TriggerAxisInput from '~/input/TriggerAxisInput';
import { PlayerEntity } from '~/entities/Player';
import Campaign_01_Room_001 from './Campaing_01_Room_001';

class SelectorBox
{
    public static readonly borderColor = new Phaser.Display.Color(32, 32, 32).color
    public static readonly backgroundColor = new Phaser.Display.Color(16, 16, 16).color
    public static readonly activeBorderColors = [
        new Phaser.Display.Color(255, 216, 0).color,
        new Phaser.Display.Color(53, 179, 0).color,
        new Phaser.Display.Color(0, 38, 255).color
    ]
    public static readonly activeBackgroundColors = [
        new Phaser.Display.Color(56, 47, 0).color,
        new Phaser.Display.Color(19, 64, 0).color,
        new Phaser.Display.Color(20, 0, 77).color
    ]

    public setActiveFor(index: number)
    {
        this._activeBy = index
        this.setColors(index)
    }

    public setFinishedFor(index: number)
    {
        this._finishedBy = index
        this.setColors(index)
    }

    private _finishedBy = -1
    
    public get isFinished() { return this._finishedBy !== -1 }

    public get isActive() { return this._activeBy !== -1}

    private setColors(playerIndex: number)
    {
        this.background.fillColor = SelectorBox.backgroundColor
        this.border.fillColor = SelectorBox.borderColor

        if(playerIndex < 0 || playerIndex > 2)
            return

        if(this.isActive)
            this.border.fillColor = SelectorBox.activeBorderColors[playerIndex]

        if(this.isFinished) {
            this.border.fillColor = SelectorBox.activeBorderColors[playerIndex]
            this.background.fillColor = SelectorBox.activeBackgroundColors[playerIndex]
        }
    }

    constructor(
        public template: TankTemplate,
        public background: Phaser.GameObjects.Rectangle,
        public border: Phaser.GameObjects.Rectangle,
        public hullImage: Phaser.GameObjects.Image,
        public turretImage: Phaser.GameObjects.Image,
        public manufacturer: Phaser.GameObjects.Text,
        public modelName: Phaser.GameObjects.Text,
        public description: Phaser.GameObjects.Text,
        public readonly index: number,
        private _activeBy: number,
        )
    {
        this.setActiveFor(_activeBy)
    }

}

export default class TankSelectionScene extends InterfaceScene
{
    private readonly tankSelectorYOffset = 150
    private readonly tankSelectorXOffset = 40
    private readonly tankSelectorWidth = 220
    private readonly tankSelectorHeight = 200
    private readonly tankSelectorXMargin = 50
    private readonly tankSelectorYMargin = 40
    private readonly borderWidth = 3
    private readonly tankSelectorColumnCount = 7

    private readonly selectors : SelectorBox[] = []
    private inputs: PlayerInput[] = []
    private selections: number[] = []
    private finished: boolean[] = []

    private allFinished = false

    constructor()
    {
        super(TankSelectionScene.name)

        for(let i = 0; i < this.numberOfPlayers; i++) {
            this.selections.push(i)
            this.finished.push(false)
        }
    }

    create()
    {
        this.initGraphics()
        this.initInput(this.numberOfPlayers)
    }    

    update()
    {
        this.inputs.forEach(i => i.update())
        this.updateSelections()
        this.updateGraphics()
        this.updateFinished()
        this.changeIfAllFinished()
    }

    private updateSelections()
    {
        for(let i = 0; i < this.numberOfPlayers; i++)
        {
            if(this.finished[i])
                return

            function step(selections: number[], selectors: SelectorBox[], playerIndex: number, steps: number, stepSize: number) : number {
                const currentSelection = selections[playerIndex]
                let targetSelection = currentSelection + stepSize * steps
                if(targetSelection < 0 || targetSelection >= selectors.length)
                    return currentSelection
                if(selections.includes(targetSelection))
                    return step(selections, selectors, playerIndex, steps + Math.sign(steps), stepSize)
                else
                    return targetSelection
            }

            const leftAxis = this.inputs[i].leftAxis()
            if(leftAxis.horizontalFirstFrameDown) {
               this.selections[i] = step(this.selections, this.selectors, i, Math.ceil(leftAxis.horizontal), 1)
            }
            if(leftAxis.verticalFirstFrameDown) {
                this.selections[i] = step(this.selections, this.selectors, i, Math.ceil(leftAxis.vertical), this.tankSelectorColumnCount)
            }
        }
    }

    private updateGraphics()
    {
        this.selectors.forEach(s => s.setActiveFor(-1))
        this.selectors.forEach(s => s.setFinishedFor(-1))
        for(let i = 0; i < this.selections.length; i++) {
            // color for the box
            const box = this.selectors.find(selector => selector.index === this.selections[i])
            if(box !== undefined)
                if(this.finished[i])
                    box.setFinishedFor(i)
                else
                    box.setActiveFor(i)
        }
    }

    private updateFinished()
    {
        for(let i = 0; i < this.numberOfPlayers; i++) {
            if(this.inputs[i].action1.firstFrameDown || this.inputs[i].action2.firstFrameDown || this.inputs[i].action3.firstFrameDown || this.inputs[i].action4.firstFrameDown) {
                this.finished[i] = !this.finished[i]
            }
        }
    }

    private changeIfAllFinished()
    {
        const allFinished = this.finished.reduce((a, b) => a && b)
        if(allFinished && this.allFinished === false)
        {
            this.allFinished = true
            setTimeout(() => {
                this.cameras.main.fadeOut(500, 0, 0, 0, (_, progress) => {
                    if(progress >= 0.9999) {
                        this.scene.stop()
                        this.scene.start(Campaign_01_Room_001.name)
                    }
                })
            }, 500)
        }
    }

    private initGraphics()
    {
        const tanks = Tanks.AllTemplates
        this.initHeader()
        this.initTanks(tanks)
    }

    private initHeader()
    {
        const text = this.add.text(0, 50, "Select your tank")
        text.x = 1920 / 2 - text.width / 2
        text.depth = UI_TEXT_DEPTH
    }

    private initTanks(tanks: TankTemplate[])
    {
        for(let i = 0; i < tanks.length; i++)
            this.selectors.push(this.initTank(tanks[i], i))
    }

    private initTank(tank: TankTemplate, index: number) : SelectorBox
    {
        const position = this.computeTankPosition(index)
        const borderRectangle = this.add.rectangle(position.x, position.y, this.tankSelectorWidth, this.tankSelectorHeight, 0)
        const backgroundRectangle = this.add.rectangle(position.x, position.y, this.tankSelectorWidth - 2 * this.borderWidth, this.tankSelectorHeight - 2 * this.borderWidth, 0)
        const hullImage = this.add.image(position.x, position.y, tank.spriteKey)
        const hullTurret = this.add.image(position.x + tank.turretOffset.x, position.y, tank.turretSpriteKey)
        const manufacturer = this.add.text(position.x, position.y - this.tankSelectorHeight / 2 + 20, manufacturerToString(tank.manufacturer))
        manufacturer.x = position.x - manufacturer.width / 2
        const modelName = this.add.text(position.x, manufacturer.y + manufacturer.height + 2, tank.modelName)
        modelName.x = position.x - modelName.width / 2
        const description = this.add.text(position.x, position.y + this.tankSelectorHeight / 2 - 20, tank.description)
        description.x = position.x - description.width / 2
        description.y = description.y - description.height

        return new SelectorBox(tank, backgroundRectangle, borderRectangle, hullImage, hullTurret, manufacturer, modelName, description, index, index < this.numberOfPlayers ? index : -1)
    }

    private computeTankPosition(index: number) : Phaser.Geom.Point
    {
        const position = new Phaser.Geom.Point(index % this.tankSelectorColumnCount, Math.floor(index / 7))
        const worldPosition = new Phaser.Geom.Point(this.tankSelectorXOffset + position.x * (this.tankSelectorWidth + this.tankSelectorXMargin) + this.tankSelectorWidth / 2, this.tankSelectorYOffset + position.y * (this.tankSelectorHeight + this.tankSelectorYMargin) + this.tankSelectorHeight / 2)
        return worldPosition
    }

    private initInput(numberOfPlayers: number)
    {
        this.inputs.slice()
        for(let i = 0; i < numberOfPlayers; i++)
        {
            if(i === 0)
                this.inputs.push(new KeyboardMouseInput(this, undefined))
            else
                this.inputs.push(new GamePadInput())
        }
    }
}