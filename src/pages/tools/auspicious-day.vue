<template>
  <view class="auspicious-day-page">
    <u-navbar title="黄道吉日查询" back-text="返回" />

    <view class="auspicious-day-container">
      <!-- 查询参数设置 -->
      <u-form ref="formRef" :model="queryForm" label-position="top">
        <u-form-item label="查询场景" prop="scene">
          <u-picker
            v-model="queryForm.scene"
            :range="sceneOptions"
            range-key="label"
            @confirm="onSceneChange"
          />
        </u-form-item>

        <u-form-item label="查询范围" prop="dateRange">
          <u-datetime-picker
            v-model="queryForm.dateRange"
            mode="daterange"
            :start-date="startDate"
            :end-date="endDate"
          />
        </u-form-item>

        <!-- 查询按钮 -->
        <view class="query-button">
          <u-button
            type="primary"
            size="large"
            :loading="querying"
            :disabled="querying"
            @click="onQueryAuspiciousDay"
          >
            {{ querying ? '查询中...' : '查询黄道吉日' }}
          </u-button>
        </view>
      </u-form>

      <!-- 查询结果 -->
      <view v-if="auspiciousDays.length > 0" class="result-section">
        <h3>查询结果</h3>
        <view class="result-info">
          <text>在 {{ queryForm.dateRange[0] }} 至 {{ queryForm.dateRange[1] }} 期间，为您找到 {{ auspiciousDays.length }} 个适合{{ currentScene.label }}的黄道吉日</text>
        </view>

        <!-- 日历展示 -->
        <view class="calendar-container">
          <u-calendar
            :selected="selectedDate"
            :show-more-days="true"
            :mark-date="auspiciousDays"
            @select="onDateSelect"
          />
        </view>

        <!-- 日期详情 -->
        <view v-if="selectedDetail" class="date-detail">
          <h4>{{ selectedDetail.date }} 详情</h4>
          <view class="detail-content">
            <view class="detail-item">
              <text class="label">宜：</text>
              <text class="value">{{ selectedDetail.suitable.join('、') }}</text>
            </view>
            <view class="detail-item">
              <text class="label">忌：</text>
              <text class="value">{{ selectedDetail.avoid.join('、') }}</text>
            </view>
            <view class="detail-item">
              <text class="label">评分：</text>
              <text class="value">
                <u-rate :count="5" :current="selectedDetail.score" :show-text="true" :size="24" />
              </text>
            </view>
            <view class="detail-item">
              <text class="label">气象参考：</text>
              <text class="value">{{ selectedDetail.weather }}</text>
            </view>
            <view class="detail-item">
              <text class="label">民俗依据：</text>
              <text class="value">{{ selectedDetail.folklore }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <u-empty
        v-if="showEmpty"
        mode="date"
        text="暂无符合条件的黄道吉日"
      />
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'

// 查询表单
const formRef = ref<any>(null)
const queryForm = reactive({
  scene: 'marriage',
  dateRange: [
    new Date().toISOString().split('T')[0],
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  ],
})

// 查询状态
const querying = ref(false)

// 起始日期和结束日期
const startDate = new Date()
const endDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)

// 场景选项
const sceneOptions = ref([
  { value: 'marriage', label: '婚嫁' },
  { value: 'ancestor', label: '祭祖' },
  { value: 'construction', label: '动土' },
  { value: 'move', label: '搬家' },
  { value: 'business', label: '开业' },
  { value: 'travel', label: '出行' },
])

// 当前选中的场景
const currentScene = computed(() => {
  return sceneOptions.value.find(option => option.value === queryForm.scene) || sceneOptions.value[0]
})

// 黄道吉日结果
const auspiciousDays = ref([])

// 选中的日期和详情
const selectedDate = ref('')
const selectedDetail = ref<any>(null)

// 空状态
const showEmpty = ref(false)

// 场景变化
function onSceneChange() {
  // 场景变化时的处理
}

// 查询黄道吉日
function onQueryAuspiciousDay() {
  // 显示查询中状态
  querying.value = true
  showEmpty.value = false
  auspiciousDays.value = []
  selectedDetail.value = null
  selectedDate.value = ''

  // 模拟查询黄道吉日
  setTimeout(() => {
    // 生成一些黄道吉日数据
    auspiciousDays.value = generateAuspiciousDays()

    // 隐藏查询中状态
    querying.value = false

    // 检查是否有结果
    showEmpty.value = auspiciousDays.value.length === 0
  }, 2000)
}

// 生成黄道吉日数据
function generateAuspiciousDays() {
  const days: any[] = []
  const start = new Date(queryForm.dateRange[0])
  const end = new Date(queryForm.dateRange[1])

  // 生成10个随机的黄道吉日
  for (let i = 0; i < 10; i++) {
    // 随机生成一个日期
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    const dateStr = randomDate.toISOString().split('T')[0]

    // 根据场景生成适合的宜忌
    const suitable = getSuitableActivities(queryForm.scene)
    const avoid = getAvoidActivities(queryForm.scene)

    days.push({
      date: dateStr,
      info: `${currentScene.value.label}吉日`,
      color: '#07c160',
      fullDay: true,
      suitable,
      avoid,
      score: Math.floor(Math.random() * 2) + 4, // 4-5分
      weather: getWeatherInfo(),
      folklore: getFolkloreInfo(queryForm.scene),
    })
  }

  return days
}

// 获取适合的活动
function getSuitableActivities(scene: string) {
  const activities: any = {
    marriage: ['嫁娶', '纳采', '祈福', '出行', '入宅'],
    ancestor: ['祭祀', '祈福', '斋醮', '纳采', '嫁娶'],
    construction: ['动土', '修造', '安门', '起基', '上梁'],
    move: ['入宅', '搬家', '安床', '祈福', '祭祀'],
    business: ['开业', '开市', '立券', '纳财', '祈福'],
    travel: ['出行', '祈福', '嫁娶', '动土', '入宅'],
  }
  return activities[scene] || ['嫁娶', '祈福', '出行']
}

// 获取避免的活动
function getAvoidActivities(scene: string) {
  const activities: any = {
    marriage: ['开市', '入殓', '安葬', '启钻', '修坟'],
    ancestor: ['开市', '立券', '纳财', '分居', '动土'],
    construction: ['嫁娶', '安葬', '开市', '入宅', '安床'],
    move: ['开市', '安葬', '动土', '破土', '修坟'],
    business: ['嫁娶', '安葬', '行丧', '破土', '修坟'],
    travel: ['动土', '破土', '安葬', '行丧', '修坟'],
  }
  return activities[scene] || ['开市', '入殓', '安葬']
}

// 获取气象参考
function getWeatherInfo() {
  const weatherOptions = [
    '晴，温度适宜，风力较小，适合户外活动',
    '多云，温度适中，紫外线较弱，适合外出',
    '晴，温度略高，建议做好防晒措施',
    '阴，温度适宜，适合各种活动',
    '晴，温度凉爽，风力适中，非常适合户外活动',
  ]
  return weatherOptions[Math.floor(Math.random() * weatherOptions.length)]
}

// 获取民俗依据
function getFolkloreInfo(scene: string) {
  const folklore: any = {
    marriage: '此日为黄道吉日，适合嫁娶。根据传统历法，此日天干地支相合，有利于夫妻关系和谐长久。',
    ancestor: '此日适合祭祀祖先，天干地支相生，有利于表达对祖先的敬意，祈求祖先保佑。',
    construction: '此日适合动土修造，天干地支相生，有利于工程顺利进行，避免不必要的麻烦。',
    move: '此日适合入宅搬家，天干地支相合，有利于家庭和睦，财运亨通。',
    business: '此日适合开业开市，天干地支相生，有利于生意兴隆，财源广进。',
    travel: '此日适合出行，天干地支相合，有利于旅途顺利，平安归来。',
  }
  return folklore[scene] || '此日为黄道吉日，适合各种吉祥活动。'
}

// 选择日期
function onDateSelect(date: string) {
  selectedDate.value = date
  // 查找对应的详情
  selectedDetail.value = auspiciousDays.value.find(day => day.date === date) || null
}
</script>

<style scoped>
.auspicious-day-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.auspicious-day-container {
  padding: 20rpx;
}

.query-button {
  margin-top: 30rpx;
}

.result-section {
  margin-top: 30rpx;
  background-color: #fff;
  padding: 20rpx;
  border-radius: 10rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.result-section h3 {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  text-align: center;
}

.result-info {
  margin-bottom: 20rpx;
  color: #666;
  line-height: 1.5;
}

.calendar-container {
  margin-bottom: 20rpx;
}

.date-detail {
  margin-top: 30rpx;
  background-color: #f5f5f5;
  padding: 20rpx;
  border-radius: 10rpx;
}

.date-detail h4 {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}

.detail-content {
  display: flex;
  flex-direction: column;
  gap: 15rpx;
}

.detail-item {
  display: flex;
  align-items: flex-start;
}

.detail-item .label {
  font-weight: bold;
  margin-right: 10rpx;
  color: #666;
  min-width: 100rpx;
  flex-shrink: 0;
}

.detail-item .value {
  color: #333;
  line-height: 1.6;
  flex: 1;
}

.detail-item .u-rate {
  margin: 0;
}
</style>
