import { Movable, Movables, Vector2 } from "../components/movable"
import { Positioned } from "../utils/quadtree"
import { Drawable, Drawables } from "../components/drawable"

export abstract class Entity implements Positioned {
	//These exist purely to index into the quadtree map storage, then ID is used to index into the various components
	//No other data should be stored on an Entity
	public readonly id: number
	position: Vector2
	
	constructor(drawable: Drawable, movable: Movable) {
		this.id = Math.floor(Math.random() * 1000000)
		this.position = movable.position
		
		Movables.add(this.id, movable)
		Drawables.add(this.id, drawable)
	}
}

