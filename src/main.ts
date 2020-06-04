import Phaser from 'phaser'

import HelloWorldScene from './scenes/HelloWorldScene'

const config: Phaser.Types.Core.GameConfig = {
	type: Phaser.AUTO,
	width: 800,
	height: 600,
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
	scene: [HelloWorldScene]
}

export default new Phaser.Game(config)
