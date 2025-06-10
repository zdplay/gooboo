<template>
  <v-dialog
    v-model="dialog"
    max-width="500px"
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
                  <div>每个食物得1分</div>
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
                  <div>每个食物得2分</div>
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
            
            <div 
              v-for="(segment, index) in snake" 
              :key="`snake-${index}`" 
              class="snake-segment"
              :style="{ 
                left: `${segment.x * cellSize}px`, 
                top: `${segment.y * cellSize}px`,
                width: `${cellSize}px`,
                height: `${cellSize}px`,
                backgroundColor: index === 0 ? '#F44336' : '#9C27B0'
              }"
            ></div>
            <div 
              class="food"
              :style="{ 
                left: `${food.x * cellSize}px`, 
                top: `${food.y * cellSize}px`,
                width: `${cellSize}px`,
                height: `${cellSize}px`
              }"
            ></div>
          </div>

          <!-- 控制按钮 - 简化的控制布局 -->
          <div class="controls mt-4">
            <div class="control-grid">
              <v-btn tile color="primary" @click="turnLeft" class="control-btn">
                <v-icon>mdi-rotate-left</v-icon>
                <span class="shortcut-hint">(Q)</span>
              </v-btn>
              <v-btn tile color="primary" @click="changeDirection('up')" class="control-btn">
                <v-icon>mdi-arrow-up</v-icon>
              </v-btn>
              <v-btn tile color="primary" @click="turnRight" class="control-btn">
                <v-icon>mdi-rotate-right</v-icon>
                <span class="shortcut-hint">(E)</span>
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
              游戏开始后需要鼠标点击游戏区域才能使用键盘快捷键操作(方向键/WASD/QE)
            </div>
          </div>
        </div>
      </v-card-text>
      
      <!-- 游戏结束弹窗 -->
      <v-dialog v-model="showGameOverDialog" persistent max-width="400">
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
      <v-dialog v-model="showPauseDialog" persistent max-width="300">
        <v-card class="default-card">
          <v-card-title class="headline">游戏暂停</v-card-title>
          <v-card-text class="text-center">
            <v-btn color="primary" @click="resumeGame">继续游戏</v-btn>
          </v-card-text>
        </v-card>
      </v-dialog>
      
      <!-- 错误提示弹窗 -->
      <v-dialog v-model="showErrorDialog" persistent max-width="400">
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
      boardSize: 300,
      gridSize: 15,
      gameEngine: null,
      snake: [],
      food: { x: 0, y: 0 },
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
    cellSize() {
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
      } else {
        if (this.focusInterval) {
          clearInterval(this.focusInterval);
          this.focusInterval = null;
        }
      }
    }
  },
  created() {
    this.gameEngine = new SnakeGame(this.gridSize);

    this.gameEngine.onUpdate = () => {
      this.snake = [...this.gameEngine.snake];
      this.food = { ...this.gameEngine.food };
      this.score = this.gameEngine.score;
      this.isPaused = this.gameEngine.isPaused;
    };
    
    this.gameEngine.onGameOver = (score) => {
      if (score > this.currentShards) {
        this.reward = score - this.currentShards;
      } else {
        this.reward = 0;
      }

      this.showGameOverDialog = true;
    };
  },
  mounted() {
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
          ' ': 'pause'
        };
        
        if (keyMap[e.key]) {
          if (keyMap[e.key] === 'pause') {
            this.togglePause();
          } else if (keyMap[e.key] === 'turnLeft') {
            this.turnLeft();
          } else if (keyMap[e.key] === 'turnRight') {
            this.turnRight();
          } else {
            this.changeDirection(keyMap[e.key]);
          }
          e.preventDefault();
        }
      }
      
      if (e.key === 'Escape') {
        this.closeDialog();
      }
    },
    restartGame() {
      this.showGameOverDialog = false;
      this.resetGame();
    },
    closeGame() {
      if (this.reward > 0) {
        this.$store.dispatch('currency/gain', {
          feature: 'horde', 
          name: 'mysticalShard', 
          amount: this.reward
        });
      }
      this.showGameOverDialog = false;
      this.closeDialog();
    },
    closeDialog() {
      this.dialog = false;
      this.resetGame();
    }
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
}

.snake-segment, .food {
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

.snake-segment {
  position: absolute;
  border-radius: 2px;
  z-index: 2;
}

.food {
  position: absolute;
  background-color: #4CAF50;
  border-radius: 50%;
  z-index: 2;
}

.control-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: 4px;
  max-width: 300px;
  margin: 0 auto;
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






















