const canvas = document.getElementById('game');
const context = canvas.getContext('2d');

const player = {
    x: 100,
    y: 300,
    width: 50,
    height: 50,
    bullets: [],
    speed: 5,
};

const enemies = [];

function createEnemy() {
    const enemy = {
        x: canvas.width,
        y: Math.random() * canvas.height,
        width: 50,
        height: 50,
        speed: Math.random() * 3 + 2,
    };
    enemies.push(enemy);
}

function drawAircraft(aircraft) {
    context.fillStyle = aircraft === player ? '#0F0' : '#F00';
    context.fillRect(aircraft.x, aircraft.y, aircraft.width, aircraft.height);
}

function drawBullet(bullet) {
    context.fillStyle = '#FF0';
    context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
}

function update() {
    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the player
    drawAircraft(player);

    // Move and draw bullets
    player.bullets.forEach((bullet, index) => {
        bullet.x += bullet.speed;
        if (bullet.x > canvas.width) {
            player.bullets.splice(index, 1);
        }
        drawBullet(bullet);
    });

    // Move and draw enemies
    enemies.forEach((enemy, index) => {
        enemy.x -= enemy.speed;
        if (enemy.x < 0) {
            enemies.splice(index, 1);
        }
        drawAircraft(enemy);
    });

    // Collision detection
    enemies.forEach((enemy, eIndex) => {
        player.bullets.forEach((bullet, bIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                enemies.splice(eIndex, 1);
                player.bullets.splice(bIndex, 1);
            }
        });
    });

    // Creating enemies periodically
    if (Math.random() < 0.01) {
        createEnemy();
    }

    requestAnimationFrame(update);
}

// Handling keyboard inputs
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            player.y -= player.speed;
            break;
        case 'ArrowDown':
            player.y += player.speed;
            break;
        case 'ArrowLeft':
            player.x -= player.speed;
            break;
        case 'ArrowRight':
            player.x += player.speed;
            break;
        case ' ':
            player.bullets.push({
                x: player.x + player.width,
                y: player.y + player.height / 2,
                width: 10,
                height: 5,
                speed: 10,
            });
            break;
    }
});

update();
