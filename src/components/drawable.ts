import { Graphics, Sprite } from "pixi.js"
import { Movables } from "./movable"
import { Components, SingletonBase } from "./component-base"

export const Drawables = class DrawableComponents extends Components<Drawable> {}.getInstance<Drawable>()

export class Drawable extends SingletonBase {
	public sprite: Sprite

	constructor(sprite: Sprite) {
		super()
		sprite.anchor.set(0.5, 0.5)
		this.sprite = sprite
	}

	draw(graphics: Graphics, id: number): void {
		let movable = Movables.get(id)
		let x = movable.position.x
		let y = movable.position.y
		// let localTransform = this.sprite.localTransform
		// localTransform.translate(movable.position.x, movable.position.y)
		// localTransform.translate(this.sprite.getSize().width / 2,this.sprite.getSize().height / 2)
		// localTransform.rotate(movable.rotation)
		// localTransform.translate(-this.sprite.getSize().width / 2,-this.sprite.getSize().height / 2)

		// this.sprite.localTransform.copyFrom(localTransform)
		this.sprite.x = x
		this.sprite.y = y
		this.sprite.rotation = movable.rotation

		//graphics.setStrokeStyle(toStrokeStyle());
		// graphics.moveTo(movable.position.x, movable.position.y)
		// let positionAt2 = movable.getPositionAtTimeT(10)
		// let positionAt5 = movable.getPositionAtTimeT(1000)
		// graphics.quadraticCurveTo(positionAt2.x, positionAt2.y, positionAt5.x, positionAt5.y).stroke({})
	}
}