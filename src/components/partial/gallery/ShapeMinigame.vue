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
            <v-btn class="ma-1" width="36" min-width="36" color="primary" :disabled="!canBuyReroll" @click="buyShapeReroll"><v-icon>mdi-cached</v-icon></v-btn>
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
    dragY: null
  }),
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
    async triggerSort(shapeName) {
    console.log(`\n===== 正在尝试为形状 "${shapeName}" 排序聚合 =====`);

    // --- 配置参数 ---
    const config = {
        CONNECTIVITY_BONUS: 1000,
        MAX_ITERATIONS_FACTOR: 80,
        MOVE_DELAY_MS: 10,
        DOM_UPDATE_WAIT_MS: 20,
        ENABLE_STATE_SYNC_CHECK: false
    };

    // --- 内联辅助函数 ---
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
                const match = cell.id.match(/galleryShape_(\d+)_(\d+)/); // 使用正则提取数字
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

    // --- 算法执行逻辑 ---
    let solvedPath = null; // 用于存储最终结果
    try {
        const initialTargetCells = getTargetCells(shapeName);
        if (!initialTargetCells || initialTargetCells.length === 0) {
            console.log(`未找到任何形状为 "${shapeName}" 的单元格，操作取消。`);
            return;
        }
        console.log(`找到 ${initialTargetCells.length} 个 "${shapeName}" 单元格，开始处理...`);

        const allCellCoordsSet = getAllCellCoordsSet();
        if (allCellCoordsSet.size === 0) {
            console.error("错误：未能获取任何单元格坐标。");
            return;
        }

        let targetCoordsSet = new Set(initialTargetCells.map(c => coordsToString({ x: c.x, y: c.y })));

        if (isConnected(targetCoordsSet)) {
            console.log("初始状态已经连接。");
            solvedPath = []; // 空路径表示无需移动
            return; // 直接结束
        }

        const centerCoords = calculateCenterOfMass(targetCoordsSet);
        if (!centerCoords) {
            console.error("无法计算中心点。");
            return;
        }
        const centerStr = coordsToString(centerCoords);
        console.log(`目标中心点: ${centerStr}`);

        const history = [];
        let iterations = 0;
        const maxIterations = targetCoordsSet.size * config.MAX_ITERATIONS_FACTOR;
        console.time("SolveConnectivity Algorithm");

        while (!isConnected(targetCoordsSet)) {
            iterations++;
            if (iterations > maxIterations) {
                console.error(`超过最大迭代次数 (${maxIterations})，中止。`);
                solvedPath = null; // 标记失败
                console.timeEnd("SolveConnectivity Algorithm");
                return; // 退出函数
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
                        } else if (totalScore === 0 && !lateralMove) { // 找到第一个得分为0的移动作为备选
                            lateralMove = { srcId: idFromCoords(targetCoords), tgtId: idFromCoords(adjCoords), srcStr: targetStr, tgtStr: adjStr, score: 0, bonus: false };
                        }
                    }
                }
            } // end for targetStr

            // 选择移动：优先选择得分 > 0 的最佳移动，否则选择得分 = 0 的横向移动
            const move = bestMove && maxScore > 0 ? bestMove : lateralMove;

            if (!move) {
                console.error(`算法卡住：在迭代 ${iterations} 找不到有效移动 (得分>0 或 =0)。`);
                if (isConnected(targetCoordsSet)) { // 双重检查
                     console.log("卡住时检测到已连接，提前结束。");
                     break; // 跳出 while 循环
                 }
                solvedPath = null; // 标记失败
                console.timeEnd("SolveConnectivity Algorithm");
                return; // 退出函数
            }

            // console.log(`Iter ${iterations}: Move ${move.srcStr} -> ${move.tgtStr} (Score: ${move.score}${move.bonus ? ', Connects!' : ''})`);

            // 执行移动
            const success = await simulateDragDrop(move.srcId, move.tgtId);
            if (!success) {
                console.error(`移动 ${move.srcId} -> ${move.tgtId} 失败！中止。`);
                solvedPath = null; // 标记失败
                console.timeEnd("SolveConnectivity Algorithm");
                return; // 退出函数
            }

            // 等待 DOM 更新
            if (config.DOM_UPDATE_WAIT_MS > 0) await new Promise(resolve => setTimeout(resolve, config.DOM_UPDATE_WAIT_MS));

            // 更新内部状态
            targetCoordsSet.delete(move.srcStr);
            targetCoordsSet.add(move.tgtStr);
            history.push({ sourceId: move.srcId, targetId: move.tgtId });

            // 可选：状态同步检查
            if (config.ENABLE_STATE_SYNC_CHECK) {
                const currentDomTargets = getTargetCells(shapeName); // 重新从 DOM 获取
                const domTargetCoordsSet = new Set(currentDomTargets.map(c => coordsToString({x: c.x, y: c.y})));
                if(domTargetCoordsSet.size !== targetCoordsSet.size || ![...domTargetCoordsSet].every(coord => targetCoordsSet.has(coord))) {
                     console.warn(`状态不同步: DOM有 ${domTargetCoordsSet.size}, 集合有 ${targetCoordsSet.size}. 从DOM重新同步...`);
                     targetCoordsSet = domTargetCoordsSet; // 使用从 DOM 获取的最新状态
                     console.log(`重新同步后集合大小: ${targetCoordsSet.size}`);
                     if (isConnected(targetCoordsSet)) {
                         console.log("重新同步后发现已连接状态，结束。");
                         break; // 跳出 while 循环
                     }
                }
            }

            // 暂停以便观察
            if (config.MOVE_DELAY_MS > 0) await new Promise(resolve => setTimeout(resolve, config.MOVE_DELAY_MS));

        } // end while

        // 循环结束，检查最终状态
        console.timeEnd("SolveConnectivity Algorithm");
        if (isConnected(targetCoordsSet)) {
            console.log(`成功连接所有目标块！总步数: ${history.length}, 总迭代: ${iterations}`);
            solvedPath = history; // 成功找到路径
        } else {
            // 这种情况通常是因为达到了 maxIterations
            console.log("算法结束，但未能连接所有块（可能达到最大迭代次数）。");
            solvedPath = null; // 标记未完全成功
        }

    } catch (error) {
        console.error(`为形状 "${shapeName}" 执行排序聚合时发生意外错误:`, error);
        solvedPath = null; // 标记失败
        console.timeEnd("SolveConnectivity Algorithm"); // 确保计时器停止
    } finally {
          // 将结果存储到全局变量（如果需要）或进行其他处理
          window.solvedPath = solvedPath;
          if (solvedPath) {
              console.log(`找到的路径 (${solvedPath.length} 步):`, solvedPath);
          } else {
              console.log(`未能为形状 "${shapeName}" 找到解决方案。`);
          }
          console.log(`===== 形状 "${shapeName}" 处理结束 =====\n`);
    }
    }
  }
}
</script>
