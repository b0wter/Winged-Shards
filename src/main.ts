import Phaser from 'phaser'
import PhaserNavMeshPlugin from "phaser-navmesh";

import Campaign_01_Room_001 from './scenes/Campaing_01_Room_001'
import Campaign_01_Room_002 from './scenes/Campaign_01_Room_002'
import { DefeatScene } from './scenes/DefeatScene';
import { PreloadScene } from './scenes/PreloadScene';
import TankSelectionScene from './scenes/TankSelectionScene';

const isLinux = window.navigator.platform.indexOf("Linux") >= 0
const renderer = isLinux ? Phaser.CANVAS : Phaser.WEBGL

const config: Phaser.Types.Core.GameConfig = {
	type: renderer,
	width: 1920,
	height: 1080,
	plugins: {
		scene: [
		  { key: "NavMeshPlugin", plugin: PhaserNavMeshPlugin, mapping: "navMeshPlugin", start: true }
		]
	},	
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
	/*
	render: {
		pixelArt: true,
		
	},
	zoom: 1,
	*/
	scale: {
		width: 1920,
		height: 1080,
		mode: Phaser.Scale.ScaleModes.WIDTH_CONTROLS_HEIGHT
	},
	scene: [ PreloadScene, Campaign_01_Room_001, Campaign_01_Room_002, DefeatScene, TankSelectionScene ]
}

export default new Phaser.Game(config)
