import { Graphics, Matrix } from "pixi.js"
import { Entity } from "../entities/entity"
import { QuadTree } from "../utils/quadtree"
import { Rectangle } from "../components/movable"
import { Drawables } from "../components/drawable"

export class GameLayer {
	public readonly entities: QuadTree<Entity>
	public readonly size: { width: number, height: number }
	public readonly position: { x: number, y: number }

	constructor(xPos: number, yPos: number, width: number, height: number) {
		this.entities = new QuadTree<Entity>(new Rectangle(xPos, yPos, width, height))
		this.size = { width, height }
		this.position = { x: xPos, y: yPos }
	}

	draw(graphics: Graphics): void {
		graphics.transform(Matrix.shared.translate(this.position.x, this.position.y))
		Drawables.forEach(drawable => {
			drawable.value.draw(graphics, drawable.key)
		})
	}
}