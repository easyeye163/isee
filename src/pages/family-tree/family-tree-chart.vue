<template>
  <view class="family-tree-chart-page">
    <u-navbar title="世系图可视化" back-text="返回" />

    <view class="chart-container">
      <!-- 工具栏 -->
      <view class="toolbar">
        <u-button
          type="primary"
          size="small"
          @click="onAddNode"
        >
          添加节点
        </u-button>
        <u-button
          type="success"
          size="small"
          @click="onZoomIn"
        >
          放大
        </u-button>
        <u-button
          type="success"
          size="small"
          @click="onZoomOut"
        >
          缩小
        </u-button>
        <u-button
          type="default"
          size="small"
          @click="onResetView"
        >
          重置视图
        </u-button>
        <u-button
          type="warning"
          size="small"
          :disabled="!selectedNode"
          @click="onEditNode"
        >
          编辑节点
        </u-button>
        <u-button
          type="error"
          size="small"
          :disabled="!selectedNode"
          @click="onDeleteNode"
        >
          删除节点
        </u-button>
      </view>

      <!-- 世系图绘制区域 -->
      <view class="chart-wrapper">
        <canvas
          ref="chartCanvas"
          class="family-tree-canvas"
          :style="{
            transform: `scale(${scale}) translate(${offsetX}px, ${offsetY}px)`,
            transformOrigin: '0 0',
          }"
          @touchstart="onCanvasTouchStart"
          @touchmove="onCanvasTouchMove"
          @touchend="onCanvasTouchEnd"
          @click="onCanvasClick"
        />
      </view>

      <!-- 节点详情弹窗 -->
      <u-popup v-model="showNodeDetail" mode="center" :round="20">
        <view class="node-detail-popup">
          <h3>{{ nodeDetail.id ? '编辑节点' : '添加节点' }}</h3>
          <u-form
            ref="nodeDetailForm"
            :model="nodeDetail"
            label-position="top"
            :rules="nodeDetailRules"
          >
            <u-form-item label="姓名" prop="name">
              <u-input v-model="nodeDetail.name" placeholder="请输入姓名" />
            </u-form-item>

            <u-form-item label="性别" prop="gender">
              <u-radio-group v-model="nodeDetail.gender" direction="row">
                <u-radio name="male">
                  男
                </u-radio>
                <u-radio name="female">
                  女
                </u-radio>
              </u-radio-group>
            </u-form-item>

            <u-form-item label="出生日期" prop="birthDate">
              <u-input v-model="nodeDetail.birthDate" placeholder="请输入出生日期" />
            </u-form-item>

            <u-form-item label="去世日期" prop="deathDate">
              <u-input v-model="nodeDetail.deathDate" placeholder="请输入去世日期" />
            </u-form-item>

            <u-form-item label="父亲ID" prop="fatherId">
              <u-input v-model.number="nodeDetail.fatherId" type="number" placeholder="请输入父亲ID" />
            </u-form-item>

            <u-form-item label="母亲ID" prop="motherId">
              <u-input v-model.number="nodeDetail.motherId" type="number" placeholder="请输入母亲ID" />
            </u-form-item>

            <u-form-item label="配偶ID" prop="spouseId">
              <u-input v-model.number="nodeDetail.spouseId" type="number" placeholder="请输入配偶ID" />
            </u-form-item>

            <u-form-item label="字辈" prop="generation">
              <u-input v-model="nodeDetail.generation" placeholder="请输入字辈" />
            </u-form-item>

            <view class="form-buttons">
              <u-button type="primary" @click="onSaveNodeDetail">
                保存
              </u-button>
              <u-button @click="showNodeDetail = false">
                取消
              </u-button>
            </view>
          </u-form>
        </view>
      </u-popup>
    </view>
  </view>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue'

// Canvas引用
const chartCanvas = ref<HTMLCanvasElement | null>(null)
// 上下文
let ctx: CanvasRenderingContext2D | null = null

// 缩放比例
const scale = ref(1)
// 偏移量
const offsetX = ref(0)
const offsetY = ref(0)

// 触摸状态
const isDragging = ref(false)
const lastTouchX = ref(0)
const lastTouchY = ref(0)

// 节点数据
const nodes = ref([
  { id: 1, name: '张三', gender: 'male', birthDate: '1950-01-01', deathDate: '', fatherId: null, motherId: null, spouseId: 2, generation: '德', x: 400, y: 100 },
  { id: 2, name: '李四', gender: 'female', birthDate: '1952-03-15', deathDate: '', fatherId: null, motherId: null, spouseId: 1, generation: '秀', x: 600, y: 100 },
  { id: 3, name: '张小明', gender: 'male', birthDate: '1975-05-20', deathDate: '', fatherId: 1, motherId: 2, spouseId: 4, generation: '明', x: 500, y: 250 },
  { id: 4, name: '王五', gender: 'female', birthDate: '1978-08-10', deathDate: '', fatherId: null, motherId: null, spouseId: 3, generation: '丽', x: 700, y: 250 },
  { id: 5, name: '张小红', gender: 'female', birthDate: '1980-12-01', deathDate: '', fatherId: 1, motherId: 2, spouseId: null, generation: '明', x: 300, y: 250 },
  { id: 6, name: '张小小', gender: 'male', birthDate: '2000-07-15', deathDate: '', fatherId: 3, motherId: 4, spouseId: null, generation: '国', x: 600, y: 400 },
])

// 选中的节点
const selectedNode = ref<any>(null)

// 节点详情弹窗
const showNodeDetail = ref(false)
const nodeDetail = reactive({
  id: 0,
  name: '',
  gender: 'male',
  birthDate: '',
  deathDate: '',
  fatherId: null,
  motherId: null,
  spouseId: null,
  generation: '',
})

// 节点详情表单规则
const nodeDetailRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
  ],
}

// 节点详情表单引用
const nodeDetailForm = ref<any>(null)

// 初始化Canvas
function initCanvas() {
  if (chartCanvas.value) {
    ctx = chartCanvas.value.getContext('2d')
    if (ctx) {
      // 设置Canvas尺寸
      chartCanvas.value.width = 1200
      chartCanvas.value.height = 800
      // 绘制世系图
      drawFamilyTree()
    }
  }
}

// 绘制世系图
function drawFamilyTree() {
  if (!ctx || !chartCanvas.value)
    return

  // 清空画布
  ctx.clearRect(0, 0, chartCanvas.value.width, chartCanvas.value.height)

  // 绘制连接线
  drawConnections()

  // 绘制节点
  drawNodes()
}

// 绘制连接线
function drawConnections() {
  if (!ctx)
    return

  ctx.strokeStyle = '#666'
  ctx.lineWidth = 2

  // 绘制父子关系
  nodes.value.forEach((node) => {
    if (node.fatherId) {
      const father = nodes.value.find(n => n.id === node.fatherId)
      if (father) {
        drawLine(father.x, father.y, node.x, node.y)
      }
    }
    if (node.motherId) {
      const mother = nodes.value.find(n => n.id === node.motherId)
      if (mother) {
        drawLine(mother.x, mother.y, node.x, node.y)
      }
    }
  })

  // 绘制配偶关系
  nodes.value.forEach((node) => {
    if (node.spouseId && node.id < node.spouseId) {
      const spouse = nodes.value.find(n => n.id === node.spouseId)
      if (spouse) {
        drawMarriageLine(node.x, node.y, spouse.x, spouse.y)
      }
    }
  })
}

// 绘制普通连线
function drawLine(x1: number, y1: number, x2: number, y2: number) {
  if (!ctx)
    return

  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}

// 绘制配偶连线
function drawMarriageLine(x1: number, y1: number, x2: number, y2: number) {
  if (!ctx)
    return

  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.setLineDash([5, 5])
  ctx.stroke()
  ctx.setLineDash([])
}

// 绘制节点
function drawNodes() {
  if (!ctx)
    return

  nodes.value.forEach((node) => {
    // 绘制节点背景
    ctx.fillStyle = node.gender === 'male' ? '#e6f7ff' : '#fff2e8'
    ctx.strokeStyle = selectedNode.value?.id === node.id ? '#1890ff' : '#d9d9d9'
    ctx.lineWidth = selectedNode.value?.id === node.id ? 3 : 1

    // 绘制圆角矩形
    const width = 120
    const height = 60
    drawRoundedRect(node.x - width / 2, node.y - height / 2, width, height, 8)

    // 绘制文字
    ctx.fillStyle = '#333'
    ctx.font = '14px Arial'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(node.name, node.x, node.y - 10)
    ctx.font = '12px Arial'
    ctx.fillText(node.generation, node.x, node.y + 10)
  })
}

// 绘制圆角矩形
function drawRoundedRect(x: number, y: number, width: number, height: number, radius: number) {
  if (!ctx)
    return

  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.arc(x + width - radius, y + radius, radius, Math.PI * 1.5, Math.PI * 2)
  ctx.lineTo(x + width, y + height - radius)
  ctx.arc(x + width - radius, y + height - radius, radius, 0, Math.PI * 0.5)
  ctx.lineTo(x + radius, y + height)
  ctx.arc(x + radius, y + height - radius, radius, Math.PI * 0.5, Math.PI)
  ctx.lineTo(x, y + radius)
  ctx.arc(x + radius, y + radius, radius, Math.PI, Math.PI * 1.5)
  ctx.fill()
  ctx.stroke()
}

// 放大
function onZoomIn() {
  scale.value = Math.min(scale.value + 0.1, 2)
  drawFamilyTree()
}

// 缩小
function onZoomOut() {
  scale.value = Math.max(scale.value - 0.1, 0.5)
  drawFamilyTree()
}

// 重置视图
function onResetView() {
  scale.value = 1
  offsetX.value = 0
  offsetY.value = 0
  drawFamilyTree()
}

// 添加节点
function onAddNode() {
  // 重置节点详情
  Object.assign(nodeDetail, {
    id: 0,
    name: '',
    gender: 'male',
    birthDate: '',
    deathDate: '',
    fatherId: null,
    motherId: null,
    spouseId: null,
    generation: '',
  })
  showNodeDetail.value = true
}

// 编辑节点
function onEditNode() {
  if (selectedNode.value) {
    Object.assign(nodeDetail, selectedNode.value)
    showNodeDetail.value = true
  }
}

// 删除节点
function onDeleteNode() {
  if (selectedNode.value) {
    uni.showModal({
      title: '提示',
      content: '确定要删除该节点吗？',
      success: (res) => {
        if (res.confirm) {
          // 删除节点
          nodes.value = nodes.value.filter(node => node.id !== selectedNode.value.id)
          // 清除选中状态
          selectedNode.value = null
          // 重新绘制
          drawFamilyTree()
        }
      },
    })
  }
}

// 保存节点详情
function onSaveNodeDetail() {
  nodeDetailForm.value.validate().then(() => {
    if (nodeDetail.id === 0) {
      // 新增节点
      const newId = Math.max(...nodes.value.map(node => node.id)) + 1
      const newNode = {
        ...nodeDetail,
        id: newId,
        x: 500,
        y: 300,
      }
      nodes.value.push(newNode)
    }
    else {
      // 更新节点
      const index = nodes.value.findIndex(node => node.id === nodeDetail.id)
      if (index !== -1) {
        nodes.value[index] = { ...nodeDetail }
      }
    }
    // 关闭弹窗
    showNodeDetail.value = false
    // 重新绘制
    drawFamilyTree()
  })
}

// 触摸开始
function onCanvasTouchStart(e: any) {
  isDragging.value = true
  lastTouchX.value = e.touches[0].clientX
  lastTouchY.value = e.touches[0].clientY
}

// 触摸移动
function onCanvasTouchMove(e: any) {
  if (isDragging.value) {
    const deltaX = e.touches[0].clientX - lastTouchX.value
    const deltaY = e.touches[0].clientY - lastTouchY.value
    offsetX.value += deltaX
    offsetY.value += deltaY
    lastTouchX.value = e.touches[0].clientX
    lastTouchY.value = e.touches[0].clientY
  }
}

// 触摸结束
function onCanvasTouchEnd() {
  isDragging.value = false
}

// 点击Canvas
function onCanvasClick(e: any) {
  if (!isDragging.value && ctx && chartCanvas.value) {
    // 计算点击位置相对于Canvas的坐标
    const rect = chartCanvas.value.getBoundingClientRect()
    const x = (e.clientX - rect.left - offsetX.value) / scale.value
    const y = (e.clientY - rect.top - offsetY.value) / scale.value

    // 查找点击的节点
    let clickedNode = null
    for (const node of nodes.value) {
      const width = 120
      const height = 60
      if (x >= node.x - width / 2 && x <= node.x + width / 2 && y >= node.y - height / 2 && y <= node.y + height / 2) {
        clickedNode = node
        break
      }
    }

    // 更新选中节点
    selectedNode.value = clickedNode
    // 重新绘制
    drawFamilyTree()
  }
}

// 页面加载时初始化
onMounted(() => {
  nextTick(() => {
    initCanvas()
  })
})
</script>

<style scoped>
.family-tree-chart-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.chart-container {
  padding: 20rpx;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 88rpx);
}

.toolbar {
  display: flex;
  gap: 10rpx;
  margin-bottom: 20rpx;
  flex-wrap: wrap;
}

.toolbar u-button {
  flex-shrink: 0;
}

.chart-wrapper {
  flex: 1;
  background-color: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  overflow: auto;
}

.family-tree-canvas {
  width: 1200px;
  height: 800px;
  background-color: #fafafa;
  border: 1rpx solid #eee;
  border-radius: 8rpx;
  touch-action: none;
}

.node-detail-popup {
  width: 90%;
  max-width: 500rpx;
  background-color: #fff;
  padding: 30rpx;
  border-radius: 20rpx;
}

.node-detail-popup h3 {
  margin: 0 0 20rpx 0;
  font-size: 32rpx;
  text-align: center;
  color: #333;
}

.form-buttons {
  display: flex;
  gap: 20rpx;
  margin-top: 20rpx;
}

.form-buttons u-button {
  flex: 1;
}
</style>
