import { Application, Sprite, Loader, TickerCallback, UPDATE_PRIORITY, LoaderResource,  } from 'pixi.js';
import { Entity } from './entities/entity';
import { Rock } from './entities/rock';
import { Ship } from './entities/ship';

//https://pixijs.download/v5.3.10/docs/PIXI.Application.html
const app = new Application({
    antialias: true,    // default: false
    transparent: false, // default: false
    resolution: 1,       // default: 1
    resizeTo: window,
  });

document.body.appendChild(app.view);

let entities: Entity[] = [];

const assets = {
  ['ship']: 'public/green box.png',
  ['rock']: 'public/green box.png',
};

let draw: TickerCallback<any> = (delta) => {
  entities.forEach(entity => {
    entity.draw(delta);
  });
}

let gameLoop: TickerCallback<any> = (delta) => {
  entities.forEach(entity=>{
    entity.update(delta);
  });
}

let loader = Loader.shared;
Object.entries(assets).forEach(asset => {
  loader = loader.add(asset[0], asset[1]);
});

loader.load((_, resources) => {
  const typedGuardedResources = resources as {
    [key in keyof typeof assets]: LoaderResource;
  };
  let ship = new Ship(new Sprite(typedGuardedResources.ship.texture));
  entities.push(ship);

  for(let index = 0; index < 10; index++) {
    let rock = new Rock(new Sprite(typedGuardedResources.rock.texture));
    entities.push(rock);
  }

  app.stage.addChild(...entities.map(entity => entity.getSprite()));

  app.ticker.add(draw, null, UPDATE_PRIORITY.HIGH);
  app.ticker.add(gameLoop, null, UPDATE_PRIORITY.NORMAL);
});