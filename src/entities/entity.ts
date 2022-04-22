import { Sprite } from "pixi.js";

export abstract class Entity {
	private _sprite: Sprite;
	//private _position: Position; //TODO do I want/need this? It is build into the sprite anyway
	
	constructor(sprite: Sprite) {
		this._sprite = sprite;
		//this._position = position;
	}

	public getSprite() {
		return this._sprite;
	}

	abstract update(frameTime: number): void;

	abstract draw(frameTime: number): void;
}