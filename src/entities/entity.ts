import { Sprite } from "pixi.js"
import { Acceleration, Position, Velocity } from "../types/position"

export abstract class Entity {
	public sprite: Sprite
	public readonly position: Position
	public readonly velocity: Velocity
	public readonly acceleration: Acceleration
	
	constructor(sprite: Sprite, position: Position) {
		this.sprite = sprite
		this.position = position
		this.velocity = new Velocity(0, 0)
		this.acceleration = new Acceleration(0, 0)
	}

	baseUpdate(frameTimeAdjustment: number) {
		this.velocity.accelerate(this.acceleration, frameTimeAdjustment)
		this.position.move(this.velocity, frameTimeAdjustment)
		this.update(frameTimeAdjustment)
	}

	/**
	 * 
	 * @param frameTimeAdjustment Fraction of the ideal frame time used; scale game logic using this for frame-rate independence.
	 */
	abstract update(frameTimeAdjustment: number): void

	draw(): void {
		this.sprite.x = this.position.x
		this.sprite.y = this.position.y
	}
}