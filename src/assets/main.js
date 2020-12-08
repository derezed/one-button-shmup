import Phaser from 'phaser'

const gameState = {
    coolDown: null,
};

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 850,
    scene: {
        preload,
        create,
        update
    }
};

function preload() {
    this.load.image('playerShip', '/assets/images/player.png');
    this.load.image('playerShip--Shield', '/assets/images/player-s.png');
    this.load.image('background', '/assets/images/space.png');
}

function create() {
    gameState.background = this.add.image(0, 0, 'background');
    gameState.background.setOrigin(0, 0);

    gameState.player = this.add.sprite(50, (config.height - 50), 'playerShip--Shield');
    gameState.playerState = 0;
    gameState.player.setScale(.2);
    gameState.playerCanSwitch = true;

    this.tweens.add({
        targets: gameState.player,
        x: config.width - 50,
        duration: 5000,
        ease: 'Sine.easeInOut',
        loop: -1,
        yoyo: true,
    });

    gameState.player.setInteractive();
    gameState.cursors = this.input.keyboard.createCursorKeys();
}

function switchPlayerState(game) {
    if (gameState.playerState == 0) {
        gameState.player.setTexture('playerShip');
        gameState.playerState = 1;
        gameState.playerCanSwitch = false;
    } else if (gameState.playerState == 1) {
        gameState.player.setTexture('playerShip--Shield');
        gameState.playerState = 0;
        gameState.playerCanSwitch = false;
    }

    gameState.coolDown = game.time.addEvent({
        delay: 100,
        callback: clearCoolDown,
    });
}

function clearCoolDown() {
    console.log("Cool Down Up");
    gameState.playerCanSwitch = true;
}

function update() {
    if (gameState.cursors.space.isDown && gameState.playerCanSwitch === true) {
        switchPlayerState(this);
    }
}

const game = new Phaser.Game(config);