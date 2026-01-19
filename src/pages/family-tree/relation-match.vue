<template>
  <view class="relation-match-page">
    <u-navbar title="宗亲关系智能匹配" back-text="返回" />

    <view class="match-container">
      <!-- 匹配条件 -->
      <view class="match-conditions">
        <h3>匹配条件</h3>
        <u-form
          ref="formRef"
          :model="matchForm"
          label-position="top"
        >
          <u-form-item label="姓氏" prop="familyName">
            <u-input v-model="matchForm.familyName" placeholder="请输入姓氏" />
          </u-form-item>

          <u-form-item label="字辈" prop="generation">
            <u-input v-model="matchForm.generation" placeholder="请输入字辈" />
          </u-form-item>

          <u-form-item label="籍贯" prop="nativePlace">
            <u-input v-model="matchForm.nativePlace" placeholder="请输入籍贯" />
          </u-form-item>

          <u-form-item label="祖籍" prop="ancestralHome">
            <u-input v-model="matchForm.ancestralHome" placeholder="请输入祖籍" />
          </u-form-item>

          <u-form-item label="匹配精度" prop="accuracy">
            <u-slider
              v-model="matchForm.accuracy"
              :min="70"
              :max="100"
              :step="5"
              @change="onAccuracyChange"
            />
            <view class="accuracy-value">
              {{ matchForm.accuracy }}%
            </view>
          </u-form-item>

          <view class="form-buttons">
            <u-button
              type="primary"
              size="large"
              @click="onStartMatch"
            >
              开始匹配
            </u-button>
          </view>
        </u-form>
      </view>

      <!-- 匹配结果 -->
      <view v-if="showResults" class="match-results">
        <h3>匹配结果 ({{ matchResults.length }} 个匹配)</h3>

        <u-list>
          <u-list-item
            v-for="(result) in matchResults"
            :key="result.id"
            :title="result.name"
            :sub-title="`匹配度: ${result.matchRate}% | ${result.relation}`"
            :cover="result.avatar"
            :arrow="true"
            @click="onViewDetail(result)"
          >
            <template #extra>
              <u-button
                type="primary"
                size="small"
                :disabled="result.requestSent"
                @click.stop="onSendRequest(result)"
              >
                {{ result.requestSent ? '已发送' : '发送申请' }}
              </u-button>
            </template>
          </u-list-item>
        </u-list>
      </view>

      <!-- 匹配进度 -->
      <view v-if="showProgress" class="match-progress">
        <h3>正在匹配...</h3>
        <u-line-progress
          :percent="matchProgress"
          :show-text="true"
          active-color="#07c160"
        />
        <view class="progress-text">
          正在分析宗亲关系...
        </view>
      </view>
    </view>

    <!-- 宗亲详情弹窗 -->
    <u-popup v-model="showDetail" mode="center" :round="20">
      <view class="detail-popup">
        <h3>{{ selectedResult.name }} - 宗亲详情</h3>
        <view class="detail-content">
          <view class="detail-item">
            <text class="label">匹配度：</text>
            <text class="value">{{ selectedResult.matchRate }}%</text>
          </view>
          <view class="detail-item">
            <text class="label">关系：</text>
            <text class="value">{{ selectedResult.relation }}</text>
          </view>
          <view class="detail-item">
            <text class="label">姓氏：</text>
            <text class="value">{{ selectedResult.familyName }}</text>
          </view>
          <view class="detail-item">
            <text class="label">字辈：</text>
            <text class="value">{{ selectedResult.generation }}</text>
          </view>
          <view class="detail-item">
            <text class="label">籍贯：</text>
            <text class="value">{{ selectedResult.nativePlace }}</text>
          </view>
          <view class="detail-item">
            <text class="label">祖籍：</text>
            <text class="value">{{ selectedResult.ancestralHome }}</text>
          </view>
          <view class="detail-item">
            <text class="label">共同先祖：</text>
            <text class="value">{{ selectedResult.commonAncestor }}</text>
          </view>
          <view class="detail-item">
            <text class="label">家族分支：</text>
            <text class="value">{{ selectedResult.familyBranch }}</text>
          </view>
        </view>
        <view class="form-buttons">
          <u-button
            type="primary"
            :disabled="selectedResult.requestSent"
            @click="onSendRequest(selectedResult)"
          >
            {{ selectedResult.requestSent ? '已发送' : '发送申请' }}
          </u-button>
          <u-button @click="showDetail = false">
            关闭
          </u-button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

// 匹配表单数据
const matchForm = reactive({
  familyName: '',
  generation: '',
  nativePlace: '',
  ancestralHome: '',
  accuracy: 85,
})

// 表单引用
const formRef = ref<any>(null)

// 匹配结果
const matchResults = ref([
  {
    id: 1,
    name: '张三',
    avatar: '/static/images/avatar.jpg',
    familyName: '张',
    generation: '明',
    nativePlace: '北京市',
    ancestralHome: '山西省洪洞县',
    matchRate: 95,
    relation: '堂兄弟',
    commonAncestor: '张老太爷',
    familyBranch: '北京分支',
    requestSent: false,
  },
  {
    id: 2,
    name: '李四',
    avatar: '/static/images/default-avatar.png',
    familyName: '李',
    generation: '丽',
    nativePlace: '上海市',
    ancestralHome: '江苏省苏州市',
    matchRate: 92,
    relation: '表姐妹',
    commonAncestor: '李老太太',
    familyBranch: '上海分支',
    requestSent: true,
  },
  {
    id: 3,
    name: '王五',
    avatar: '/static/images/default-avatar.png',
    familyName: '王',
    generation: '国',
    nativePlace: '广州市',
    ancestralHome: '山东省济南市',
    matchRate: 88,
    relation: '远房亲戚',
    commonAncestor: '王老太爷',
    familyBranch: '广州分支',
    requestSent: false,
  },
  {
    id: 4,
    name: '赵六',
    avatar: '/static/images/avatar.jpg',
    familyName: '赵',
    generation: '家',
    nativePlace: '深圳市',
    ancestralHome: '河北省石家庄市',
    matchRate: 85,
    relation: '同族宗亲',
    commonAncestor: '赵老太爷',
    familyBranch: '深圳分支',
    requestSent: false,
  },
])

// 显示结果
const showResults = ref(false)
// 显示进度
const showProgress = ref(false)
// 匹配进度
const matchProgress = ref(0)
// 选中的结果
const selectedResult = ref<any>(null)
// 显示详情
const showDetail = ref(false)

// 精度变化
function onAccuracyChange() {
  console.log('匹配精度变化:', matchForm.accuracy)
}

// 开始匹配
function onStartMatch() {
  // 显示匹配进度
  showProgress.value = true
  matchProgress.value = 0

  // 模拟匹配过程
  const progressInterval = setInterval(() => {
    matchProgress.value += 10
    if (matchProgress.value >= 100) {
      clearInterval(progressInterval)

      // 匹配完成，显示结果
      setTimeout(() => {
        showProgress.value = false
        showResults.value = true
      }, 500)
    }
  }, 300)
}

// 查看详情
function onViewDetail(result: any) {
  selectedResult.value = result
  showDetail.value = true
}

// 发送申请
function onSendRequest(result: any) {
  uni.showLoading({
    title: '发送中...',
  })

  // 模拟发送申请
  setTimeout(() => {
    uni.hideLoading()

    // 更新状态
    result.requestSent = true

    uni.showToast({
      title: '申请发送成功！',
      icon: 'success',
    })

    // 关闭详情弹窗
    if (showDetail.value) {
      showDetail.value = false
    }
  }, 1000)
}
</script>

<style scoped>
.relation-match-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.match-container {
  padding: 20rpx;
}

.match-conditions,
.match-results,
.match-progress {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

h3 {
  margin: 0 0 20rpx 0;
  font-size: 32rpx;
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

.accuracy-value {
  text-align: center;
  margin-top: 10rpx;
  font-size: 28rpx;
  color: #07c160;
  font-weight: bold;
}

.match-progress {
  text-align: center;
}

.progress-text {
  margin-top: 20rpx;
  font-size: 28rpx;
  color: #666;
}

.detail-popup {
  width: 90%;
  max-width: 500rpx;
  background-color: #fff;
  padding: 30rpx;
  border-radius: 20rpx;
}

.detail-popup h3 {
  text-align: center;
  margin-bottom: 20rpx;
}

.detail-content {
  margin-bottom: 20rpx;
}

.detail-item {
  display: flex;
  margin-bottom: 15rpx;
  align-items: center;
}

.detail-item .label {
  font-weight: bold;
  color: #333;
  margin-right: 10rpx;
  width: 120rpx;
}

.detail-item .value {
  color: #666;
  flex: 1;
}
</style>
