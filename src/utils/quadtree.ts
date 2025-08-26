import { Vector2, Rectangle, Position } from "../components/movable";

export interface Positioned extends Position {
  readonly position: Vector2;
  readonly id: number;
}

class QuadTreeInternal<TreeMember extends Positioned> implements Iterable<TreeMember, TreeMember, TreeMember> {
  private capacity = 50;
  protected entities: TreeMember[];
  protected children: QuadTreeInternal<TreeMember>[] | null;

  constructor() {
    this.entities = [];
    this.children = null;
  }

  *[Symbol.iterator](): Iterator<TreeMember> {
    // Yield all entities in this node
    for (const entity of this.entities) {
      yield entity;
    }
    // Recursively yield from children
    if (this.children) {
      for (const child of this.children) {
        yield* child;
      }
    }
  }

  delete(value: TreeMember): boolean {
    // Try to remove from this node
    const index = this.entities.indexOf(value);
    if (index !== -1) {
      this.entities.splice(index, 1);
      return true;
    }
    // Try to remove from children
    if (this.children) {
      for (const child of this.children) {
        if (child.delete(value)) {
          return true;
        }
      }
    }
    return false;
  }

  has(value: TreeMember): boolean {
    if (this.entities.includes(value)) {
      return true;
    }
    if (this.children) {
      for (const child of this.children) {
        if (child.has(value)) {
          return true;
        }
      }
    }
    return false;
  }

  get size(): number {
    let count = this.entities.length;
    if (this.children) {
      for (const child of this.children) {
        count += child.size;
      }
    }
    return count;
  }

  get [Symbol.toStringTag](): string {
    return "QuadTree";
  }

  protected add(entity: TreeMember, bounds: Rectangle) {
    if(!bounds.contains(entity.position)) {
      throw RangeError;
    }
    
    if (this.entities.length < this.capacity && bounds.contains(entity.position)) {
      this.entities.push(entity);
      return;
    } else if (!this.children) {
      this.children = [
        new QuadTreeInternal<TreeMember>(),
        new QuadTreeInternal<TreeMember>(),
        new QuadTreeInternal<TreeMember>(),
        new QuadTreeInternal<TreeMember>(),
      ];
      for (const child of this.children) {
        if (entity.position.x < bounds.width / 2) {
          if(entity.position.y < bounds.height / 2) {
            child.add(entity, new Rectangle(
              bounds.x,
              bounds.y,
              bounds.width / 2,
              bounds.height / 2));
            return;
          } else {
            child.add(entity, new Rectangle(
              bounds.x,
              bounds.y + bounds.height / 2,
              bounds.width / 2,
              bounds.height));
            return;
          }
        } else {
          if(entity.position.y < bounds.height / 2) {
            child.add(entity, new Rectangle(
              bounds.x + bounds.width / 2,
              bounds.y,
              bounds.width,
              bounds.height / 2));
            return;
          } else {
            child.add(entity, new Rectangle(
              bounds.x + bounds.width / 2,
              bounds.y + bounds.height / 2,
              bounds.width,
              bounds.height ));
            return;
          }
        }
      }
    }
  }

  protected query(range: Rectangle, bounds: Rectangle): TreeMember[] {
    const found: TreeMember[] = [];

    if (!bounds.intersects(range)) {
      return found;
    }

    // Check entities in this node
    for (const entity of this.entities) {
      if (range.contains(entity.position)) {
        found.push(entity);
      }
    }

    if (this.children) {
      for (const child of this.children!) {
        found.push(...child.query(range, bounds));
      }
    }

    return found;
  }
}

export class QuadTree<TreeMember extends Positioned> extends QuadTreeInternal<TreeMember> {
  private bounds: Rectangle;
  constructor(bounds: Rectangle) {
    super();
    this.bounds = bounds;
  }

  override query(range: Rectangle): TreeMember[] {
    return super.query(range, this.bounds);
  }

  override add(entity: TreeMember): this {
    super.add(entity, this.bounds);
    return this;
  }

  protected canContain(entity: TreeMember): boolean {
    return this.bounds.contains(entity.position);
  }
  
  forEach(callbackfn: (value: TreeMember, value2: TreeMember, set: QuadTree<TreeMember>) => void, thisArg?: any): void {
    for (const entity of this) {
      callbackfn.call(thisArg, entity, entity, this);
    }
  }
}