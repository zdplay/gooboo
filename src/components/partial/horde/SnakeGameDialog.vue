<template>
  <v-dialog
    v-model="dialog"
    :max-width="dialogMaxWidth"
    persistent
    @keydown.stop="handleDialogKeyDown"
    class="snake-game-dialog"
    @click.native="handleDialogClick"
  >
    <v-card 
      class="default-card snake-game-card" 
      ref="dialogCard" 
      tabindex="0"
      :ripple="false"
      autofocus
    >
      <!-- 游戏标题栏 -->
      <v-card-title class="headline primary white--text">
        贪吃神秘碎片
        <v-spacer></v-spacer>
        <v-chip color="secondary" class="ml-2">
          <v-icon left>mdi-star</v-icon>
          得分: {{ score }}
        </v-chip>
        <v-btn icon class="ml-2" @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <!-- 游戏内容区域 -->
      <v-card-text>
        <!-- 游戏模式选择 -->
        <div v-if="!gameStarted" class="mode-selection">
          <h3 class="text-center mb-4">选择游戏模式</h3>
          <v-row>
            <v-col cols="6">
              <v-card 
                outlined 
                class="default-card mode-card"
                :class="{'selected-primary': selectedMode === 'easy'}" 
                @click="selectedMode = 'easy'"
              >
                <v-card-title class="justify-center">简单模式</v-card-title>
                <v-card-text class="text-center">
                  <div>可穿墙</div>
                  <div>得分规则：</div>
                  <div>前50分：每个食物1分</div>
                  <div>50分以上：每个食物2分</div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="6">
              <v-card 
                outlined 
                class="default-card mode-card"
                :class="{'selected-primary': selectedMode === 'hard'}" 
                @click="selectedMode = 'hard'"
              >
                <v-card-title class="justify-center">困难模式</v-card-title>
                <v-card-text class="text-center">
                  <div>不可穿墙</div>
                  <div>得分规则：</div>
                  <div>前50分：每个食物2分</div>
                  <div>50分以上：每个食物3分</div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
          <div class="text-center mt-4">
            <v-btn color="primary" @click="startGame">开始游戏</v-btn>
          </div>
        </div>
        
        <!-- 游戏区域 -->
        <div v-else>
          <div class="game-board" ref="gameBoard" :style="{ width: `${boardSize}px`, height: `${boardSize}px` }">
            <!-- 网格线 -->
            <div class="grid-lines">
              <div v-for="i in gridSize" :key="`h-line-${i}`" class="h-line" :style="{ top: `${i * cellSize}px` }"></div>
              <div v-for="i in gridSize" :key="`v-line-${i}`" class="v-line" :style="{ left: `${i * cellSize}px` }"></div>
            </div>
            
            <!-- 蛇 -->
            <div 
              v-for="(segment, index) in snake" 
              :key="`snake-${index}`" 
              class="snake-segment"
              :style="{ 
                left: `${segment.x * cellSize}px`, 
                top: `${segment.y * cellSize}px`,
                width: `${cellSize}px`,
                height: `${cellSize}px`,
              }"
            >
              <!-- 蛇头 -->
              <v-icon 
                v-if="index === 0" 
                :size="cellSize" 
                color="error"
                :style="getSnakeHeadStyle()"
              >
                mdi-pac-man
              </v-icon>
              
              <!-- 蛇尾 -->
              <v-icon 
                v-else-if="index === snake.length - 1" 
                :size="cellSize * 0.8" 
                color="purple"
              >
                mdi-circle-small
              </v-icon>
              
              <!-- 蛇身 -->
              <v-icon 
                v-else 
                :size="cellSize" 
                color="purple"
              >
                mdi-circle-medium
              </v-icon>
            </div>
            
            <!-- 食物 -->
            <div 
              v-for="(foodItem, index) in foods" 
              :key="`food-${index}`"
              class="food-item"
              :style="{ 
                left: `${foodItem.x * cellSize}px`, 
                top: `${foodItem.y * cellSize}px`,
                width: `${cellSize}px`,
                height: `${cellSize}px`
              }"
            >
              <v-icon :size="cellSize * 0.8" color="amber">
                mdi-dots-horizontal-circle
              </v-icon>
            </div>
            
            <!-- 道具 -->
            <div 
              v-for="(item, index) in items" 
              :key="`item-${index}`"
              class="game-item"
              :style="{ 
                left: `${item.x * cellSize}px`, 
                top: `${item.y * cellSize}px`,
                width: `${cellSize}px`,
                height: `${cellSize}px`
              }"
            >
              <v-icon 
                :size="cellSize" 
                :color="item.type === 'mapExpand' ? 'amber' : 'cyan'"
              >
                {{ item.type === 'mapExpand' ? 'mdi-map-marker-plus' : 'mdi-food-fork-drink' }}
              </v-icon>
            </div>
          </div>

          <!-- 控制按钮 - 简化的控制布局 -->
          <div class="controls mt-4">
            <div class="control-grid">
              <v-btn tile color="primary" @click="turnLeft" class="control-btn">
                <v-icon>mdi-rotate-left</v-icon>
                <span class="shortcut-hint" v-if="$vuetify.breakpoint.smAndUp">(Q)</span>
              </v-btn>
              <v-btn tile color="primary" @click="changeDirection('up')" class="control-btn">
                <v-icon>mdi-arrow-up</v-icon>
              </v-btn>
              <v-btn tile color="primary" @click="turnRight" class="control-btn">
                <v-icon>mdi-rotate-right</v-icon>
                <span class="shortcut-hint" v-if="$vuetify.breakpoint.smAndUp">(E)</span>
              </v-btn>
              <v-btn tile color="primary" @click="changeDirection('left')" class="control-btn">
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
              <v-btn tile color="primary" @click="togglePause" class="control-btn">
                <v-icon>{{ isPaused ? 'mdi-play' : 'mdi-pause' }}</v-icon>
              </v-btn>
              <v-btn tile color="primary" @click="changeDirection('right')" class="control-btn">
                <v-icon>mdi-arrow-right</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn tile color="primary" @click="changeDirection('down')" class="control-btn">
                <v-icon>mdi-arrow-down</v-icon>
              </v-btn>
              <v-spacer></v-spacer>
            </div>
            <div class="text-center mt-2 caption" v-if="gameStarted && !showGameOverDialog && !showPauseDialog">
              <v-icon small color="warning">mdi-information</v-icon>
              <span v-if="$vuetify.breakpoint.smAndUp">游戏开始后需要鼠标点击游戏区域才能使用键盘快捷键操作(方向键/WASD/QE)</span>
              <span v-else>点击游戏区域使用键盘操作</span>
            </div>
            
            <!-- 速度控制 -->
            <div class="speed-control mt-3" v-if="gameStarted && !showGameOverDialog && !showPauseDialog">
              <div class="d-flex align-center">
                <v-icon small class="mr-1">mdi-speedometer</v-icon>
                <span class="caption mr-2">速度：</span>
                <v-btn x-small fab class="mx-1" :color="speedLevel === 1 ? 'primary' : ''" @click="changeSpeed(1)">1</v-btn>
                <v-btn x-small fab class="mx-1" :color="speedLevel === 2 ? 'primary' : ''" @click="changeSpeed(2)">2</v-btn>
                <v-btn x-small fab class="mx-1" :color="speedLevel === 3 ? 'primary' : ''" @click="changeSpeed(3)">3</v-btn>
                <v-btn x-small fab class="mx-1" :color="speedLevel === 4 ? 'primary' : ''" @click="changeSpeed(4)">4</v-btn>
                <v-btn x-small fab class="mx-1" :color="speedLevel === 5 ? 'primary' : ''" @click="changeSpeed(5)">5</v-btn>
                <div class="caption ml-2" v-if="$vuetify.breakpoint.smAndUp">(1慢-5快，可用数字键1-5调节)</div>
                <div class="caption ml-2" v-else>(1慢-5快)</div>
              </div>
            </div>
            
            <!-- 道具信息 -->
            <div class="item-info mt-3" v-if="gameStarted && !showGameOverDialog && !showPauseDialog && $vuetify.breakpoint.smAndUp">
              <div class="d-flex align-center">
                <div class="caption">
                  <v-icon x-small color="primary">mdi-information</v-icon>
                  游戏进行中可使用数字键1-5调节速度
                </div>
              </div>
            </div>
          </div>
        </div>
      </v-card-text>
      
      <!-- 游戏结束弹窗 -->
      <v-dialog 
        v-model="showGameOverDialog" 
        persistent 
        max-width="400"
        @keydown.stop.prevent
      >
        <v-card class="default-card">
          <v-card-title class="headline">游戏结束</v-card-title>
          <v-card-text>
            <p>您的得分是 {{ score }} 分。</p>
            <p v-if="reward > 0">获得 {{ reward }} 个神秘碎片！</p>
            <p v-else>未超过当前拥有的神秘碎片数量，无奖励。</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" text @click="restartGame">再玩一次</v-btn>
            <v-btn color="error" text @click="closeGame">退出游戏</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      
      <!-- 暂停弹窗 -->
      <v-dialog 
        v-model="showPauseDialog" 
        persistent 
        max-width="300"
        @keydown.stop.prevent
      >
        <v-card class="default-card">
          <v-card-title class="headline">游戏暂停</v-card-title>
          <v-card-text class="text-center">
            <v-btn color="primary" @click="resumeGame">继续游戏</v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
      
      <!-- 错误提示弹窗 -->
      <v-dialog 
        v-model="showErrorDialog" 
        persistent 
        max-width="400"
        @keydown.stop.prevent
      >
        <v-card class="default-card">
          <v-card-title class="headline">无法开始游戏</v-card-title>
          <v-card-text>
            <p>{{ errorMessage }}</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" text @click="closeDialog">关闭</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapState } from 'vuex';
import SnakeGame from '@/js/games/snakeGameLogic';

export default {
  name: 'SnakeGameDialog',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      gameEngine: null,
      snake: [],
      food: { x: 0, y: 0 },
      foods: [], // 存储多个食物
      items: [], // 存储道具
      score: 0,
      reward: 0,
      gameStarted: false,
      selectedMode: 'easy',
      showGameOverDialog: false,
      isPaused: false,
      showPauseDialog: false,
      showErrorDialog: false,
      errorMessage: '',
      focusInterval: null,
      speedLevel: 3, // 默认速度等级
    };
  },
  computed: {
    ...mapState({
      currentShards: state => {
        const value = state.currency.horde_mysticalShard?.value;
        return (value === undefined || isNaN(value)) ? 0 : value;
      },
      isDarkTheme: state => state.system.settings.general.darkTheme
    }),
    dialog: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit('input', value);
      }
    },
    dialogMaxWidth() {
      // 对话框响应式宽度
      if (this.$vuetify.breakpoint.xs) {
        return '95vw';
      } else if (this.$vuetify.breakpoint.sm) {
        return '80vw';
      } else if (this.$vuetify.breakpoint.md) {
        return '600px';
      } else {
        return '700px';
      }
    },
    gridSize() {
      // 固定初始网格数量，保持游戏逻辑一致性
      // 游戏引擎会根据道具动态调整（expandMap功能）
      return this.gameEngine ? this.gameEngine.gridSize : 15;
    },
    boardSize() {
      // 根据屏幕大小动态计算游戏板尺寸，确保所有格子都完整显示
      const screenWidth = this.$vuetify.breakpoint.width;
      const screenHeight = this.$vuetify.breakpoint.height;

      // 计算真正可用的空间
      const dialogPadding = this.$vuetify.breakpoint.xs ? 16 : 24; // 对话框边距
      const contentPadding = this.$vuetify.breakpoint.xs ? 16 : 24; // 内容区域边距
      const titleHeight = 64; // 标题栏高度
      const controlsHeight = this.$vuetify.breakpoint.xs ? 120 : 160; // 控制区域高度
      const safetyMargin = 20; // 安全边距

      const availableWidth = screenWidth - (dialogPadding * 2) - (contentPadding * 2) - safetyMargin;
      const availableHeight = screenHeight - titleHeight - controlsHeight - (dialogPadding * 2) - safetyMargin;

      // 当前网格数量（包括道具扩展）
      const currentGridSize = this.gameEngine ? this.gameEngine.gridSize : 15;

      // 计算理想的格子大小
      const idealCellSize = 25;

      // 根据可用空间计算最大可能的格子大小
      const maxCellSizeByWidth = Math.floor(availableWidth / currentGridSize);
      const maxCellSizeByHeight = Math.floor(availableHeight / currentGridSize);
      const maxCellSize = Math.min(maxCellSizeByWidth, maxCellSizeByHeight);

      // 选择合适的格子大小（理想值和最大可能值中的较小者）
      let cellSize = Math.min(idealCellSize, maxCellSize);

      // 设置绝对最小格子大小，确保基本可玩性
      const absoluteMinCellSize = 10;
      if (cellSize < absoluteMinCellSize) {
        console.warn(`屏幕过小，格子大小将小于理想值: ${cellSize}px，使用最小值: ${absoluteMinCellSize}px`);
        cellSize = absoluteMinCellSize;
      }

      // 计算最终的游戏板大小，确保是格子大小的整数倍
      const finalBoardSize = cellSize * currentGridSize;



      return finalBoardSize;
    },
    cellSize() {
      // 现在boardSize已经是格子大小的整数倍，所以这里的计算结果一定是整数
      return this.boardSize / this.gridSize;
    },
    canPlayGame() {
      return this.currentShards !== undefined && !isNaN(this.currentShards);
    }
  },
  watch: {
    dialog(newVal) {
      if (newVal) {
        this.checkGameAvailability();
        // 对话框打开时更新网格大小
        this.$nextTick(() => {
          this.updateGameGridSize();
        });
      } else {
        if (this.focusInterval) {
          clearInterval(this.focusInterval);
          this.focusInterval = null;
        }
      }
    }
  },
  created() {
    // 初始化时使用默认网格大小，后续会在mounted中更新
    this.gameEngine = new SnakeGame(15);

    this.gameEngine.onUpdate = () => {
      this.snake = [...this.gameEngine.snake];
      this.food = { ...this.gameEngine.food };
      this.foods = [...this.gameEngine.foods];
      this.items = [...this.gameEngine.items];
      this.score = this.gameEngine.score;
      this.isPaused = this.gameEngine.isPaused;
      this.speedLevel = this.gameEngine.speedLevel;
    };
    
    this.gameEngine.onGameOver = (score) => {
      if (score > this.currentShards) {
        this.reward = score - this.currentShards;

        // 立即计算奖励，而不是等到关闭时
        this.$store.dispatch('currency/gain', {
          feature: 'horde',
          name: 'mysticalShard',
          amount: this.reward
        });
      } else {
        this.reward = 0;
      }

      this.showGameOverDialog = true;
    };
  },
  mounted() {
    // 在组件挂载后更新游戏引擎的网格大小
    this.updateGameGridSize();
    this.checkGameAvailability();
  },
  beforeDestroy() {
    if (this.focusInterval) {
      clearInterval(this.focusInterval);
      this.focusInterval = null;
    }
    this.resetGame();
  },
  methods: {
    updateGameGridSize() {
      if (this.gameEngine) {
        // 只在游戏未开始时重新初始化，保持原有网格大小
        if (!this.gameStarted) {
          this.gameEngine.init(false);
        }
      }
    },
    checkGameAvailability() {
      if (!this.canPlayGame) {
        this.errorMessage = "当前神秘碎片上限为空，无法进行游戏";
        this.showErrorDialog = true;
      }
    },
    startGame() {
      if (!this.canPlayGame) {
        this.errorMessage = "当前神秘碎片上限为空，无法进行游戏";
        this.showErrorDialog = true;
        return;
      }

      // 确保游戏引擎使用当前的网格大小
      this.updateGameGridSize();

      this.gameStarted = true;
      this.gameEngine.init(this.selectedMode === 'hard');
      this.gameEngine.start();

    },
    resetGame() {
      if (this.gameEngine) {
        this.gameEngine.reset();
      }
      this.snake = [];
      this.food = { x: 0, y: 0 };
      this.score = 0;
      this.gameStarted = false;
      this.showGameOverDialog = false;
      this.isPaused = false;
      this.showPauseDialog = false;
    },
    togglePause() {
      if (this.gameEngine.isPaused) {
        this.resumeGame();
      } else {
        this.pauseGame();
      }
    },
    pauseGame() {
      this.gameEngine.pause();
      this.showPauseDialog = true;
    },
    resumeGame() {
      this.gameEngine.resume();
      this.showPauseDialog = false;

      this.$nextTick(() => {
        const dialogElement = document.querySelector('.snake-game-dialog .v-card');
        if (dialogElement) {
          try {
            dialogElement.focus();
          } catch (e) {
            console.log('无法设置焦点:', e);
          }
        }
      });
    },
    changeDirection(direction) {
      if (this.gameEngine) {
        this.gameEngine.changeDirection(direction);
      }
    },
    
    changeSpeed(level) {
      if (this.gameEngine) {
        this.speedLevel = level;
        this.gameEngine.setSpeedLevel(level);
      }
    },

    turnLeft() {
      if (!this.gameEngine) return;
      
      const directionMap = {
        'up': 'left',
        'right': 'up',
        'down': 'right',
        'left': 'down'
      };
      
      const newDirection = directionMap[this.gameEngine.direction];
      if (newDirection) {
        this.gameEngine.changeDirection(newDirection);
      }
    },
    turnRight() {
      if (!this.gameEngine) return;
      
      const directionMap = {
        'up': 'right',
        'right': 'down',
        'down': 'left',
        'left': 'up'
      };
      
      const newDirection = directionMap[this.gameEngine.direction];
      if (newDirection) {
        this.gameEngine.changeDirection(newDirection);
      }
    },
    handleDialogKeyDown(e) {
      // 如果游戏结束弹窗显示，禁用所有键盘快捷键
      if (this.showGameOverDialog) {
        e.stopPropagation();
        e.preventDefault();
        return;
      }
      
      const gameRunning = this.gameStarted && !this.showGameOverDialog && !this.showPauseDialog;
      
      if (gameRunning) {
        e.stopPropagation();
        
        const keyMap = {
          'ArrowUp': 'up',
          'ArrowDown': 'down',
          'ArrowLeft': 'left',
          'ArrowRight': 'right',
          'w': 'up',  
          's': 'down',
          'a': 'left', 
          'd': 'right', 
          'q': 'turnLeft',
          'e': 'turnRight',
          ' ': 'pause',
          '1': 'speed1',
          '2': 'speed2',
          '3': 'speed3',
          '4': 'speed4',
          '5': 'speed5'
        };
        
        if (keyMap[e.key]) {
          if (keyMap[e.key] === 'pause') {
            this.togglePause();
          } else if (keyMap[e.key] === 'turnLeft') {
            this.turnLeft();
          } else if (keyMap[e.key] === 'turnRight') {
            this.turnRight();
          } else if (keyMap[e.key].startsWith('speed')) {
            // 处理速度调整快捷键
            const speedLevel = parseInt(keyMap[e.key].substring(5));
            this.changeSpeed(speedLevel);
          } else {
            this.changeDirection(keyMap[e.key]);
          }
          e.preventDefault();
        }
      }
      
      // 只有在非游戏结束弹窗显示时才处理Escape键
      if (e.key === 'Escape' && !this.showGameOverDialog) {
        this.closeDialog();
      }
    },
    restartGame() {
      // 先处理奖励
      this.processReward();
      this.showGameOverDialog = false;
      this.resetGame();
    },
    closeGame() {
      // 先处理奖励
      this.processReward();
      this.showGameOverDialog = false;
      this.closeDialog();
    },
    processReward() {
      // 奖励已在游戏结束时处理，这里只清空奖励状态
      this.reward = 0;
    },
    closeDialog() {
      this.dialog = false;
      this.resetGame();
    },
    // 获取蛇头的样式，根据方向旋转图标
    getSnakeHeadStyle() {
      if (!this.gameEngine) return {};
      
      const direction = this.gameEngine.direction;
      let rotation = 0;
      
      switch (direction) {
        case 'right':
          rotation = 0;   // 默认朝右
          break;
        case 'down':
          rotation = 90;  // 向下转90度
          break;
        case 'left':
          rotation = 180; // 向左转180度
          break;
        case 'up':
          rotation = 270; // 向上转270度
          break;
      }
      
      return {
        transform: `rotate(${rotation}deg)`,
        transformOrigin: 'center center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      };
    },
  }
}
</script>

<style scoped>
.game-board {
  position: relative;
  margin: 0 auto;
  border: 2px solid var(--v-primary-base);
  border-radius: 4px;
  overflow: hidden;
  background-color: var(--v-background-base);
  pointer-events: none;
  max-width: 100%;
  box-sizing: border-box;
}

/* 响应式调整 */
@media (max-width: 599px) {
  .game-board {
    margin: 8px auto;
  }

  .snake-game-card {
    margin: 8px;
  }
}

@media (max-width: 479px) {
  .game-board {
    margin: 4px auto;
    border-width: 1px;
  }

  .snake-game-card {
    margin: 4px;
  }
}

/* 极小屏幕优化 */
@media (max-width: 360px) {
  .game-board {
    margin: 2px auto;
    border-width: 1px;
  }

  .snake-game-card {
    margin: 2px;
  }

  .snake-game-card .v-card-title {
    padding: 8px 12px;
    font-size: 1.1rem;
  }

  .snake-game-card .v-card-text {
    padding: 8px 12px;
  }
}

.snake-segment, .food-item, .game-item {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  pointer-events: auto;
}

.grid-lines {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.h-line {
  position: absolute;
  width: 100%;
  height: 1px;
  background-color: rgba(128, 128, 128, 0.2);
}

.v-line {
  position: absolute;
  height: 100%;
  width: 1px;
  background-color: rgba(128, 128, 128, 0.2);
}

.control-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 4px;
  max-width: 300px;
  margin: 0 auto;
}

/* 控制网格响应式调整 */
@media (max-width: 599px) {
  .control-grid {
    max-width: 250px;
    gap: 2px;
  }

  .control-btn {
    min-width: 40px !important;
    height: 40px !important;
  }

  .shortcut-hint {
    font-size: 10px !important;
  }
}

@media (max-width: 479px) {
  .control-grid {
    max-width: 200px;
    gap: 1px;
  }

  .control-btn {
    min-width: 35px !important;
    height: 35px !important;
  }
}

.control-btn {
  height: 40px;
  width: 100%;
  position: relative;
}

.shortcut-hint {
  position: absolute;
  bottom: 2px;
  right: 2px;
  font-size: 10px;
  opacity: 0.7;
}

.mode-card {
  height: 100%;
  cursor: pointer;
  transition: all 0.3s;
}

.mode-card:hover {
  transform: translateY(-5px);
}

.selected-primary {
  box-shadow: 3px 3px 0 var(--v-primary-base), -3px 3px 0 var(--v-primary-base), 3px -3px 0 var(--v-primary-base), -3px -3px 0 var(--v-primary-base);
}

.snake-game-card {
  position: relative;
  overflow: hidden;
  user-select: none;
}

.snake-game-card::before {
  display: none !important;
}

:deep(.v-card__text),
:deep(.v-card),
:deep(.v-card__title) {
  position: relative;
}

:deep(.v-card::before) {
  display: none !important;
}

.control-btn {
  position: relative;
  z-index: 1;
}
</style>






















