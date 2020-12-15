import Phaser from 'phaser';

const uiShieldText = document.querySelector("#status--shield");
const uiShootText = document.querySelector("#status--shoot");
const uiRecharge = document.querySelector("#status--recharge");
const uiScoreText = document.querySelector("#ship-state--player-score");

const gameState = {
    coolDown: null,
    shootTimer: null,
    enemySpawnTimer: null,
    canSpawn: 1,
    ui: {
        shieldText: uiShieldText,
        shootText: uiShootText,
        scoreText: uiScoreText,
    },
    score: 0,
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
    parent: "phaser",
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
};

function preload() {
    this.load.image('playerShip', '/assets/images/player.png');
    this.load.image('playerShip--Shield', '/assets/images/player-s.png');
    this.load.image('background', '/assets/images/space.png');
    this.load.image('bullet', '/assets/images/bullet.png');
    this.load.image('enemy1', '/assets/images/enemy-1.png');
}

function create() {
    this.physics.world.setBounds(0, 0, 800, 850);
    
    gameState.ui.scoreText.innerHTML = gameState.score;

    gameState.bullets = this.physics.add.group({
        defaultKey: 'bullet',
        maxSize: 25
    });

    gameState.background = this.add.image(0, 0, 'background');
    gameState.background.setOrigin(0, 0);

    gameState.player = this.physics.add.sprite(50, (config.height - 150), 'playerShip--Shield');
    gameState.playerState = 0;
    gameState.canShoot = 1;
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

    gameState.player.setImmovable();
    gameState.player.setInteractive();
    gameState.cursors = this.input.keyboard.createCursorKeys();

    gameState.enemy1 = this.physics.add.group({
        defaultKey: 'enemy1',
        maxSize: 25
    });

    this.physics.add.collider(gameState.bullets, gameState.enemy1, scoreEnemy, null, this);
    this.physics.add.collider(gameState.player, gameState.enemy1, playerHit, null, this);
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

    uiRecharge.classList.remove("full-charge");
    
    gameState.ui.shieldText.classList.toggle('active');
    gameState.ui.shootText.classList.toggle('active');

    gameState.coolDown = game.time.addEvent({
        delay: 300,
        callback: clearCoolDown,
    });
}

function clearCoolDown() {
    gameState.playerCanSwitch = true;
    uiRecharge.classList.add("full-charge");
}

function clearShootDown() {
    gameState.canShoot = 1;
}

function shoot(game) {
    const bullet = gameState.bullets.get(gameState.player.x, gameState.player.y -  50);
    
    if (bullet) {
        gameState.canShoot = 0;

        bullet.setScale(.2);

        bullet.setActive(true);

        bullet.setVisible(true);

        bullet.body.velocity.y = -300;

        gameState.shootTimer = game.time.addEvent({
            delay: 250,
            callback: clearShootDown,
        });
    }
}

function spawnEnemy(game) {
    let enemyX = 0;

    enemyX = Math.floor(Math.random() * config.width);

    const enemy = gameState.enemy1.get(enemyX, 25)
    enemy.setScale(.2);
    enemy.setActive(true);
    enemy.setVisible(true);
    enemy.setImmovable();

    enemy.body.velocity.y = 300;

    gameState.canSpawn = 0;

    gameState.enemySpawnTimer = game.time.addEvent({
        delay: 1500,
        callback: clearSpawnTimer
    });
}

function clearSpawnTimer() {
    gameState.canSpawn = 1; 
}

function scoreEnemy(bullet, enemy) {
    enemy.setActive(false);
    enemy.x = 2000;
    enemy.body.velocity.y = 0;


    bullet.setActive(false);
    bullet.x = 1000;
    bullet.body.velocity.y = 0;

    let currentScore = parseInt(gameState.ui.scoreText.innerHTML);

    if (enemy.texture.key === "enemy1") {
        currentScore += 1;
    }

    gameState.score = currentScore;
    gameState.ui.scoreText.innerHTML = currentScore;
}

function playerHit(player) {
    if (player.texture.key !== "playerShip--Shield") {
        restartGame(this);
    }
}

function restartGame(game) {
    window.location.reload();
}

function update() {

    if (gameState.cursors.space.isDown && gameState.playerCanSwitch === true) {
        switchPlayerState(this);
    }

    if (gameState.playerState === 1 && gameState.canShoot === 1) {
        shoot(this);
    }

    gameState.bullets.children.each(function(a) {
        if (a.active) {
            if (a.y < 0) {
                a.setActive(false);
            }
        }
    }.bind(this));

    gameState.enemy1.children.each(function(a) {
        if (a.active) {
            if (a.y > 800) {
                a.setActive(false);
            }
        }
    }.bind(this));

    if (gameState.canSpawn === 1) {
        spawnEnemy(this);
    }
}

const game = new Phaser.Game(config);