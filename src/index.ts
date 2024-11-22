import { Application, Sprite, Loader, TickerCallback, UPDATE_PRIORITY, LoaderResource } from 'pixi.js'
import { Entity } from './entities/entity'
import { Rock } from './entities/rock'
import { Ship } from './entities/ship'
import { Position } from './types/position'
import { keyEventManager } from './utils/key-listener'

//https://pixijs.download/v5.3.10/docs/PIXI.Application.html
const app = new Application({
    antialias: true,
    resolution: 1,
    resizeTo: window //why does it size itself wrong? and need to fix <body> margin issues
  })

document.body.appendChild(app.view)

let entities: Entity[] = []

const assets = {
  ['ship']: 'public/green box.png',
  ['rock']: 'public/green box.png',
}

let draw: TickerCallback<any> = (delta) => {
  entities.forEach(entity => {
    entity.draw()
  })
}

let gameLoop: TickerCallback<any> = (delta) => {
  entities.forEach(entity=>{
    entity.baseUpdate(delta)
  })
}

let loader = Loader.shared
Object.entries(assets).forEach(asset => {
  loader = loader.add(asset[0], asset[1])
})

loader.load((_, resources) => {
  const typedGuardedResources = resources as {
    [key in keyof typeof assets]: LoaderResource
  }
  let ship = new Ship(new Sprite(typedGuardedResources.ship.texture), new Position(5, 0))
  entities.push(ship)

  for(let index = 0; index < 10; index++) {
    let rock = new Rock(new Sprite(typedGuardedResources.rock.texture), new Position(index, index))
    entities.push(rock)
  }

  app.stage.addChild(...entities.map(entity => entity.sprite))

  app.ticker.add(draw, null, UPDATE_PRIORITY.INTERACTION)
  app.ticker.add(gameLoop, null, UPDATE_PRIORITY.NORMAL)
  
  keyEventManager.setContext("gameplay")
})