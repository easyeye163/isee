<template>
  <!-- 宗族事务页面 -->
  <view class="affairs-page">
    <!-- 顶部导航栏 -->
    <u-navbar title="宗族事务" back-text="返回" />

    <view class="affairs-container">
      <!-- 事务类型筛选 - 自定义标签页组件 -->
      <view class="tabs-container">
        <view class="tabs">
          <view
            v-for="(tab, index) in tabTypes"
            :key="index"
            class="tab-item"
            :class="{ active: activeTab === index }"
            @click="handleTabClick(index)"
          >
            {{ tab }}
          </view>
        </view>
        <!-- 标签页指示器 -->
        <view class="tab-indicator" :style="indicatorStyle" />
      </view>

      <!-- 事务列表 -->
      <u-list>
        <u-list-item
          v-for="affair in filteredAffairs"
          :key="affair.id"
          :title="affair.title"
          :sub-title="affair.createTime"
          :arrow="true"
          :custom-item="true"
          @click="viewAffairDetail(affair)"
        >
          <view class="affair-item">
            <!-- 事务内容 -->
            <view class="affair-content">
              <text>{{ affair.content }}</text>
            </view>

            <!-- 事务标签 -->
            <view class="affair-tags">
              <u-tag :type="getAffairTagType(affair.type)" size="small">
                {{ affair.type }}
              </u-tag>
              <u-tag v-if="affair.urgent" type="error" size="small">
                紧急
              </u-tag>
            </view>

            <!-- 事务状态 -->
            <view class="affair-status" :class="affair.status">
              {{ affair.status }}
            </view>
          </view>
        </u-list-item>
      </u-list>

      <!-- 空状态显示 -->
      <u-empty
        v-if="filteredAffairs.length === 0"
        mode="list"
        text="暂无相关事务信息"
      />

      <!-- 事务详情弹窗 -->
      <u-popup v-model="showDetailPopup" mode="center" :round="20" width="80%">
        <view v-if="selectedAffair" class="affair-detail-popup">
          <!-- 弹窗标题 -->
          <h3 class="popup-title">
            {{ selectedAffair.title }}
          </h3>

          <!-- 事务元信息 -->
          <view class="affair-detail-meta">
            <text class="affair-type">{{ selectedAffair.type }}</text>
            <text class="affair-time">{{ selectedAffair.createTime }}</text>
          </view>

          <!-- 事务详细内容 -->
          <view class="affair-detail-content">
            <text>{{ selectedAffair.content }}</text>
          </view>

          <!-- 事务信息列表 -->
          <view class="affair-detail-info">
            <view class="info-item">
              <text class="label">发起人：</text>
              <text class="value">{{ selectedAffair.initiator }}</text>
            </view>
            <view class="info-item">
              <text class="label">参与人数：</text>
              <text class="value">{{ selectedAffair.participantCount }}人</text>
            </view>
            <view class="info-item">
              <text class="label">联系电话：</text>
              <text class="value">{{ selectedAffair.contactPhone }}</text>
            </view>
            <view v-if="selectedAffair.location" class="info-item">
              <text class="label">地点：</text>
              <text class="value">{{ selectedAffair.location }}</text>
            </view>
            <view v-if="selectedAffair.time" class="info-item">
              <text class="label">时间：</text>
              <text class="value">{{ selectedAffair.time }}</text>
            </view>
          </view>

          <!-- 操作按钮 -->
          <view class="affair-actions">
            <u-button type="primary" @click="participateAffair">
              我要参加
            </u-button>
            <u-button @click="shareAffair">
              分享
            </u-button>
          </view>
        </view>
      </u-popup>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

/**
 * 标签页状态管理
 */
// 当前激活的标签页索引
const activeTab = ref(0)
// 标签页类型列表
const tabTypes = ['全部', '婚嫁', '丧葬', '祭祖', '聚会']

/**
 * 事务数据管理
 */
// 事务列表数据
const affairsList = ref([
  {
    id: 1,
    title: '李氏宗族2025年春节祭祖活动通知',
    content: '兹定于2025年2月10日（正月初一）上午9:00在李氏宗祠举行年度祭祖活动，诚邀全体宗亲参加。',
    type: '祭祖',
    createTime: '2025-12-16 09:00',
    initiator: '李氏族长',
    participantCount: 86,
    contactPhone: '13800138000',
    location: '李氏宗祠',
    time: '2025-02-10 09:00',
    status: '进行中',
    urgent: false,
  },
  {
    id: 2,
    title: '关于李四与张三婚礼的通知',
    content: '李四与张三将于2025年12月28日举行婚礼，欢迎宗亲们前来参加，共同见证这一美好时刻。',
    type: '婚嫁',
    createTime: '2025-12-15 14:30',
    initiator: '李四',
    participantCount: 120,
    contactPhone: '13900139000',
    location: 'XX酒店',
    time: '2025-12-28 12:00',
    status: '待进行',
    urgent: false,
  },
  {
    id: 3,
    title: '李老先生逝世讣告',
    content: '李老先生于2025年12月14日安详逝世，享年95岁。定于12月18日在李氏宗祠举行追悼会。',
    type: '丧葬',
    createTime: '2025-12-14 16:00',
    initiator: '李老家属',
    participantCount: 0,
    contactPhone: '13700137000',
    location: '李氏宗祠',
    time: '2025-12-18 10:00',
    status: '待进行',
    urgent: true,
  },
  {
    id: 4,
    title: '李氏宗亲2025年新年聚会通知',
    content: '为加强宗亲联系，定于2025年1月20日举行新年聚会，欢迎各位宗亲报名参加。',
    type: '聚会',
    createTime: '2025-12-13 10:00',
    initiator: '李氏宗亲会',
    participantCount: 58,
    contactPhone: '13600136000',
    location: 'XX餐厅',
    time: '2025-01-20 18:00',
    status: '待进行',
    urgent: false,
  },
])

/**
 * 事务详情弹窗管理
 */
// 是否显示事务详情弹窗
const showDetailPopup = ref(false)
// 当前选中的事务
const selectedAffair = ref<any>(null)

/**
 * 计算属性
 */
// 根据当前选中的标签页过滤事务列表
const filteredAffairs = computed(() => {
  // 如果是全部标签页，返回所有事务
  if (activeTab.value === 0) {
    return affairsList.value
  }
  // 否则返回对应类型的事务
  return affairsList.value.filter(affair => affair.type === tabTypes[activeTab.value])
})

// 标签页指示器样式计算
const indicatorStyle = computed(() => {
  return {
    left: `${activeTab.value * 20}%`, // 每个标签页占20%宽度
    width: '20%',
  }
})

/**
 * 事件处理函数
 */
// 标签页点击事件
function handleTabClick(index: number) {
  activeTab.value = index
  // 可以在这里添加额外的标签切换逻辑，如埋点统计
  console.log(`切换到标签页：${tabTypes[index]}`)
}

// 查看事务详情
function viewAffairDetail(affair: any) {
  selectedAffair.value = affair
  showDetailPopup.value = true
}

// 获取事务标签类型
function getAffairTagType(type: string) {
  // 根据事务类型返回对应的标签样式
  const tagTypeMap: Record<string, string> = {
    婚嫁: 'primary',
    丧葬: 'error',
    祭祖: 'success',
    聚会: 'warning',
  }
  return tagTypeMap[type] || 'default'
}

// 参与事务
function participateAffair() {
  if (selectedAffair.value) {
    // 更新参与人数
    selectedAffair.value.participantCount++
    // 显示成功提示
    uni.showToast({
      title: '报名成功！',
      icon: 'success',
      duration: 2000,
    })
    // 关闭详情弹窗
    showDetailPopup.value = false
  }
}

// 分享事务
function shareAffair() {
  // 调用系统分享菜单
  uni.showActionSheet({
    itemList: ['分享给朋友', '分享到朋友圈', '复制链接'],
    success: (res) => {
      // 根据用户选择执行不同的分享逻辑
      switch (res.tapIndex) {
        case 0:
          console.log('分享给朋友')
          break
        case 1:
          console.log('分享到朋友圈')
          break
        case 2:
          console.log('复制链接')
          break
      }
      // 显示分享成功提示
      uni.showToast({
        title: '分享成功！',
        icon: 'success',
        duration: 2000,
      })
    },
    fail: (err) => {
      console.error('分享失败：', err)
    },
  })
}
</script>

<style scoped>
/* 页面容器样式 */
.affairs-page {
  min-height: 100vh;
  background-color: #f2f2f7; /* iOS系统背景色 */
}

/* 内容容器样式 */
.affairs-container {
  padding: 0;
}

/* 标签页容器样式 */
.tabs-container {
  background-color: #fff;
  padding: 0 20rpx;
  position: relative;
  border-bottom: 1rpx solid #e5e7eb;
}

/* 标签页列表样式 */
.tabs {
  display: flex;
  justify-content: space-around;
  position: relative;
  z-index: 1;
}

/* 标签页项样式 */
.tab-item {
  flex: 1;
  text-align: center;
  padding: 20rpx 0;
  font-size: 28rpx;
  color: #666;
  position: relative;
  transition: all 0.3s ease;
}

/* 激活状态标签页样式 */
.tab-item.active {
  color: #007aff; /* iOS系统蓝色 */
  font-weight: 500;
}

/* 标签页指示器样式 */
.tab-indicator {
  position: absolute;
  bottom: 0;
  height: 4rpx;
  background-color: #007aff;
  transition: all 0.3s ease;
  border-radius: 2rpx;
  z-index: 2;
}

/* 事务项样式 */
.affair-item {
  padding: 20rpx 0;
}

/* 事务内容样式 */
.affair-content {
  margin-bottom: 15rpx;
  color: #666;
  line-height: 1.5;
  font-size: 28rpx;
}

/* 事务标签容器样式 */
.affair-tags {
  margin-bottom: 10rpx;
  display: flex;
  gap: 10rpx;
}

/* 事务状态样式 */
.affair-status {
  font-size: 24rpx;
  padding: 5rpx 15rpx;
  border-radius: 15rpx;
  position: absolute;
  top: 20rpx;
  right: 20rpx;
}

/* 进行中状态样式 */
.affair-status.进行中 {
  background-color: #e8f5e8;
  color: #4caf50;
}

/* 待进行状态样式 */
.affair-status.待进行 {
  background-color: #fff3e0;
  color: #ff9800;
}

/* 已结束状态样式 */
.affair-status.已结束 {
  background-color: #e0e0e0;
  color: #9e9e9e;
}

/* 事务详情弹窗样式 */
.affair-detail-popup {
  background-color: #fff;
  padding: 30rpx;
  border-radius: 20rpx;
}

/* 弹窗标题样式 */
.popup-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  text-align: center;
}

/* 事务元信息样式 */
.affair-detail-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20rpx;
  color: #999;
  font-size: 24rpx;
}

/* 事务详细内容样式 */
.affair-detail-content {
  margin-bottom: 30rpx;
  color: #333;
  line-height: 1.6;
}

/* 事务信息列表样式 */
.affair-detail-info {
  margin-bottom: 30rpx;
  background-color: #f5f5f5;
  padding: 20rpx;
  border-radius: 10rpx;
}

/* 信息项样式 */
.info-item {
  display: flex;
  margin-bottom: 15rpx;
  align-items: center;
}

/* 最后一个信息项样式 */
.info-item:last-child {
  margin-bottom: 0;
}

/* 信息标签样式 */
.info-item .label {
  font-weight: bold;
  margin-right: 10rpx;
  color: #666;
  min-width: 80rpx;
}

/* 信息值样式 */
.info-item .value {
  color: #333;
}

/* 操作按钮容器样式 */
.affair-actions {
  display: flex;
  gap: 20rpx;
}

/* 操作按钮样式 */
.affair-actions u-button {
  flex: 1;
}
</style>
