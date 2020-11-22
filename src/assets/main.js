
import * as PIXI from 'pixi.js';

let app = new PIXI.Application({
  width: 768,
  height: 768,
  antialias: true,
});

const loader = PIXI.Loader.shared;

const sprite = {};

let gameState;
let playerState = {
  "direction": null,
  "speed": 2,
  "shipState": 1, // 0 for shielded; 1 for shooting
};
let player;

loader.add('playerShip', 'assets/images/player/P-blue-a.png')
      .add('playerShipShielded', 'assets/images/player/P-blue-b2.png');

loader.load(setUp);

function setUp() {
  // add view to page
  document.querySelector(".game-wrapper").appendChild(app.view);

  // build player ship
  player = PIXI.Sprite.from('assets/images/player/P-blue-a.png');

  player.anchor.set(0.5);

  player.width = 128;
  player.height = 128;

  player.x = app.screen.width / 2;
  
  player.y = app.screen.height - player.width / 2;

  // player interactions
  app.stage.interactive = true;
  app.stage.on("click", changeShipState);
  app.stage.hitArea = new PIXI.Rectangle(0, 0, app.screen.width, app.screen.height)

  // add player to stage
  app.stage.addChild(player);

  app.ticker.add(delta => gameLoop(delta));
}

function changeShipState() {
  let texture = null;
  const nextState = playerState.shipState === 0 ? 1 : 0;
  updatePlayerState("shipState", nextState);


  if (nextState === 0) {
    texture = PIXI.Texture.from('assets/images/player/P-blue-b2.png');
    player.width = 128;
    player.height = 128;
  } else {
    texture = PIXI.Texture.from('assets/images/player/P-blue-a.png');
  }

  player.texture = texture;

  console.log(nextState);
}

function movePlayer() {
  
  if (playerState.direction === null) {
    let directionValue = Math.floor(Math.random() * Math.floor(2));
    directionValue = directionValue ? "right" : "left";

    updatePlayerState("direction", directionValue);
  }

  if (playerState.direction === "right") {
    player.x += playerState.speed; 
  } else {
    player.x -= playerState.speed;
  }

  if (player.x === app.screen.width) {
    updatePlayerState("direction", "left");
  } else if (player.x == 0) {
    updatePlayerState("direction", "right");
  }
}

function updatePlayerState(key, value) {
  playerState[key] = value;
}

function gameLoop() {
  movePlayer();
}