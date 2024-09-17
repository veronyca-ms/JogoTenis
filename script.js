const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

// Ajustar o tamanho do canvas para preencher a tela
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Inicializar variáveis
let ball = { x: canvas.width / 2, y: canvas.height / 2, radius: 10, speedX: 5, speedY: 5 };
let paddle1 = { x: 30, y: canvas.height / 2 - 30, width: 20, height: 60, speed: 5 };
let paddle2 = { x: canvas.width - 50, y: canvas.height / 2 - 30, width: 20, height: 60, speed: 5 };
let rede = { x: canvas.width / 2 - 3, y: 0, width: 6, height: canvas.height };
let player1Score = 0;
let player2Score = 0;
let keys = {}; // Para armazenar as teclas pressionadas

function drawBall() {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.fillStyle = 'white';
    context.fill();
    context.closePath();
}

function drawRoundedRect(x, y, width, height, radius) {
    context.beginPath();
    context.moveTo(x + radius, y);
    context.arcTo(x + width, y, x + width, y + height, radius);
    context.arcTo(x + width, y + height, x, y + height, radius);
    context.arcTo(x, y + height, x, y, radius);
    context.arcTo(x, y, x + width, y, radius);
    context.closePath();
    context.fillStyle = 'white';
    context.fill();
}

function draw() {
    // Limpar o canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Desenhar o fundo
    context.fillStyle = 'green';
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Desenhar a bola
    drawBall();

    // Desenhar as raquetes
    drawRoundedRect(paddle1.x, paddle1.y, paddle1.width, paddle1.height, 10);
    drawRoundedRect(paddle2.x, paddle2.y, paddle2.width, paddle2.height, 10);

    // Desenhar a rede
    context.fillStyle = 'white';
    context.fillRect(rede.x, rede.y, rede.width, rede.height);

    // Atualizar a posição da bola
    ball.x += ball.speedX;
    ball.y += ball.speedY;

    // Colidir com as bordas superior e inferior
    if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
        ball.speedY = -ball.speedY;
    }

    // Movimento das raquetes
    if (keys['w']) paddle1.y -= paddle1.speed;
    if (keys['s']) paddle1.y += paddle1.speed;
    if (keys['a']) paddle1.x -= paddle1.speed;
    if (keys['d']) paddle1.x += paddle1.speed;
    if (keys['ArrowUp']) paddle2.y -= paddle2.speed;
    if (keys['ArrowDown']) paddle2.y += paddle2.speed;
    if (keys['ArrowLeft']) paddle2.x -= paddle2.speed;
    if (keys['ArrowRight']) paddle2.x += paddle2.speed;

    // Garantir que as raquetes fiquem dentro dos limites do canvas
    paddle1.y = Math.max(0, Math.min(canvas.height - paddle1.height, paddle1.y));
    paddle1.x = Math.max(0, Math.min(canvas.width - paddle1.width, paddle1.x));
    paddle2.y = Math.max(0, Math.min(canvas.height - paddle2.height, paddle2.y));
    paddle2.x = Math.max(0, Math.min(canvas.width - paddle2.width, paddle2.x));

    // Colidir com as raquetes
    if (ball.x - ball.radius <= paddle1.x + paddle1.width &&
        ball.y >= paddle1.y &&
        ball.y <= paddle1.y + paddle1.height) {
        // Calcular a posição relativa do impacto
        let relativeIntersectY = (ball.y - (paddle1.y + paddle1.height / 2)) / (paddle1.height / 2);
        let angle = relativeIntersectY * (Math.PI / 4); // Definição do ângulo de deflexão

        // Calcular a nova velocidade da bola com base no ângulo
        let speed = Math.sqrt(ball.speedX ** 2 + ball.speedY ** 2);
        ball.speedX = speed * Math.cos(angle);
        ball.speedY = speed * Math.sin(angle);

        ball.x = paddle1.x + paddle1.width + ball.radius; // Evitar bola ficar presa na raquete
    }
    if (ball.x + ball.radius >= paddle2.x &&
        ball.y >= paddle2.y &&
        ball.y <= paddle2.y + paddle2.height) {
        // Calcular a posição relativa do impacto
        let relativeIntersectY = (ball.y - (paddle2.y + paddle2.height / 2)) / (paddle2.height / 2);
        let angle = relativeIntersectY * (Math.PI / 4); // Definição do ângulo de deflexão

        // Calcular a nova velocidade da bola com base no ângulo
        let speed = Math.sqrt(ball.speedX ** 2 + ball.speedY ** 2);
        ball.speedX = -speed * Math.cos(angle);
        ball.speedY = speed * Math.sin(angle);

        ball.x = paddle2.x - ball.radius; // Evitar bola ficar presa na raquete
    }

    // Verificar pontuação
    if (ball.x - ball.radius < 0) {
        player2Score++;
        resetBall();
    }
    if (ball.x + ball.radius > canvas.width) {
        player1Score++;
        resetBall();
    }

    // Mostrar a pontuação
    context.fillStyle = 'white';
    context.font = '45px Arial';
    context.fillText(player1Score, canvas.width / 2 - 50, 50);
    context.fillText(player2Score, canvas.width / 2 + 10, 50);

    requestAnimationFrame(draw);
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.radius = 10; // Mantém o tamanho da bola
    ball.speedX = 5 * (Math.random() < 0.5 ? 1 : -1);
    ball.speedY = 5 * (Math.random() < 0.5 ? 1 : -1);
}

// Configuração do canvas e controle do teclado
window.addEventListener('keydown', function(event) {
    keys[event.key] = true;
});
window.addEventListener('keyup', function(event) {
    keys[event.key] = false;
});

draw();
