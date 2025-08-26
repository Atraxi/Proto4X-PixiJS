import { PointData } from "pixi.js"
import { GameLayer } from "../world/game-layer"
import { DeepReadonly } from "../types/deep-readonly"
import { Components } from "./component-base"

export class Position {
	position: Vector2

	constructor(position: Vector2) {
		this.position = position
	}
}

export class Movable extends Position {
	velocity: Vector2
	acceleration: Vector2

	rotation: number
	angularVelocity: number
	angularAcceleration: number

	friction: number

	maxSpeed: number
	maxThrust: number

	maxAngularVelocity: number
	maxAngularAcceleration: number

	public gameLayer: GameLayer
	
	constructor({
			position = new Vector2(),
			velocity = new Vector2(),
			acceleration = new Vector2(),

			rotation = 0,
			angularVelocity = 0,
			angularAcceleration = 0,

			friction = 0.005,

			maxSpeed = 500,
			maxThrust: maxThrust = 100,

			maxAngularVelocity = Math.PI/4,
			maxAngularAcceleration = Math.PI/8
		}: Partial<Movable>, gameLayer: GameLayer) {
		super(position)
		this.velocity = velocity
		this.acceleration = acceleration

		this.rotation = rotation
		this.angularVelocity = angularVelocity
		this.angularAcceleration = angularAcceleration

		this.friction = friction

		this.maxSpeed = maxSpeed
		this.maxThrust = maxThrust

		this.maxAngularVelocity = maxAngularVelocity
		this.maxAngularAcceleration = maxAngularAcceleration
		this.gameLayer = gameLayer
	}

	update(deltaTime: number): void {
    this.velocity.add(this.acceleration.clone().multiplyScalar(deltaTime));
		if(this.velocity.getMagnitude() > this.maxSpeed) {
			this.velocity = this.velocity.normalize().multiplyScalar(this.maxSpeed)
		}
		this.velocity.multiplyScalar(1 - this.friction)
    this.position.add(this.velocity.clone().multiplyScalar(deltaTime));
		

    this.angularVelocity += this.angularAcceleration * deltaTime;
		if(this.angularVelocity > this.maxAngularVelocity) {
			this.angularVelocity = this.maxAngularVelocity
		}
		this.angularVelocity *= 1 - this.friction
    this.rotation += this.angularVelocity * deltaTime;
		if(this.rotation > Math.PI * 2) {
			this.rotation -= Math.PI * 2
		} else if(this.rotation < 0) {
			this.rotation += Math.PI * 2
		}

		this.boundsCheck()
  }

	accelerateRelativeToRotation(thrust: Vector2) {
		this.accelerate(thrust.rotate(this.rotation))
	}

	accelerate(acceleration: Vector2) {
		this.acceleration = acceleration
		if(this.acceleration.getMagnitude() > this.maxThrust) {
			this.acceleration = this.acceleration.normalize().multiplyScalar(this.maxThrust)
		}
	}

	rotate(rotation: number): void {
		this.angularAcceleration += rotation
	}

	getPositionAtTimeT(time: number) {
		let xAtTime = this.position.x + this.velocity.x * time + 0.5 * this.acceleration.x * time**2
		let yAtTime = this.position.y + this.velocity.y * time + 0.5 * this.acceleration.y * time**2
		return new Vector2(xAtTime, yAtTime)
	}

	private boundsCheck() {
		if(this.position.x > this.gameLayer.size.width) {
			this.position.x = this.gameLayer.size.width
			this.velocity.x = 0
		} else if(this.position.x < 0) {
			this.position.x = 0
			this.velocity.x = 0
		}
		
		if(this.position.y > this.gameLayer.size.height) {
			this.position.y = this.gameLayer.size.height
			this.velocity.y = 0
		} else if(this.position.y < 0) {
			this.position.y = 0
			this.velocity.y = 0
		}
	}
}

export class Vector2 implements PointData {
	public x: number
	public y: number

	static readonly UNIT_RIGHT: DeepReadonly<Vector2> = Object.freeze(new Vector2(1, 0))
	
	constructor(x: number = 0, y: number = 0) {
		this.x = x
		this.y = y
	}

	clone() {
		return new Vector2(this.x, this.y)
	}

	add(otherPoint: PointData) {
		this.x += otherPoint.x
		this.y += otherPoint.y
		return this
	}

	multiplyScalar(scalar: number) {
    this.x *= scalar
    this.y *= scalar
		return this
  }

	rotate(rotation: number) {
		let newX = (Math.cos(rotation) * this.x) - (Math.sin(rotation) * this.y)
		this.y = (Math.sin(rotation) * this.x) + (Math.cos(rotation) * this.y)
		this.x = newX
		return this
	}

	getMagnitude() {
		return Math.sqrt(this.x**2 + this.y**2)
	}

	normalize() {
		let magnitude = this.getMagnitude()
		if (magnitude < 0.0001) {
			return this
		} else {
			return this.multiplyScalar(1/magnitude)
		}
	}
}

export class Rectangle {
	x: number
	y: number
	width: number
	height: number

	constructor(x: number, y: number, width: number, height: number) {
		this.x = x
		this.y = y
		this.width = width
		this.height = height
	}

	contains(point: Vector2): boolean {
    return (
      point.x >= this.x &&
      point.x < this.x + this.width &&
      point.y >= this.y &&
      point.y < this.y + this.height
    );
  }

	intersects(other: Rectangle): boolean {
			return (
				this.x < other.x + other.width &&
				this.x + this.width > other.x &&
				this.y < other.y + other.height &&
				this.y + this.height > other.y
			);
		}
}

export const Movables = class Movables extends Components<Movable>{}.getInstance(Movable)