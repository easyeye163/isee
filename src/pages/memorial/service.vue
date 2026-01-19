<template>
  <view class="memorial-service-page">
    <u-navbar title="在线祭拜" back-text="返回" />

    <view class="memorial-content">
      <!-- 故人信息 -->
      <view class="deceased-info">
        <view class="avatar-container">
          <image
            :src="deceasedInfo.avatar || '/static/images/avatar.jpg'"
            alt="故人头像"
            class="avatar"
          />
        </view>
        <view class="info-text">
          <h2>{{ deceasedInfo.name }}</h2>
          <p>{{ deceasedInfo.birthDate }} - {{ deceasedInfo.deathDate }}</p>
          <p class="longevity">
            享年 {{ deceasedInfo.longevity }}
          </p>
        </view>
      </view>

      <!-- 祭拜方式 -->
      <view class="offerings-section">
        <h3>祭拜方式</h3>
        <view class="offerings-grid">
          <u-grid :col="4" :border="false">
            <u-grid-item
              v-for="offering in offerings"
              :key="offering.type"
              @click="onMakeOffering(offering)"
            >
              <view class="offering-icon" :class="offering.type">
                <text class="u-icon" :class="offering.icon" />
              </view>
              <text class="offering-text">{{ offering.name }}</text>
              <text class="offering-count">{{ offering.count }}</text>
            </u-grid-item>
          </u-grid>
        </view>
      </view>

      <!-- 祭拜仪式 -->
      <view class="ceremony-section">
        <h3>祭拜仪式</h3>
        <view class="ceremony-options">
          <u-button
            type="primary"
            size="large"
            style="margin-right: 20rpx;"
            @click="onStartCeremony('pray')"
          >
            祈福仪式
          </u-button>
          <u-button
            type="primary"
            size="large"
            @click="onStartCeremony('worship')"
          >
            祭拜仪式
          </u-button>
        </view>
      </view>

      <!-- 留言墙 -->
      <view class="message-section">
        <h3>留言墙</h3>

        <!-- 留言输入 -->
        <view class="message-input">
          <u-input
            v-model="newMessage"
            placeholder="写下您的思念..."
            type="textarea"
            :rows="3"
          />
          <u-button
            type="primary"
            size="small"
            :disabled="!newMessage.trim()"
            @click="onSubmitMessage"
          >
            提交
          </u-button>
        </view>

        <!-- 留言列表 -->
        <view class="message-list">
          <u-collapse v-model="activeMessage" accordion>
            <u-collapse-item
              v-for="message in messages"
              :key="message.id"
              :title="`${message.username} - ${formatDate(message.createTime)}`"
              :name="message.id"
            >
              <view class="message-content">
                {{ message.content }}
              </view>
            </u-collapse-item>
          </u-collapse>
        </view>
      </view>

      <!-- 祭拜记录 -->
      <view class="record-section">
        <h3>祭拜记录</h3>
        <u-scroll-list :height="300">
          <u-list-item
            v-for="record in records"
            :key="record.id"
            :title="record.type === 'flower' ? '献花' : record.type === 'wine' ? '敬酒' : '留言'"
            :sub-title="formatDate(record.createTime)"
            :arrow="false"
          />
        </u-scroll-list>
      </view>

      <!-- 分享功能 -->
      <view class="share-section">
        <u-button
          type="default"
          size="large"
          @click="onShare"
        >
          分享祭拜页面
        </u-button>
      </view>

      <!-- 仪式动画弹窗 -->
      <u-popup v-model="showCeremony" mode="center" :round="20">
        <view class="ceremony-popup">
          <h3>{{ currentCeremony === 'pray' ? '祈福仪式' : '祭拜仪式' }}</h3>
          <view class="ceremony-animation">
            <text class="u-icon u-icon-loading" />
            <text class="ceremony-text">正在进行{{ currentCeremony === 'pray' ? '祈福' : '祭拜' }}仪式...</text>
          </view>
          <view class="ceremony-progress">
            <u-line-progress
              :percent="ceremonyProgress"
              :show-text="true"
              active-color="#07c160"
            />
          </view>
          <u-button
            type="primary"
            style="margin-top: 20rpx;"
            @click="onCancelCeremony"
          >
            结束仪式
          </u-button>
        </view>
      </u-popup>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

// 故人信息
const deceasedInfo = reactive({
  id: 1,
  name: '李公讳德明',
  avatar: '/static/images/avatar.jpg',
  birthDate: '1920-05-10',
  deathDate: '2015-12-25',
  longevity: '95岁',
})

// 祭拜方式数据
const offerings = ref([
  { type: 'flower', name: '献花', icon: 'u-icon-flower', count: 123 },
  { type: 'wine', name: '敬酒', icon: 'u-icon-wine', count: 45 },
  { type: 'incense', name: '上香', icon: 'u-icon-incense', count: 89 },
  { type: 'candle', name: '点烛', icon: 'u-icon-candle', count: 67 },
  { type: 'food', name: '供品', icon: 'u-icon-food', count: 34 },
  { type: 'pray', name: '祈福', icon: 'u-icon-pray', count: 156 },
  { type: 'fireworks', name: '放鞭炮', icon: 'u-icon-fireworks', count: 78 },
  { type: 'kneel', name: '跪拜', icon: 'u-icon-kneel', count: 102 },
])

// 留言数据
const messages = ref([
  {
    id: 1,
    username: '李四',
    content: '爷爷，我们永远怀念您！',
    createTime: new Date().getTime() - 3600000,
  },
  {
    id: 2,
    username: '王五',
    content: '愿您在天堂一切安好！',
    createTime: new Date().getTime() - 7200000,
  },
])

// 祭拜记录
const records = ref([
  {
    id: 1,
    type: 'flower',
    createTime: new Date().getTime() - 3600000,
  },
  {
    id: 2,
    type: 'wine',
    createTime: new Date().getTime() - 7200000,
  },
  {
    id: 3,
    type: 'message',
    createTime: new Date().getTime() - 10800000,
  },
])

// 新留言
const newMessage = ref('')
// 活跃的留言
const activeMessage = ref([])

// 仪式弹窗
const showCeremony = ref(false)
const currentCeremony = ref('')
const ceremonyProgress = ref(0)

// 格式化日期
function formatDate(timestamp: number) {
  const date = new Date(timestamp)
  return `${date.getMonth() + 1}月${date.getDate()}日 ${date.getHours()}:${date.getMinutes()}`
}

// 进行祭拜
function onMakeOffering(offering: any) {
  // 模拟祭拜过程
  uni.showLoading({
    title: `${offering.name}中...`,
  })

  setTimeout(() => {
    // 更新祭拜计数
    offering.count++

    // 添加到祭拜记录
    records.value.unshift({
      id: Date.now(),
      type: offering.type,
      createTime: Date.now(),
    })

    uni.hideLoading()
    uni.showToast({
      title: `${offering.name}成功！`,
      icon: 'success',
    })
  }, 1000)
}

// 开始仪式
function onStartCeremony(type: string) {
  currentCeremony.value = type
  showCeremony.value = true
  ceremonyProgress.value = 0

  // 模拟仪式进度
  const ceremonyInterval = setInterval(() => {
    ceremonyProgress.value += 10
    if (ceremonyProgress.value >= 100) {
      clearInterval(ceremonyInterval)
      setTimeout(() => {
        showCeremony.value = false
        uni.showToast({
          title: `${type === 'pray' ? '祈福' : '祭拜'}仪式完成！`,
          icon: 'success',
        })
      }, 500)
    }
  }, 300)
}

// 取消仪式
function onCancelCeremony() {
  showCeremony.value = false
  ceremonyProgress.value = 0
}

// 提交留言
function onSubmitMessage() {
  if (!newMessage.value.trim()) {
    uni.showToast({
      title: '请输入留言内容',
      icon: 'error',
    })
    return
  }

  // 模拟提交留言
  const newMsg = {
    id: Date.now(),
    username: '当前用户',
    content: newMessage.value.trim(),
    createTime: Date.now(),
  }

  messages.value.unshift(newMsg)
  newMessage.value = ''

  // 添加到祭拜记录
  records.value.unshift({
    id: Date.now(),
    type: 'message',
    createTime: Date.now(),
  })

  uni.showToast({
    title: '留言成功！',
    icon: 'success',
  })
}

// 分享功能
function onShare() {
  uni.showActionSheet({
    itemList: ['分享给微信好友', '分享到朋友圈', '复制链接'],
    success: (res) => {
      let title = ''
      switch (res.tapIndex) {
        case 0:
          title = '已分享给微信好友'
          break
        case 1:
          title = '已分享到朋友圈'
          break
        case 2:
          title = '链接已复制'
          break
      }
      uni.showToast({
        title,
        icon: 'success',
      })
    },
  })
}
</script>

<style scoped>
.memorial-service-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.memorial-content {
  padding: 20rpx;
}

/* 故人信息 */
.deceased-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40rpx 0;
  background-color: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.avatar-container {
  width: 160rpx;
  height: 160rpx;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 20rpx;
  border: 4rpx solid #07c160;
}

.avatar {
  width: 100%;
  height: 100%;
}

.info-text {
  text-align: center;
}

.info-text h2 {
  margin: 0 0 10rpx 0;
  font-size: 36rpx;
  color: #333;
}

.info-text p {
  margin: 0 0 5rpx 0;
  font-size: 28rpx;
  color: #666;
}

.longevity {
  font-size: 24rpx;
  color: #999;
}

/* 祭拜方式 */
.offerings-section {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.offerings-section h3 {
  margin: 0 0 20rpx 0;
  font-size: 32rpx;
  color: #333;
}

.offering-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 50%;
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 10rpx;
  font-size: 40rpx;
}

.offering-text {
  display: block;
  text-align: center;
  font-size: 24rpx;
  color: #666;
}

.offering-count {
  display: block;
  text-align: center;
  font-size: 20rpx;
  color: #999;
  margin-top: 5rpx;
}

/* 祭拜仪式 */
.ceremony-section {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.ceremony-section h3 {
  margin: 0 0 20rpx 0;
  font-size: 32rpx;
  color: #333;
}

.ceremony-options {
  display: flex;
  gap: 20rpx;
}

.ceremony-options u-button {
  flex: 1;
}

/* 留言墙 */
.message-section {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.message-section h3 {
  margin: 0 0 20rpx 0;
  font-size: 32rpx;
  color: #333;
}

.message-input {
  margin-bottom: 20rpx;
}

.message-input u-button {
  margin-top: 10rpx;
}

.message-content {
  padding: 10rpx 0;
  font-size: 28rpx;
  color: #666;
}

/* 祭拜记录 */
.record-section {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.record-section h3 {
  margin: 0 0 20rpx 0;
  font-size: 32rpx;
  color: #333;
}

/* 分享功能 */
.share-section {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

/* 仪式弹窗 */
.ceremony-popup {
  width: 80%;
  background-color: #fff;
  padding: 40rpx;
  border-radius: 20rpx;
}

.ceremony-popup h3 {
  text-align: center;
  margin: 0 0 30rpx 0;
  font-size: 36rpx;
  color: #333;
}

.ceremony-animation {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30rpx;
}

.ceremony-animation .u-icon {
  font-size: 80rpx;
  color: #07c160;
  margin-bottom: 20rpx;
  animation: rotate 2s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.ceremony-text {
  font-size: 28rpx;
  color: #666;
}

.ceremony-progress {
  margin-bottom: 30rpx;
}
</style>
