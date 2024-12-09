let snake;
let food;
let gridSize = 20;
let score = 0;
let gameOver = false;
let movementSpeed = 0.3;  // Velocidade de movimento da cobra (ajustável)

function setup() {
  createCanvas(400, 400);
  frameRate(30); // Aumenta o FPS para 30
  snake = new Snake();
  food = createFood();
}

function draw() {
  background(10); // Cor de fundo mais escura

  if (!gameOver) {
    snake.move();
    snake.update();
    snake.checkCollision();
    snake.display();

    if (snake.eat(food)) {
      food = createFood();
      score++;
    }

    displayScore();
    ellipse(food.x, food.y, gridSize, gridSize);
  } else {
    displayGameOver();
  }
}

function keyPressed() {
  if (gameOver) return; // Não permite mover a cobra depois de Game Over

  if (keyCode === LEFT_ARROW && snake.xSpeed !== 1) {
    snake.setDir(-1, 0);
  } else if (keyCode === RIGHT_ARROW && snake.xSpeed !== -1) {
    snake.setDir(1, 0);
  } else if (keyCode === DOWN_ARROW && snake.ySpeed !== -1) {
    snake.setDir(0, 1);
  } else if (keyCode === UP_ARROW && snake.ySpeed !== 1) {
    snake.setDir(0, -1);
  }
}

function createFood() {
    let cols = floor(width / gridSize);
    let rows = floor(height / gridSize);
    let foodPos = createVector(floor(random(cols)), floor(random(rows)));
    foodPos.mult(gridSize);
    return foodPos;
  }
  
function isFoodInaccessible(foodPos) {
  // Verifica as direções possíveis da cobra
  let head = snake.body[snake.body.length - 1];
  let x = head.x;
  let y = head.y;
  
  // A cobra não deve poder alcançar a comida imediatamente
  if (snake.xSpeed === 0 && snake.ySpeed === 0) return false;  // Cobra ainda não se moveu

  // Verificar se a comida está na direção da cabeça da cobra
  if (snake.xSpeed === gridSize && foodPos.x === x + gridSize && foodPos.y === y) return true;
  if (snake.xSpeed === -gridSize && foodPos.x === x - gridSize && foodPos.y === y) return true;
  if (snake.ySpeed === gridSize && foodPos.y === y + gridSize && foodPos.x === x) return true;
  if (snake.ySpeed === -gridSize && foodPos.y === y - gridSize && foodPos.x === x) return true;
  
  return false;  // Caso contrário, a comida é acessível
}

function displayScore() {
  fill(255);
  textSize(18);
  textAlign(LEFT, TOP);
  text("Pontuação: " + score, 10, 10);
}

function displayGameOver() {
  let gameOverText = select('#game-over');
  gameOverText.style('display', 'block');
  fill(0);  // Cor do texto "Game Over" em preto
  textSize(32);
  textAlign(CENTER, CENTER);
  text("GAME OVER", width / 2, height / 2);  // Exibe a mensagem no centro da tela
}

class Snake {
  constructor() {
    this.body = [];
    this.body[0] = createVector(floor(width / 2), floor(height / 2)); // Posição inicial
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.length = 0;
  }

  setDir(x, y) {
    // Garantir que a direção não seja oposta à atual
    if (this.xSpeed === 0 && x !== 0) {
      this.xSpeed = x * gridSize * movementSpeed;
      this.ySpeed = 0;
    } else if (this.ySpeed === 0 && y !== 0) {
      this.xSpeed = 0;
      this.ySpeed = y * gridSize * movementSpeed;
    }
  }

  move() {
    let head = this.body[this.body.length - 1].copy();  // Copiar a posição da cabeça
  
    // Adicionar o novo movimento baseado na velocidade
    head.x += this.xSpeed;
    head.y += this.ySpeed;
  
    this.body.shift();  // Remove a última parte do corpo para movimentar
    this.body.push(head); // Adiciona a nova cabeça à cauda
  }
  
  grow() {
    let head = this.body[this.body.length - 1].copy(); // Copiar a última parte da cobra
    this.body.push(head); // Adicionar um novo segmento à cobra
    this.length++;
  }

  eat(pos) {
    let x = this.body[this.body.length - 1].x;
    let y = this.body[this.body.length - 1].y;
  
    // Verifica se a cabeça da cobra está na mesma posição que o alimento
    if (dist(x, y, pos.x, pos.y) < gridSize) {  // Usa 'dist' para verificar proximidade
      this.grow();
      return true;
    }
    return false;
  }
  
  checkCollision() {
    let x = this.body[this.body.length - 1].x;
    let y = this.body[this.body.length - 1].y;

    // Verifica se a cobra bateu nas paredes
    if (x < 0 || y < 0 || x >= width || y >= height) {
      gameOver = true;
      noLoop(); // Para o jogo
    }

    // Verifica se a cobra bateu no próprio corpo
    for (let i = 0; i < this.body.length - 1; i++) {
      let part = this.body[i];
      if (part.x === x && part.y === y) {
        gameOver = true;
        noLoop(); // Para o jogo
      }
    }
  }

  update() {}

  display() {
    for (let i = 0; i < this.body.length; i++) {
      fill(0, 255, 0);  // Cobra verde
      noStroke();
      rect(this.body[i].x, this.body[i].y, gridSize, gridSize); // Desenha cada parte da cobra
    }
  }
}
