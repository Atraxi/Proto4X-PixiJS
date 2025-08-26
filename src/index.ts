import { Application, Assets, ContainerChild, Graphics, Sprite, UPDATE_PRIORITY, type IRenderLayer } from 'pixi.js'
import { Rock } from './entities/rock'
import { Ship } from './entities/ship'
import { Movable, Movables, Vector2 } from './components/movable'
import { keyEventManager } from './utils/key-listener'
import { GameLayer } from './world/game-layer'

import './styles/index.css'
import { debugUtils } from './utils/debug'
import { Drawable, Drawables } from './components/drawable'

let app = new Application();

(async () => {
  await app.init({
    // antialias: true,
    // resolution: 1,
    resizeTo: window //why does it size itself wrong? and need to fix <body> margin issues
  })

  document.body.appendChild(app.canvas)

  const assets = [
    { alias: 'ship', src: 'public/green box arrow.png' },
    { alias: 'rock', src: 'public/green box.png' },
  ]

  await Assets.load(assets)

  const graphics = new Graphics();
  app.stage.addChild(graphics);

  let world = new GameLayer(100, 100, app.screen.width-200, app.screen.height-200)

  let ship = new Ship(new Drawable(Sprite.from('ship')), new Movable({position: new Vector2(400, 400)}, world), 0.5)
  world.entities.add(ship)

  for(let index = 0; index < 10; index++) {
    let rock = new Rock(new Drawable(Sprite.from('rock')), new Movable({position: new Vector2(500 + index*50, 500 + index*20)}, world))
    world.entities.add(rock)
  }
  
  Drawables.forEach(drawable => {
    app.stage.addChild(drawable.value.sprite)
  })

  app.ticker.add((delta) => {
    graphics.clear()
    world.draw(graphics)
    debugUtils.renderDebugInfoIfEnabled(delta)
  }, null, UPDATE_PRIORITY.LOW)

  app.ticker.add((delta) => {
    Movables.getAll().forEach(movable => movable.update(delta.deltaTime))
  }, null, UPDATE_PRIORITY.NORMAL)

  app.ticker.add((delta) => {
    keyEventManager.update()
  }, null, UPDATE_PRIORITY.INTERACTION)

  keyEventManager.setContext("gameplay")
})();

let Game = {
  addToStage(entity: ContainerChild | IRenderLayer) {
    app.stage.addChild(entity);
  },
  multiplyGameSpeed(multiplier: number) {
    app.ticker.speed *= multiplier;
  }
}
export { Game }