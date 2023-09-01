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
let score = 0;
let isPaused = false;

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

function drawScore() {
    context.fillStyle = '#FFF';
    context.font = '24px Arial';
    context.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

function drawPauseButton() {
    context.fillStyle = '#FFF';
    context.font = '24px Arial';
    context.fillText('Pause', 10, 30);
}

function update() {
    if (isPaused) return;

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the player
    drawAircraft(player);

    // Draw the score
    drawScore();

    // Draw the pause button
    drawPauseButton();

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
                score++;
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
    if (isPaused) return;

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

// Handling mouse click for pause
canvas.addEventListener('click', function(event) {
    const x = event.clientX - canvas.getBoundingClientRect().left;
    const y = event.clientY - canvas.getBoundingClientRect().top;
    if (x >= 10 && x <= 80 && y >= 10 && y <= 40) {
        isPaused = !isPaused;
        if (isPaused) {
            alert(`Game Paused. Your current score is: ${score}`);
        }
        update();
    }
});

update();
