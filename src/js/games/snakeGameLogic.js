/**
 * 贪吃蛇游戏逻辑
 */
export default class SnakeGame {
  constructor(gridSize = 15, speed = 200) {
    this.gridSize = gridSize;
    this.initialGridSize = gridSize; // 初始网格大小
    this.snake = [];
    this.food = { x: 0, y: 0 };
    this.foods = []; // 存储多个食物
    this.direction = 'right';
    this.nextDirection = 'right';
    this.gameInterval = null;
    this.gameOver = false;
    this.score = 0;
    this.speed = speed;
    this.speedLevel = 3; // 默认速度等级为3
    this.hardMode = false;
    this.isPaused = false;
    this.onUpdate = null;
    this.onGameOver = null;
    
    // 道具相关
    this.items = []; // 当前场上的道具
    this.mapExpandCount = 0; // 地图扩展次数计数
    this.maxMapExpand = 3; // 最多扩展3次
    this.extraFoodCount = 0; // 额外食物次数计数
    this.maxExtraFood = 5; // 最多出现5次额外食物
    this.currentExtraFoods = 0; // 当前额外食物数量
    
    // 方向映射
    this.directionMap = {
      'up': { x: 0, y: -1 },
      'down': { x: 0, y: 1 },
      'left': { x: -1, y: 0 },
      'right': { x: 1, y: 0 }
    };
    
    // 速度档位映射（档位1-5，数值越小表示速度越快）
    this.speedLevelMap = {
      1: 300, // 最慢
      2: 250,
      3: 200, // 默认
      4: 150,
      5: 100  // 最快
    };
    
    // 初始化游戏
    this.init();
  }

  // 初始化游戏
  init(hardMode = false) {
    this.stopGame();
    this.gridSize = this.initialGridSize; // 重置网格大小
    this.snake = [
      { x: Math.floor(this.gridSize / 2), y: Math.floor(this.gridSize / 2) }
    ];
    this.direction = 'right';
    this.nextDirection = 'right';
    this.score = 0;
    this.gameOver = false;
    this.hardMode = hardMode;
    this.isPaused = false;
    this.foods = []; // 清空食物数组
    this.items = []; // 清空道具数组
    this.mapExpandCount = 0;
    this.extraFoodCount = 0;
    this.currentExtraFoods = 0;
    this.placeFood();
    
    // 通知UI更新
    if (this.onUpdate) {
      this.onUpdate();
    }
  }

  // 设置速度等级
  setSpeedLevel(level) {
    if (level >= 1 && level <= 5) {
      this.speedLevel = level;
      this.speed = this.speedLevelMap[level];
      
      // 如果游戏正在运行，重新启动以应用新速度
      if (this.gameInterval) {
        this.stopGame();
        this.start();
      }
      
      // 通知UI更新
      if (this.onUpdate) {
        this.onUpdate();
      }
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
    // 先放置主食物
    if (this.foods.length === 0) {
      let x, y;
      do {
        x = Math.floor(Math.random() * this.gridSize);
        y = Math.floor(Math.random() * this.gridSize);
      } while (this.isSnakeSegment(x, y) || this.isItemAt(x, y));
      
      this.foods.push({ x, y, type: 'normal' });
    }
    
    // 处理额外食物
    while (this.foods.length < this.currentExtraFoods + 1) {
      let x, y;
      do {
        x = Math.floor(Math.random() * this.gridSize);
        y = Math.floor(Math.random() * this.gridSize);
      } while (this.isSnakeSegment(x, y) || this.isFoodAt(x, y) || this.isItemAt(x, y));
      
      this.foods.push({ x, y, type: 'normal' });
    }
    
    // 更新主食物引用，用于兼容原有代码
    if (this.foods.length > 0) {
      this.food = this.foods[0];
    }
    
    // 有概率生成道具
    this.tryGenerateItem();
  }
  
  // 尝试生成道具
  tryGenerateItem() {
    // 1% 概率生成道具
    if (Math.random() < 0.01) {
      let itemType;
      
      // 决定生成哪种道具
      if (this.mapExpandCount < this.maxMapExpand && this.extraFoodCount < this.maxExtraFood) {
        // 两种道具都可以生成，随机选择
        itemType = Math.random() < 0.5 ? 'mapExpand' : 'extraFood';
      } else if (this.mapExpandCount < this.maxMapExpand) {
        // 只能生成地图扩展道具
        itemType = 'mapExpand';
      } else if (this.extraFoodCount < this.maxExtraFood) {
        // 只能生成额外食物道具
        itemType = 'extraFood';
      } else {
        // 两种道具都达到上限，不生成
        return;
      }
      
      // 生成道具坐标
      let x, y;
      do {
        x = Math.floor(Math.random() * this.gridSize);
        y = Math.floor(Math.random() * this.gridSize);
      } while (this.isSnakeSegment(x, y) || this.isFoodAt(x, y) || this.isItemAt(x, y));
      
      // 添加道具
      this.items.push({ x, y, type: itemType });
      
      // 通知UI更新
      if (this.onUpdate) {
        this.onUpdate();
      }
    }
  }
  
  // 检查坐标是否是食物
  isFoodAt(x, y) {
    return this.foods.some(food => food.x === x && food.y === y);
  }
  
  // 检查坐标是否是道具
  isItemAt(x, y) {
    return this.items.some(item => item.x === x && item.y === y);
  }
  
  // 获取指定坐标的食物索引
  getFoodIndex(x, y) {
    return this.foods.findIndex(food => food.x === x && food.y === y);
  }
  
  // 获取指定坐标的道具索引
  getItemIndex(x, y) {
    return this.items.findIndex(item => item.x === x && item.y === y);
  }

  // 检查坐标是否是蛇身体的一部分
  isSnakeSegment(x, y) {
    return this.snake.some(segment => segment.x === x && segment.y === y);
  }

  // 获取当前分数增量
  getScoreIncrement() {
    if (this.score >= 50) {
      return this.hardMode ? 3 : 2;
    } else {
      return this.hardMode ? 2 : 1;
    }
  }
  
  // 扩展地图
  expandMap() {
    if (this.mapExpandCount < this.maxMapExpand) {
      this.gridSize += 2; // 地图增大一圈
      this.mapExpandCount++;
      
      // 通知UI更新
      if (this.onUpdate) {
        this.onUpdate();
      }
    }
  }
  
  // 增加额外食物
  addExtraFood() {
    if (this.extraFoodCount < this.maxExtraFood) {
      this.currentExtraFoods++;
      this.extraFoodCount++;
      this.placeFood(); // 放置新的食物
      
      // 通知UI更新
      if (this.onUpdate) {
        this.onUpdate();
      }
    }
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
    const foodIndex = this.getFoodIndex(head.x, head.y);
    if (foodIndex !== -1) {
      // 根据分数阶段获取不同的分数增量
      this.score += this.getScoreIncrement();
      
      // 移除被吃掉的食物
      this.foods.splice(foodIndex, 1);
      
      // 放置新食物
      this.placeFood();
    } else {
      // 检查是否吃到道具
      const itemIndex = this.getItemIndex(head.x, head.y);
      if (itemIndex !== -1) {
        const item = this.items[itemIndex];
        // 处理道具效果
        if (item.type === 'mapExpand') {
          this.expandMap();
        } else if (item.type === 'extraFood') {
          this.addExtraFood();
        }
        
        // 移除道具
        this.items.splice(itemIndex, 1);
      } else {
        // 如果没吃到食物或道具，移除尾部
        this.snake.pop();
      }
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

