import { Ticker, Text, Graphics } from "pixi.js"
import { Movable, Movables, Vector2 } from "../components/movable"
import { keyEventManager } from "./key-listener"
import { Game } from ".."

class DebugUtils {
	isDebug	: boolean

	private debugComponents: Map<number, DebugRenderer> = new Map()

	constructor() {
		this.isDebug = false
		//Due to some initialization order issues, we need to delay the subscription of these keys
		
		keyEventManager.subscribe(keyEventManager.getKeyCombosForSimpleCommonActions("debug"),
			this.toggleDebug.bind(this))
		keyEventManager.subscribe(keyEventManager.getKeyCombosForSimpleCommonActions("speedDown"),
			this.reduceGameSpeed.bind(this))
		keyEventManager.subscribe(keyEventManager.getKeyCombosForSimpleCommonActions("speedUp"),
			this.increaseGameSpeed.bind(this))
	}

	toggleDebug() {
		this.isDebug = !this.isDebug
		console.log("Debug mode: " + this.isDebug)
		if(this.isDebug) {
			for(const [index, movable] of Movables)
			{
				this.debugComponents.set(index, new DebugRendererMovable(movable))
			}
			this.debugComponents.set(0, new DebugRendererGlobal())
		} else {
			this.debugComponents.forEach(debugComponent => {
				debugComponent.destroy()
			})
			this.debugComponents.clear()
		}
	}

	reduceGameSpeed() {
		if(!this.isDebug) {
			return
		}
		Game.multiplyGameSpeed(0.5)
	}
	increaseGameSpeed() {
		if(!this.isDebug) {
			return
		}
		Game.multiplyGameSpeed(2)
	}

	renderDebugInfoIfEnabled(delta: Ticker) {
		if(!this.isDebug) {
			return
		}
		this.debugComponents.forEach(debugComponent => {
			debugComponent.render(delta)
		})
	}
}

abstract class DebugRenderer {
	abstract render(delta: Ticker): void
	abstract destroy(): void
}

class DebugRendererMovable extends DebugRenderer {
	
	private movable: Movable
	private positionText: Text
	private graphics: Graphics

	constructor(movable: Movable) {
		super()
		this.movable = movable
		this.graphics = new Graphics()
		Game.addToStage(this.graphics)
		this.positionText = new Text({ text: 'Position: 0,0', style: {fill: {color: 'white'}, fontSize: 10}})
		this.positionText.x = movable.position.x
		this.positionText.y = movable.position.y
		Game.addToStage(this.positionText)
	}

	override render(delta: Ticker) {
		this.positionText.text = 
`Position: ${this.movable.position.x.toFixed(2)}, ${this.movable.position.y.toFixed(2)}
Velocity: ${this.movable.velocity.x.toFixed(2)}, ${this.movable.velocity.y.toFixed(2)}
Acceleration: ${this.movable.acceleration.x.toFixed(2)}, ${this.movable.acceleration.y.toFixed(2)}
Rotation: ${(this.movable.rotation / Math.PI).toFixed(2)} PI
Angular Velocity: ${(this.movable.angularVelocity / Math.PI).toFixed(2)} PI
Angular Acceleration: ${(this.movable.angularAcceleration / Math.PI).toFixed(2)} PI`
		this.positionText.x = this.movable.position.x + 25
		this.positionText.y = this.movable.position.y - 15
		let scaledVelocity = this.movable.velocity.clone().multiplyScalar(50)
		let scaledAcceleration = this.movable.acceleration.clone().multiplyScalar(50)
		let rotationVector = Vector2.UNIT_RIGHT.clone().rotate(this.movable.rotation - (Math.PI / 2)).multiplyScalar(50)
		this.graphics.clear()
			.beginPath()
			.moveTo(this.movable.position.x, this.movable.position.y)
			.lineTo(this.movable.position.x + rotationVector.x, this.movable.position.y + rotationVector.y)
			.stroke({ width: 2, color: 'yellow' })
			.moveTo(this.movable.position.x, this.movable.position.y)
			.lineTo(this.movable.position.x + scaledVelocity.x, this.movable.position.y + scaledVelocity.y)
			.stroke({ width: 2, color: 'green' })
			.lineTo(this.movable.position.x + scaledVelocity.x + scaledAcceleration.x, this.movable.position.y + scaledVelocity.y + scaledAcceleration.y)
			.stroke({ width: 2, color: 'blue' })
	}
	
	override destroy(): void {
		this.graphics.destroy()
		this.positionText.destroy()
	}
}

class DebugRendererGlobal extends DebugRenderer {
	basicText: Text
	constructor() {
		super()
		this.basicText = new Text({ text: 'FPS: 0', style: {fill: {color: 'white'}, fontSize: 10}})
		this.basicText.x = 10
		this.basicText.y = 10
		Game.addToStage(this.basicText)
	}

	
	render(delta: Ticker) {
		this.basicText.text = 
`FPS: ${delta.FPS.toFixed(2)}
Delta: ${delta.deltaTime.toFixed(4)}
Speed: ${delta.speed.toFixed(2)}

Keystates:`
	keyEventManager.activeKeys.forEach((value, key) => {
		this.basicText.text += `\n${key}`
		})
	}
	
	override destroy(): void {
		this.basicText.destroy()
	}
}

let debugUtils = new DebugUtils()
export { debugUtils }