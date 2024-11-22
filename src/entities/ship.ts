import { Sprite } from "pixi.js";
import { Entity } from "./entity";
import { Acceleration, Position } from "../types/position";
import { keyEventManager } from "../utils/key-listener";

export class Ship extends Entity {
	constructor(sprite: Sprite, position: Position) {
		super(sprite, position);

		keyEventManager.subscribe("a", () => this.acceleration.add(-1, 0), () => this.acceleration.add(1, 0))
		keyEventManager.subscribe("d", () => this.acceleration.add(1, 0), () => this.acceleration.add(-1, 0))
		keyEventManager.subscribe("w", () => this.acceleration.add(0, -1), () => this.acceleration.add(0, 1))
		keyEventManager.subscribe("s", () => this.acceleration.add(0, 1), () => this.acceleration.add(0, -1))
	}

	update(frameTime: number): void {
		
	}
}