export class Position {
	public x: number
	public y: number
	
	constructor(x: number, y: number) {
		this.x = x
		this.y = y
	}

	move(velocity: Velocity, frameTimeAdjustment: number) {
		this.x += velocity.dx * frameTimeAdjustment
		this.y += velocity.dy * frameTimeAdjustment
		return this
	}
}

export class Velocity {
	public dx: number
	public dy: number
	
	constructor(dx: number, dy: number) {
		this.dx = dx
		this.dy = dy
	}

	accelerate(acceleration: Acceleration, frameTimeAdjustment: number) {
		this.dx += acceleration.ddx * frameTimeAdjustment
		this.dy += acceleration.ddy * frameTimeAdjustment
		return this
	}
}

export class Acceleration {
	public ddx: number
	public ddy: number

	constructor(ddx: number, ddy: number) {
		this.ddx = ddx
		this.ddy = ddy
	}

	add(ddx: number, ddy: number) {
		this.ddx += ddx
		this.ddy += ddy
		return this
	}
}