import Phaser from 'phaser'

import Campaign_01_Room_001 from './scenes/Campaing_01_Room_001'
import Campaign_01_Room_002 from './scenes/Campaign_01_Room_002'

const isLinux = window.navigator.platform.indexOf("Linux") >= 0
const renderer = isLinux ? Phaser.CANVAS : Phaser.WEBGL

const config: Phaser.Types.Core.GameConfig = {
	type: renderer,
	width: 1920,
	height: 1080,
	physics: {
		default: 'arcade',
		arcade: {
			//gravity: { y: 200 }
		}
	},
	input: {
		keyboard: true,
		gamepad: true,
		mouse: true
	},
	scale: {
		width: 1920,
		height: 1080,
		mode: Phaser.Scale.ScaleModes.WIDTH_CONTROLS_HEIGHT
	},
	scene: [Campaign_01_Room_001, Campaign_01_Room_002]
}

export default new Phaser.Game(config)
