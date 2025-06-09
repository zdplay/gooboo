/**
 * 贪吃蛇游戏逻辑
 */
export default class SnakeGame {
  constructor(gridSize = 15, speed = 200) {
    this.gridSize = gridSize;
    this.snake = [];
    this.food = { x: 0, y: 0 };
    this.direction = 'right';
    this.nextDirection = 'right';
    this.gameInterval = null;
    this.gameOver = false;
    this.score = 0;
    this.speed = speed;
    this.hardMode = false;
    this.isPaused = false;
    this.onUpdate = null;
    this.onGameOver = null;
    
    // 方向映射
    this.directionMap = {
      'up': { x: 0, y: -1 },
      'down': { x: 0, y: 1 },
      'left': { x: -1, y: 0 },
      'right': { x: 1, y: 0 }
    };
    
    // 初始化游戏
    this.init();
  }

  // 初始化游戏
  init(hardMode = false) {
    this.stopGame();
    this.snake = [
      { x: Math.floor(this.gridSize / 2), y: Math.floor(this.gridSize / 2) }
    ];
    this.direction = 'right';
    this.nextDirection = 'right';
    this.score = 0;
    this.gameOver = false;
    this.hardMode = hardMode;
    this.isPaused = false;
    this.placeFood();
    
    // 通知UI更新
    if (this.onUpdate) {
      this.onUpdate();
    }
  }

  // 开始游戏
  start() {
    if (this.gameInterval) return;
    this.gameInterval = setInterval(() => this.gameLoop(), this.speed);
  }

  // 停止游戏
  stopGame() {
    if (this.gameInterval) {
      clearInterval(this.gameInterval);
      this.gameInterval = null;
    }
  }

  // 暂停游戏
  pause() {
    this.isPaused = true;
  }

  // 恢复游戏
  resume() {
    this.isPaused = false;
  }

  // 重置游戏
  reset() {
    this.stopGame();
    this.init();
  }

  // 放置食物
  placeFood() {
    let x, y;
    do {
      x = Math.floor(Math.random() * this.gridSize);
      y = Math.floor(Math.random() * this.gridSize);
    } while (this.isSnakeSegment(x, y));
    
    this.food = { x, y };
  }

  // 检查坐标是否是蛇身体的一部分
  isSnakeSegment(x, y) {
    return this.snake.some(segment => segment.x === x && segment.y === y);
  }

  // 游戏主循环
  gameLoop() {
    if (this.gameOver || this.isPaused) return;
    
    this.direction = this.nextDirection;
    const head = { ...this.snake[0] };
    const dir = this.directionMap[this.direction];
    
    head.x += dir.x;
    head.y += dir.y;
    
    // 根据模式处理边界
    if (this.hardMode) {
      // 困难模式：碰到墙壁游戏结束
      if (head.x >= this.gridSize || head.x < 0 || head.y >= this.gridSize || head.y < 0) {
        this.endGame();
        return;
      }
    } else {
      // 简单模式：穿墙
      if (head.x >= this.gridSize) head.x = 0;
      if (head.x < 0) head.x = this.gridSize - 1;
      if (head.y >= this.gridSize) head.y = 0;
      if (head.y < 0) head.y = this.gridSize - 1;
    }
    
    // 检查是否吃到自己
    for (let i = 0; i < this.snake.length; i++) {
      if (this.snake[i].x === head.x && this.snake[i].y === head.y) {
        this.endGame();
        return;
      }
    }
    
    // 添加新头部
    this.snake.unshift(head);
    
    // 检查是否吃到食物
    if (head.x === this.food.x && head.y === this.food.y) {
      // 根据模式给不同分数
      this.score += this.hardMode ? 2 : 1;
      this.placeFood();
      // 加速逻辑
      if (this.score % 5 === 0 && this.speed > 50) {
        this.speed -= 10;
        this.stopGame();
        this.start();
      }
    } else {
      // 如果没吃到食物，移除尾部
      this.snake.pop();
    }
    
    // 通知UI更新
    if (this.onUpdate) {
      this.onUpdate();
    }
  }

  // 改变方向
  changeDirection(newDirection) {
    // 防止180度转向
    const opposites = {
      'up': 'down',
      'down': 'up',
      'left': 'right',
      'right': 'left'
    };
    
    if (newDirection !== opposites[this.direction]) {
      this.nextDirection = newDirection;
    }
  }

  // 结束游戏
  endGame(victory = false) {
    this.gameOver = true;
    this.stopGame();

    if (victory) {
      this.score += this.hardMode ? 10 : 5;
    }
    
    // 通知UI游戏结束
    if (this.onGameOver) {
      this.onGameOver(this.score, victory);
    }
  }
}

