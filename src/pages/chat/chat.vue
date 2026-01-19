<template>
  <view class="chat-page">
    <u-navbar
      :title="groupName"
      back-text="返回"
      @right-click="showGroupMenu = true"
    >
      <template #right>
        <u-icon name="ellipsis" size="28" />
      </template>
    </u-navbar>

    <view class="chat-container">
      <!-- 聊天消息列表 -->
      <scroll-view
        class="chat-list"
        scroll-y
        :scroll-top="scrollTop"
        @scroll="onScroll"
      >
        <u-list>
          <u-list-item
            v-for="item in chatList"
            :key="item.id"
            class="chat-item"
            :class="item.type"
          >
            <template #cover>
              <u-avatar :src="item.avatar" size="50" />
            </template>
            <template #content>
              <view class="message-content">
                <text class="nickname">{{ item.nickname }}</text>
                <view class="message-bubble">
                  <text>{{ item.content }}</text>
                </view>
                <text class="time">{{ item.time }}</text>
              </view>
            </template>
          </u-list-item>
        </u-list>
      </scroll-view>

      <!-- 消息输入框 -->
      <view class="chat-input">
        <u-message-input
          v-model="inputValue"
          placeholder="请输入消息"
          :show-emoji="true"
          :show-voice="true"
          @send="onSend"
        />
      </view>

      <!-- 群聊菜单 -->
      <u-popover v-model="showGroupMenu" placement="top-right">
        <u-button type="text" @click="onViewMembers">
          查看成员
        </u-button>
        <u-button type="text" @click="onGroupSettings">
          群设置
        </u-button>
      </u-popover>

      <!-- 群成员列表 -->
      <u-popup v-model="showMembers" mode="right" width="70%">
        <view class="members-popup">
          <view class="popup-header">
            <u-button type="text" @click="showMembers = false">
              返回
            </u-button>
            <h3>群成员 ({{ membersList.length }})</h3>
            <u-button type="text" @click="onInviteMembers">
              邀请
            </u-button>
          </view>
          <u-list>
            <u-list-item
              v-for="member in membersList"
              :key="member.id"
              :title="member.name"
              :sub-title="member.role"
              :cover="member.avatar"
              :arrow="true"
            />
          </u-list>
        </view>
      </u-popup>

      <!-- 群设置弹窗 -->
      <u-popup v-model="showGroupSettings" mode="center" :round="20">
        <view class="group-settings-popup">
          <h3>群设置</h3>
          <u-list>
            <u-list-item title="群名称" :arrow="true" @click="onEditGroupName">
              <template #right>
                <text class="setting-value">{{ groupName }}</text>
              </template>
            </u-list-item>
            <u-list-item title="群公告" :arrow="true" @click="onEditGroupNotice">
              <template #right>
                <text class="setting-value">{{ groupNotice || '暂无' }}</text>
              </template>
            </u-list-item>
            <u-list-item title="群成员管理" :arrow="true" @click="onMemberManagement" />
            <u-list-item title="群权限设置" :arrow="true" @click="onPermissionSettings" />
            <u-list-item title="退出群组" :arrow="true" class="danger-item" @click="onQuitGroup" />
          </u-list>
          <u-button type="default" @click="showGroupSettings = false">
            关闭
          </u-button>
        </view>
      </u-popup>
    </view>
  </view>
</template>

<script setup lang="ts">
import { nextTick, onLoad, onMounted, ref } from 'vue'

// 页面参数
const groupId = ref('')
const groupName = ref('宗亲群聊')
const groupNotice = ref('')

// 聊天列表数据
const chatList = ref([
  {
    id: 1,
    type: 'left',
    content: '大家好，我是张三，来自李氏宗族',
    time: '10:00',
    avatar: 'https://uviewui.com/common/logo.png',
    nickname: '张三',
  },
  {
    id: 2,
    type: 'right',
    content: '欢迎加入宗亲群！',
    time: '10:01',
    avatar: 'https://uviewui.com/common/logo.png',
    nickname: '李四',
  },
  {
    id: 3,
    type: 'left',
    content: '请问族谱录入功能什么时候上线？',
    time: '10:02',
    avatar: 'https://uviewui.com/common/logo.png',
    nickname: '王五',
  },
  {
    id: 4,
    type: 'right',
    content: '预计下周上线，敬请期待！',
    time: '10:03',
    avatar: 'https://uviewui.com/common/logo.png',
    nickname: '赵六',
  },
])

// 输入框内容
const inputValue = ref('')

// 滚动位置
const scrollTop = ref(0)

// 群聊菜单
const showGroupMenu = ref(false)
const showMembers = ref(false)
const showGroupSettings = ref(false)

// 群成员列表
const membersList = ref([
  {
    id: 1,
    name: '张三',
    avatar: 'https://uviewui.com/common/logo.png',
    role: '群主',
  },
  {
    id: 2,
    name: '李四',
    avatar: 'https://uviewui.com/common/logo.png',
    role: '管理员',
  },
  {
    id: 3,
    name: '王五',
    avatar: 'https://uviewui.com/common/logo.png',
    role: '成员',
  },
  {
    id: 4,
    name: '赵六',
    avatar: 'https://uviewui.com/common/logo.png',
    role: '成员',
  },
])

// 页面加载
onLoad((options: any) => {
  if (options.groupId) {
    groupId.value = options.groupId
  }
  if (options.groupName) {
    groupName.value = decodeURIComponent(options.groupName)
  }
})

// 发送消息
function onSend(msg: string) {
  if (!msg.trim())
    return

  chatList.value.push({
    id: Date.now(),
    type: 'right',
    content: msg,
    time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
    avatar: 'https://uviewui.com/common/logo.png',
    nickname: '我',
  })

  // 清空输入框
  inputValue.value = ''

  // 滚动到底部
  nextTick(() => {
    scrollToBottom()
  })
}

// 滚动到底部
function scrollToBottom() {
  // 获取滚动容器
  const scrollView = uni.createSelectorQuery().select('.chat-list')
  scrollView.fields({ size: true, scrollOffset: true }, (res) => {
    // 计算滚动高度
    const height = res.scrollHeight
    scrollTop.value = height
  }).exec()
}

// 监听滚动
function onScroll(e: any) {
  scrollTop.value = e.detail.scrollTop
}

// 查看成员
function onViewMembers() {
  showGroupMenu.value = false
  showMembers.value = true
}

// 群设置
function onGroupSettings() {
  showGroupMenu.value = false
  showGroupSettings.value = true
}

// 邀请成员
function onInviteMembers() {
  uni.showToast({
    title: '邀请功能开发中',
    icon: 'none',
  })
}

// 编辑群名称
function onEditGroupName() {
  uni.showToast({
    title: '编辑群名称功能开发中',
    icon: 'none',
  })
}

// 编辑群公告
function onEditGroupNotice() {
  uni.showToast({
    title: '编辑群公告功能开发中',
    icon: 'none',
  })
}

// 成员管理
function onMemberManagement() {
  uni.showToast({
    title: '成员管理功能开发中',
    icon: 'none',
  })
}

// 权限设置
function onPermissionSettings() {
  uni.showToast({
    title: '权限设置功能开发中',
    icon: 'none',
  })
}

// 退出群组
function onQuitGroup() {
  uni.showModal({
    title: '确认退出',
    content: '您确定要退出该群组吗？',
    success: (res) => {
      if (res.confirm) {
        uni.navigateBack()
      }
    },
  })
}

// 页面加载时滚动到底部
onMounted(() => {
  nextTick(() => {
    scrollToBottom()
  })
})
</script>

<style scoped>
.chat-page {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;
}

.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: calc(100vh - 88rpx);
}

.chat-list {
  flex: 1;
  padding: 20rpx;
  overflow-y: auto;
}

.chat-item {
  margin-bottom: 20rpx;
  display: flex;
  align-items: flex-start;
}

.chat-item.left {
  flex-direction: row;
}

.chat-item.right {
  flex-direction: row-reverse;
}

.nickname {
  font-size: 24rpx;
  color: #666;
  margin-bottom: 8rpx;
  display: block;
}

.message-content {
  display: flex;
  flex-direction: column;
  margin: 0 20rpx;
}

.message-bubble {
  background-color: #fff;
  padding: 15rpx 20rpx;
  border-radius: 16rpx;
  max-width: 60%;
  box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
}

.chat-item.right .message-bubble {
  background-color: #007aff;
  color: #fff;
}

.time {
  font-size: 20rpx;
  color: #999;
  margin-top: 8rpx;
  align-self: flex-start;
}

.chat-item.right .time {
  align-self: flex-end;
}

.chat-input {
  padding: 20rpx;
  background-color: #fff;
  border-top: 1rpx solid #eee;
}
</style>
