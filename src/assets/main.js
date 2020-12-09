import Phaser from 'phaser'

const uiShieldText = document.querySelector("#status--shield");
const uiShootText = document.querySelector("#status--shoot");

const gameState = {
    coolDown: null,
    ui: {
        shieldText: uiShieldText,
        shootText: uiShootText
    }
};

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 850,
    scene: {
        preload,
        create,
        update
    },
    parent: "phaser"
};

function preload() {
    this.load.image('playerShip', '/assets/images/player.png');
    this.load.image('playerShip--Shield', '/assets/images/player-s.png');
    this.load.image('background', '/assets/images/space.png');
}

function create() {
    gameState.background = this.add.image(0, 0, 'background');
    gameState.background.setOrigin(0, 0);

    gameState.player = this.add.sprite(50, (config.height - 150), 'playerShip--Shield');
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

    gameState.ui.shieldText.classList.toggle('active');
    gameState.ui.shootText.classList.toggle('active');

    gameState.coolDown = game.time.addEvent({
        delay: 100,
        callback: clearCoolDown,
    });
}

function clearCoolDown() {
    gameState.playerCanSwitch = true;
}

function update() {
    if (gameState.cursors.space.isDown && gameState.playerCanSwitch === true) {
        switchPlayerState(this);
    }
}

const game = new Phaser.Game(config);