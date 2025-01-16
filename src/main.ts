import Phaser from 'phaser'
import PhaserNavMeshPlugin from "phaser-navmesh";

import { DefeatScene } from './scenes/DefeatScene';
import { PreloadScene } from './scenes/PreloadScene';
import TankSelectionScene from './scenes/TankSelectionScene';
import * as Campaign01 from './scenes/campaign_01/Campaign_01';
import * as Defense01 from './scenes/defense_01/Defense_01';
import { HeavyAutoCannonTemplate } from './entities/templates/Weapons';

const isLinux = window.navigator.platform.indexOf("Linux") >= 0
const renderer = isLinux ? Phaser.CANVAS : Phaser.WEBGL

const config: Phaser.Types.Core.GameConfig = {
	type: renderer,
	width: 1920,
	height: 1080,
	backgroundColor: '#000000',
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
		mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
		width: 1920,
		height: 1080,
		/*autoCenter: Phaser.Scale.CENTER_BOTH*/
	},
	scene: [ PreloadScene, DefeatScene, TankSelectionScene, ...Defense01.AllRooms ]
}

export default new Phaser.Game(config)
