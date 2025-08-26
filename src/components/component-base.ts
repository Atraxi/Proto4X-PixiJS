import { DeepReadonly } from "../types/deep-readonly"

export abstract class SingletonBase {
  private static _instanceMap = new Map<any, Components<any>>()

  protected constructor() {}

  protected static getInstanceBase<T, C extends Components<T> = Components<T>>(this: new () => C, component: T): C {
    if(!SingletonBase._instanceMap.has(component)) {
			SingletonBase._instanceMap.set(component, new this())
		}
		return SingletonBase._instanceMap.get(component) as C
  }
}

export abstract class Components<T> extends SingletonBase implements MapIterator<[number, T]> {
	private components: Map<number, T> = new Map()
	
	protected constructor() {
		super()
		if (new.target === Components) {
			//The way we invoke the constructor function from a static context in the base class bypasses TypeScripts ability
			// to enforce this class being abstract, and abstract is erased at runtime. So explicitly check and throw ourselves.
      throw new Error("Components<T> must be subclassed and cannot be instantiated directly.");
    }
	}

	static getInstance<T, C extends Components<T> = Components<T>>(component: T): C {
		return super.getInstanceBase(component) as C
  }

	forEach(callback: (value: {key: number, value: T}, index: number) => void, thisArg?: any): void {
		let index = 0;
		for (const entry of this) {
			callback.call(thisArg, {key: entry[0], value: entry[1]}, index);
			index++;
		}
	}

	[Symbol.iterator](): IterableIterator<[number, T]> {
		return this.components[Symbol.iterator]();
	}

	next(): IteratorResult<[number, T], undefined> {
		const iterator = this.components[Symbol.iterator]();
		return iterator.next();
	}

	add(id: number, component: T) {
		this.components.set(id, component)
	}

	get(id: number): T {
		const component = this.components.get(id)
		if (!component) {
			throw new Error(`Component with id ${id} does not exist`)
		}
		return component
	}

	getAll() {
		return this.components as DeepReadonly<Map<number, T>>
	}

	remove(id: number) {
		this.components.delete(id)
	}
}
