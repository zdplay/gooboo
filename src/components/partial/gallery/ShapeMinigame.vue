<style scoped>
.shape-table-sm {
  border-spacing: 4px;
}
.shape-table-sm .shape-cell {
  border-radius: 4px;
  width: 36px;
  height: 36px;
}
.shape-table-lg {
  border-spacing: 6px;
}
.shape-table-lg .shape-cell {
  border-radius: 6px;
  width: 64px;
  height: 64px;
}
.shape-icon-disabled {
  opacity: 0.2;
}
.shape-cell {
  position: relative;
}
.shape-bg {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  opacity: 0.25;
}
.shape-table-sm .shape-bg {
  border-radius: 4px;
}
.shape-table-lg .shape-bg {
  border-radius: 6px;
}
</style>

<template>
  <div>
    <table class="mx-auto" :class="{
      'shape-table-sm': $vuetify.breakpoint.smAndDown,
      'shape-table-lg': $vuetify.breakpoint.mdAndUp,
    }">
      <tr v-for="(row, y) in shapeGrid" :key="'shape-row-' + y">
        <td
          class="shape-cell text-center bg-tile-default elevation-2"
          v-for="(cell, x) in row"
          :key="'field-cell-' + y + '-' + x"
          @click="selectTile(x, y)"
          :id="`galleryShape_${ x }_${ y }`"
          draggable
          @dragstart="drag(x, y)"
          @drop="drop($event, x, y)"
          @dragenter="dragOver(x, y)"
          @dragover="allowDrop"
          @touchend="touchdrop($event, x, y)"
        >
          <div v-if="shapeList[cell].unlocked && !shapeList[cell].isSpecial" class="shape-bg" :class="shapeList[cell].color"></div>
          <v-badge
            :content="$formatTime(hourglassTime)"
            :value="cell === 'hourglass'"
            bottom
            left
            offset-x="52"
            offset-y="16"
          >
            <v-icon
              :size="(shapeList[cell].isSpecial ? 48 : 36) * ($vuetify.breakpoint.smAndDown ? 0.75 : 1)"
              :color="shapeList[cell].color"
              :class="{'shape-icon-disabled': !shapeList[cell].unlocked}"
            >{{ shapeList[cell].icon }}</v-icon>
          </v-badge>
        </td>
      </tr>
    </table>
    <div class="d-flex flex-wrap justify-center align-center ma-1">
       <price-tag class="ma-1" v-for="(value, shape) in gridStat" :key="`grid-stat-${ shape }`" :currency="`gallery_${ shape }`" :amount="value" @click="triggerSort(shape)"></price-tag>
     </div>
    <div class="d-flex flex-wrap justify-center align-center ma-1">
      <gb-tooltip :title-text="$vuetify.lang.t('$vuetify.gallery.shapes.name')">
        <template v-slot:activator="{ on, attrs }">
          <v-icon class="ma-1" v-bind="attrs" v-on="on">mdi-help-circle</v-icon>
        </template>
        <div>{{ $vuetify.lang.t('$vuetify.gallery.shapes.description') }}</div>
        <div>
          <span>{{ $vuetify.lang.t('$vuetify.gallery.shapes.cost') }}&nbsp;</span>
          <price-tag currency="gallery_motivation" :amount="1"></price-tag>
        </div>
      </gb-tooltip>
      <gb-tooltip v-if="specialShapeList.length > 0" :title-text="$vuetify.lang.t('$vuetify.gallery.shapes.special.name')">
        <template v-slot:activator="{ on, attrs }">
          <v-icon class="ma-1" v-bind="attrs" v-on="on">mdi-multiplication-box</v-icon>
        </template>
        <div>{{ $vuetify.lang.t('$vuetify.gallery.shapes.special.description', $formatNum(specialShapeChance * 100, true), $formatNum(specialShapeMult, true)) }}</div>
        <div v-for="item in specialShapeList" :key="`special-shape-${ item }`">
          <v-icon x-small class="mr-1" :color="shapeList[item].color">{{ shapeList[item].icon }}</v-icon>
          <span>{{ $vuetify.lang.t(`$vuetify.gallery.shapes.${ item }`) }} - {{ $vuetify.lang.t(`$vuetify.gallery.shapes.special.${ item }`) }}</span>
        </div>
        <h3 class="text-center">{{ $vuetify.lang.t('$vuetify.mult.gallerySpecialShapeChance') }}</h3>
        <stat-breakdown name="gallerySpecialShapeChance"></stat-breakdown>
        <h3 class="text-center">{{ $vuetify.lang.t('$vuetify.mult.gallerySpecialShapeMult') }}</h3>
        <stat-breakdown name="gallerySpecialShapeMult"></stat-breakdown>
      </gb-tooltip>
      <gb-tooltip :min-width="0">
        <template v-slot:activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on">
            <v-btn class="ma-1" width="36" min-width="36" color="primary" :disabled="!canBuyReroll" @click="buyShapeReroll" ref="rerollButton"><v-icon>mdi-cached</v-icon></v-btn>
          </div>
        </template>
        <div class="mt-0">
          <span>{{ $vuetify.lang.t('$vuetify.gallery.shapes.reroll') }}&nbsp;</span>
          <price-tag currency="gallery_motivation" :amount="rerollCost"></price-tag>
        </div>
      </gb-tooltip>
      <currency class="ma-1" name="gallery_motivation" large></currency>
      <gb-tooltip :min-width="0">
        <template v-slot:activator="{ on, attrs }">
          <div v-bind="attrs" v-on="on">
            <v-btn class="ma-1" width="36" min-width="36" color="success" :disabled="!canBuyMotivation" @click="buyMotivation"><v-icon>mdi-plus-thick</v-icon></v-btn>
          </div>
        </template>
        <div class="mt-0">
          <span>{{ $vuetify.lang.t('$vuetify.gallery.shapes.buyFor.0') }}&nbsp;</span>
          <price-tag currency="gallery_motivation" :amount="motivationBuyAmount" add></price-tag>
          <span>&nbsp;{{ $vuetify.lang.t('$vuetify.gallery.shapes.buyFor.1') }}&nbsp;</span>
          <price-tag currency="gem_sapphire" :amount="motivationBuyCost"></price-tag>
        </div>
      </gb-tooltip>
      <v-btn
        color="primary"
        @click="triggerAutoSort"
        >
        {{ isAutoSorting ? "运行中" : "自动" }}
      </v-btn>
      <v-btn
        color="warning"
        @click="clearAllMotivationInstantly"
        class="ml-1"
        >
        清管
      </v-btn>
    </div>
      <div class="d-flex flex-wrap justify-center align-center ma-1">
      <currency v-for="item in currencies.slice(1)" :key="item" class="ma-1" :name="item" :gainBase="1"></currency>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import { GALLERY_MOTIVATION_BUY_AMOUNT, GALLERY_MOTIVATION_BUY_COST, GALLERY_REROLL_COST } from '../../../js/constants';
import Currency from '../../render/Currency.vue';
import PriceTag from '../../render/PriceTag.vue';
import StatBreakdown from '../../render/StatBreakdown.vue';

export default {
  components: { Currency, PriceTag, StatBreakdown },
  data: () => ({
    dragX: null,
    dragY: null,
    isAutoSorting: false,
    autoSortInterval: null,
    isClearing: false
  }),
  mounted() {
    window.addEventListener('keydown', this.handleKeydown);
  },
  beforeDestroy() {
    window.removeEventListener('keydown', this.handleKeydown);
    this.stopAutoSort();
  },
  computed: {
    ...mapState({
      shapeList: state => state.gallery.shape,
      shapeGrid: state => state.gallery.shapeGrid
    }),
    ...mapGetters({
      hourglassTime: 'gallery/hourglassTime'
    }),
    currencies() {
      return this.$store.getters['currency/list']('gallery', 'shape');
    },
    specialShapeChance() {
      return this.$store.getters['mult/get']('gallerySpecialShapeChance');
    },
    specialShapeMult() {
      return this.$store.getters['mult/get']('gallerySpecialShapeMult');
    },
    specialShapeList() {
      let arr = [];
      for (const [key, elem] of Object.entries(this.shapeList)) {
        if (elem.isSpecial && elem.unlocked) {
          arr.push(key);
        }
      }
      return arr;
    },
    motivationBuyCost() {
      return GALLERY_MOTIVATION_BUY_COST;
    },
    motivationBuyAmount() {
      return GALLERY_MOTIVATION_BUY_AMOUNT;
    },
    rerollCost() {
      return GALLERY_REROLL_COST;
    },
    canBuyReroll() {
      return this.$store.getters['currency/value']('gallery_motivation') >= GALLERY_REROLL_COST;
    },
    canBuyMotivation() {
      return this.$store.state.unlock.galleryShape.use && this.$store.getters['currency/value']('gem_sapphire') >= GALLERY_MOTIVATION_BUY_COST && this.$store.getters['currency/value']('gallery_motivation') < 10;
    },
     gridStat() {
       const shapes =  {};
       for(const i in this.$store.state.gallery.shape) {
         const shape = this.$store.state.gallery.shape[i];
         if(shape.unlocked && !shape.isSpecial) {
           shapes[i] = 0;
         }
       }
       for(const row of this.shapeGrid) {
         for(const cell of row) {
           if(shapes[cell]!==undefined) shapes[cell]++;
         }
       }
       for(const i in shapes) {
         if(!shapes[i]) delete shapes[i];
       }
       return shapes;
    }
  },
  methods: {
    selectTile(x, y) {
      this.$store.dispatch('gallery/clickShape', {x, y});
    },
    drag(x, y) {
      this.dragX = x;
      this.dragY = y;
    },
    drop(ev, x, y) {
      ev.preventDefault();
      if ((Math.abs(this.dragX - x) + Math.abs(this.dragY - y)) === 1) {
        this.$store.dispatch('gallery/switchShape', {fromX: this.dragX, fromY: this.dragY, toX: x, toY: y});
      }
      this.dragX = null;
      this.dragY = null;
    },
    dragOver(x, y) {
      if ((Math.abs(this.dragX - x) + Math.abs(this.dragY - y)) === 1 && this.$store.getters['currency/canAfford']({gallery_motivation: 1})) {
        this.$store.dispatch('gallery/switchShape', {fromX: this.dragX, fromY: this.dragY, toX: x, toY: y});
        this.dragX = x;
        this.dragY = y;
      }
    },
    allowDrop(ev) {
      ev.preventDefault();
    },
    touchdrop(ev, x, y) {
      const elemList = document.elementsFromPoint(ev.changedTouches[0].clientX, ev.changedTouches[0].clientY);
      if (elemList) {
        const endElem = elemList.find(el => el.id.slice(0, 13) === 'galleryShape_');
        if (endElem) {
          const split = endElem.id.slice(13).split('_');
          const endX = parseInt(split[0]);
          const endY = parseInt(split[1]);
          if ((Math.abs(x - endX) + Math.abs(y - endY)) === 1) {
            this.$store.dispatch('gallery/switchShape', {fromX: x, fromY: y, toX: endX, toY: endY});
          }
        }
      }
    },
    buyShapeReroll() {
      this.$store.dispatch('gallery/buyShapeReroll');
    },
    buyMotivation() {
      if (this.$store.state.system.settings.confirm.items.gem.value) {
        this.$store.commit('system/updateKey', {key: 'confirm', value: {
          type: 'galleryMotivation',
          price: {gem_sapphire: GALLERY_MOTIVATION_BUY_COST},
          gain: {gallery_motivation: GALLERY_MOTIVATION_BUY_AMOUNT},
        }});
      } else {
        this.$store.dispatch('gallery/buyMotivation');
      }
    },
    handleKeydown(event) {
      if (event.key === 'r' && !event.ctrlKey && !event.shiftKey && !event.altKey && !event.metaKey) {
        if (this.canBuyReroll) {
          this.buyShapeReroll();
          if (this.$refs.rerollButton) {
            this.$refs.rerollButton.$el.focus();
          }
        }
      }
    },
    async triggerSort(shapeName) {
    const config = {
        CONNECTIVITY_BONUS: 1000,
        MAX_ITERATIONS_FACTOR: 80,
        MOVE_DELAY_MS: 10,
        DOM_UPDATE_WAIT_MS: 20,
        ENABLE_STATE_SYNC_CHECK: false
    };

    const coordsToString = ({ x, y }) => `${x},${y}`;
    const stringToCoords = (str) => { const [x, y] = str.split(',').map(Number); return { x, y }; };
    const idFromCoords = ({ x, y }) => `galleryShape_${x}_${y}`;
    const getAdjacentCoords = ({ x, y }) => [{ x: x + 1, y }, { x: x - 1, y }, { x: x, y: y + 1 }, { x: x, y: y - 1 }];
    const manhattanDistance = (coords1, coords2) => Math.abs(coords1.x - coords2.x) + Math.abs(coords1.y - coords2.y);

    const simulateDragDrop = async (sourceId, targetId) => {
        const sourceElement = document.getElementById(sourceId);
        const targetElement = document.getElementById(targetId);
        if (!sourceElement || !targetElement) {
            console.error(`错误: 找不到元素 ${sourceId} 或 ${targetId}`);
            return false;
        }
        if (this.$store.getters['currency/value']('gallery_motivation') <= 1) {
            solvedPath = null;
            this.stopAutoSort();
            return;
        }
        try {
            const dataTransfer = new DataTransfer();
            let success = false;
            try {
                sourceElement.dispatchEvent(new DragEvent('dragstart', { bubbles: true, cancelable: true, dataTransfer }));
                await new Promise(resolve => setTimeout(resolve, 10));
                targetElement.dispatchEvent(new DragEvent('dragover', { bubbles: true, cancelable: true, dataTransfer }));
                await new Promise(resolve => setTimeout(resolve, 10));
                targetElement.dispatchEvent(new DragEvent('drop', { bubbles: true, cancelable: true, dataTransfer }));
                success = true;
            } finally {
                 sourceElement.dispatchEvent(new DragEvent('dragend', { bubbles: true, cancelable: true, dataTransfer }));
            }
            return success;
        } catch (error) {
            console.error(`拖放模拟 ${sourceId} -> ${targetId} 出错:`, error);
            return false;
        }
    };

    const getTargetCells = (currentShapeName) => {
        const targetIconClass = `mdi-${currentShapeName}`;
        return Array.from(document.querySelectorAll('td.shape-cell'))
            .filter(cell => cell.querySelector(`i.${targetIconClass}`))
            .map(cell => {
                const match = cell.id.match(/galleryShape_(\d+)_(\d+)/);
                if (match) {
                    return { id: cell.id, x: parseInt(match[1]), y: parseInt(match[2]) };
                }
                return null;
            }).filter(cell => cell !== null);
    };


     const getAllCellCoordsSet = () => {
         return new Set(
            Array.from(document.querySelectorAll('.shape-cell')).map(cell => {
                const match = cell.id.match(/galleryShape_(\d+)_(\d+)/);
                if (match) {
                    return coordsToString({ x: parseInt(match[1]), y: parseInt(match[2]) });
                }
                return null;
            }).filter(coord => coord !== null)
        );
    };

    const isConnected = (targetSet) => {
        if (targetSet.size <= 1) return true;
        const startNode = targetSet.values().next().value;
        const visited = new Set([startNode]);
        const queue = [startNode];
        while (queue.length > 0) {
            const currentCoords = stringToCoords(queue.shift());
            for (const adjCoords of getAdjacentCoords(currentCoords)) {
                const adjStr = coordsToString(adjCoords);
                if (targetSet.has(adjStr) && !visited.has(adjStr)) {
                    visited.add(adjStr);
                    queue.push(adjStr);
                }
            }
        }
        return visited.size === targetSet.size;
    };

    const calculateCenterOfMass = (targetSet) => {
        if (targetSet.size === 0) return null;
        let sumX = 0, sumY = 0;
        for (const coordStr of targetSet) {
            const { x, y } = stringToCoords(coordStr);
            sumX += x; sumY += y;
        }
        return { x: Math.round(sumX / targetSet.size), y: Math.round(sumY / targetSet.size) };
    };

    const findComponents = (targetSet) => {
        const components = [];
        const visited = new Set();
        for (const startNode of targetSet) {
            if (!visited.has(startNode)) {
                const currentComponent = new Set();
                const queue = [startNode];
                visited.add(startNode);
                currentComponent.add(startNode);
                while (queue.length > 0) {
                    const currentCoords = stringToCoords(queue.shift());
                    for (const adjCoords of getAdjacentCoords(currentCoords)) {
                        const adjStr = coordsToString(adjCoords);
                        if (targetSet.has(adjStr) && !visited.has(adjStr)) {
                            visited.add(adjStr);
                            currentComponent.add(adjStr);
                            queue.push(adjStr);
                        }
                    }
                }
                components.push(currentComponent);
            }
        }
        return components;
    };

    let solvedPath = null;
    try {
        const initialTargetCells = getTargetCells(shapeName);
        if (!initialTargetCells || initialTargetCells.length === 0) {
            console.log(`未找到任何形状为 "${shapeName}" 的单元格，操作取消。`);
            return;
        }
        const allCellCoordsSet = getAllCellCoordsSet();
        if (allCellCoordsSet.size === 0) {
            return;
        }

        let targetCoordsSet = new Set(initialTargetCells.map(c => coordsToString({ x: c.x, y: c.y })));

        if (isConnected(targetCoordsSet)) {
            solvedPath = [];
            return;
        }

        const centerCoords = calculateCenterOfMass(targetCoordsSet);
        if (!centerCoords) {
            return;
        }
        const history = [];
        let iterations = 0;
        const maxIterations = targetCoordsSet.size * config.MAX_ITERATIONS_FACTOR;

        while (!isConnected(targetCoordsSet)) {
            iterations++;
            if (iterations > maxIterations) {
                solvedPath = null;
                return;
            }

            const components = findComponents(targetCoordsSet);
            const componentMap = new Map();
            components.forEach((compSet, index) => {
                compSet.forEach(coordStr => componentMap.set(coordStr, index));
            });

            let bestMove = null;
            let lateralMove = null;
            let maxScore = -Infinity;

            for (const targetStr of targetCoordsSet) {
                const targetCoords = stringToCoords(targetStr);
                const currentDist = manhattanDistance(targetCoords, centerCoords);
                const sourceCompId = componentMap.get(targetStr);

                for (const adjCoords of getAdjacentCoords(targetCoords)) {
                    const adjStr = coordsToString(adjCoords);

                    if (allCellCoordsSet.has(adjStr) && !targetCoordsSet.has(adjStr)) {
                        const newDist = manhattanDistance(adjCoords, centerCoords);
                        const distReduction = currentDist - newDist;
                        let connectBonus = 0;
                        for (const targetNeighborCoords of getAdjacentCoords(adjCoords)) {
                            const neighborStr = coordsToString(targetNeighborCoords);
                            if (targetCoordsSet.has(neighborStr) && neighborStr !== targetStr && componentMap.get(neighborStr) !== sourceCompId) {
                                connectBonus = config.CONNECTIVITY_BONUS;
                                break;
                            }
                        }
                        const totalScore = distReduction + connectBonus;

                        if (totalScore > maxScore) {
                            maxScore = totalScore;
                            bestMove = { srcId: idFromCoords(targetCoords), tgtId: idFromCoords(adjCoords), srcStr: targetStr, tgtStr: adjStr, score: totalScore, bonus: connectBonus > 0 };
                        } else if (totalScore === 0 && !lateralMove) {
                            lateralMove = { srcId: idFromCoords(targetCoords), tgtId: idFromCoords(adjCoords), srcStr: targetStr, tgtStr: adjStr, score: 0, bonus: false };
                        }
                    }
                }
            }

            const move = bestMove && maxScore > 0 ? bestMove : lateralMove;

            if (!move) {
                if (isConnected(targetCoordsSet)) {
                     break;
                 }
                solvedPath = null;
                return;
            }

            const success = await simulateDragDrop(move.srcId, move.tgtId);
            if (!success) {
                solvedPath = null;
                return;
            }

            if (config.DOM_UPDATE_WAIT_MS > 0) await new Promise(resolve => setTimeout(resolve, config.DOM_UPDATE_WAIT_MS));

            targetCoordsSet.delete(move.srcStr);
            targetCoordsSet.add(move.tgtStr);
            history.push({ sourceId: move.srcId, targetId: move.tgtId });

            if (config.ENABLE_STATE_SYNC_CHECK) {
                const currentDomTargets = getTargetCells(shapeName);
                const domTargetCoordsSet = new Set(currentDomTargets.map(c => coordsToString({x: c.x, y: c.y})));
                if(domTargetCoordsSet.size !== targetCoordsSet.size || ![...domTargetCoordsSet].every(coord => targetCoordsSet.has(coord))) {
                     targetCoordsSet = domTargetCoordsSet;
                     if (isConnected(targetCoordsSet)) {
                         break;
                     }
                }
            }

            if (config.MOVE_DELAY_MS > 0) await new Promise(resolve => setTimeout(resolve, config.MOVE_DELAY_MS));

        }


        if (isConnected(targetCoordsSet)) {
            solvedPath = history;
        } else {
            solvedPath = null;
        }

    } catch (error) {
        console.error(`为形状 "${shapeName}" 执行排序聚合时发生意外错误:`, error);
        solvedPath = null;
    } finally {
          window.solvedPath = solvedPath;
    }
    },
    async triggerAutoSort() {
      console.log("开始自动运行");
      if (this.isAutoSorting) {
        this.stopAutoSort();
        return;
      }
      this.isAutoSorting = true;
      let isSorting = false;
      const autoSort = async () => {
        if (isSorting) return;
        isSorting = true;
        try {
          if (this.$store.getters['currency/value']('gallery_motivation') <= 0) {
            if (this.canBuyReroll) {
              this.buyShapeReroll();
              await new Promise(resolve => setTimeout(resolve, 300));
              return;
            } else {
              this.stopAutoSort();
              return;
            }
          }
          const eligibleShapes = Object.entries(this.gridStat)
          .filter(([, count]) => count > 4)
          .sort((a, b) => b[1] - a[1]);
          if (eligibleShapes.length > 0) {
            const bestShape = eligibleShapes[0][0];
            await this.triggerSort(bestShape);
            await new Promise(resolve => setTimeout(resolve, 100));
            if (this.$store.getters['currency/value']('gallery_motivation') > 1) {
              this.clickShapeByColor(bestShape);
            }
            await new Promise(resolve => setTimeout(resolve, 300));
          } else {
            if (this.canBuyReroll) {
              this.buyShapeReroll();
              await new Promise(resolve => setTimeout(resolve, 300));
            } else {
              this.stopAutoSort();
              return;
            }
          }
        } finally {
          isSorting = false;
        }
      };
    this.autoSortInterval = setInterval(async () => {
      if (!this.isAutoSorting) return;
      await autoSort();
    }, 350);
  },
  stopAutoSort() {
    console.log("停止自动运行");
    clearInterval(this.autoSortInterval);
    this.isAutoSorting = false;
  },
  clickShapeByColor(shapeName) {
    for (let y = 0; y < this.shapeGrid.length; y++) {
      for (let x = 0; x < this.shapeGrid[y].length; x++) {
        if (this.shapeGrid[y][x] === shapeName) {
          this.selectTile(x, y);
          return;
        }
      }
    }
  },
  async clearAllMotivationInstantly() {
    if (this.isClearing) return;
    this.isClearing = true;
    
    try {
      // 停止自动运行
      if (this.isAutoSorting) {
        this.stopAutoSort();
      }
      
      console.log("开始清空体力，当前动力值:", this.$store.getters['currency/value']('gallery_motivation'));
      
      // 记录总收益
      const totalGains = {};
      let totalMotivationUsed = 0;
      let rerollCount = 0;
      let shapeMotivationUsed = 0;
      
      // 防止无限循环
      let maxIterations = 200;
      let iteration = 0;
      
      // 循环处理直到动力值耗尽
      while (iteration < maxIterations) {
        iteration++;
        
        // 获取当前动力值
        const currentMotivation = this.$store.getters['currency/value']('gallery_motivation');
        if (currentMotivation < 5) {
          console.log("动力值不足5点，停止处理");
          break;
        }
        
        // 获取形状数量信息 - 每次重新获取最新状态
        const shapeCounts = {...this.gridStat};
        
        // 形状数量从多到少排序
        const sortedShapes = Object.entries(shapeCounts)
          .filter(([, count]) => count >= 5) // 只处理数量≥5的形状
          .sort((a, b) => b[1] - a[1]);      // 数量从多到少排序
        
        if (sortedShapes.length === 0) {
          // 如果没有足够的形状，使用重洗功能
          if (this.canBuyReroll) {
            this.buyShapeReroll();
            // 记录重洗消耗的动力值
            totalMotivationUsed += GALLERY_REROLL_COST;
            rerollCount++;
            // 不等待DOM更新
            continue;
          } else {
            console.log("没有可消除的形状且无法重洗，停止处理");
            break;
          }
        }
        
        let processedAny = false;
        
        // 处理每种形状一次
        for (const [shapeName, amount] of sortedShapes) {
          // 检查是否还有足够动力值
          if (!this.$store.getters['currency/canAfford']({gallery_motivation: amount})) {
            continue;
          }
          
          // 计算资源获取量
          const gainAmount = Math.pow(amount, 2);
          
          // 记录收益
          if (!totalGains[shapeName]) {
            totalGains[shapeName] = 0;
          }
          totalGains[shapeName] += gainAmount;
          totalMotivationUsed += amount;
          shapeMotivationUsed += amount;
          
          // 构建网格并记录要重新生成的位置
          let connectedGrid = [];
          for (let y = 0; y < this.shapeGrid.length; y++) {
            const row = [];
            for (let x = 0; x < this.shapeGrid[y].length; x++) {
              row.push(this.shapeGrid[y][x] === shapeName);
            }
            connectedGrid.push(row);
          }
          
          // 直接获得资源
          this.$store.dispatch('currency/gain', {
            feature: 'gallery', 
            name: shapeName, 
            gainMult: true,
            amount: gainAmount
          });
          
          // 更新统计
          this.$store.commit('stat/increaseTo', {
            feature: 'gallery', 
            name: 'shapeComboHighest', 
            value: amount
          });
          
          this.$store.commit('stat/add', {
            feature: 'gallery', 
            name: 'shapeComboTotal', 
            value: amount
          });
          
          // 消耗动力值
          this.$store.dispatch('currency/spend', {
            feature: 'gallery', 
            name: 'motivation', 
            amount: amount
          });
          
          // 处理沙漏组合
          if (this.$store.getters['gallery/shapeHasHourglass']) {
            this.$store.commit('gallery/updateKey', {
              key: 'hourglassCombo', 
              value: this.$store.state.gallery.hourglassCombo + amount
            });
          }
          
          // 重新生成被移除的形状
          this.$store.dispatch('gallery/rerollShapes', connectedGrid);
          
          // 不给DOM时间更新
          
          processedAny = true;
          // 处理一个形状后退出内循环
          break;
        }
        
        // 如果没有处理任何形状，可能是状态不一致，退出循环
        if (!processedAny) {
          console.log("当前循环未处理任何形状，退出以防止卡死");
          break;
        }
      }
      
      // 如果达到最大迭代次数，记录警告
      if (iteration >= maxIterations) {
        console.warn("清空体力达到最大迭代次数限制，强制停止");
      }
      
      // 输出汇总收益信息
      console.log("======= 清空体力收益汇总 =======");
      for (const [shapeName, amount] of Object.entries(totalGains)) {
        console.log(`${shapeName}: +${amount}`);
      }
      console.log(`总消耗动力值: ${totalMotivationUsed}`);
      console.log(`- 形状消除: ${shapeMotivationUsed}`);
      console.log(`- 重洗消耗(${rerollCount}次): ${rerollCount * GALLERY_REROLL_COST}`);
      console.log("===============================");
      console.log("清空体力完成，剩余动力值:", this.$store.getters['currency/value']('gallery_motivation'));
    } catch (error) {
      console.error("清空体力过程中出现错误:", error);
    } finally {
      this.isClearing = false;
    }
  }
  }
}
</script>
