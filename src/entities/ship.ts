import { Matrix, Sprite } from "pixi.js";
import { Entity } from "./entity";
import { Movable, Vector2 } from "../components/movable";
import { keyEventManager } from "../utils/key-listener";
import { Drawable } from "../components/drawable";

export class Ship extends Entity {
	//TODO purge me?
	readonly thrust: number
	constructor(drawable: Drawable, movable: Movable, thrust: number) {
		super(drawable, movable);

		this.thrust = thrust
		
		//TODO: Strafing? Acceleration is directionless now, so I'll need some way to provide an optional directional thrust
		// keyEventManager.subscribe("a", () => movable.accelerate(thrust), () => movable.accelerate(-thrust))
		// keyEventManager.subscribe("d", () => movable.accelerate(thrust), () => movable.accelerate(-thrust))

		keyEventManager.subscribe(keyEventManager.getKeyCombosForSimpleCommonActions("up"),
			() => movable.accelerateRelativeToRotation(new Vector2(0, -thrust)),
			() => movable.accelerateRelativeToRotation(new Vector2(0, 0)),
			"gameplay",
			true)
		keyEventManager.subscribe(keyEventManager.getKeyCombosForSimpleCommonActions("down"),
			() => movable.accelerateRelativeToRotation(new Vector2(0, thrust)),
			() => movable.accelerateRelativeToRotation(new Vector2(0, 0)),
			"gameplay",
			true)

		let angularAcceleration = Math.PI * 2 / 5000
		keyEventManager.subscribe(keyEventManager.getKeyCombosForSimpleCommonActions("left"),
			() => movable.rotate(-angularAcceleration),
			() => movable.rotate(angularAcceleration))
		keyEventManager.subscribe(keyEventManager.getKeyCombosForSimpleCommonActions("right"),
			() => movable.rotate(angularAcceleration),
			() => movable.rotate(-angularAcceleration))
	}
}