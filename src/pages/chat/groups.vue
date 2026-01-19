<template>
  <view class="groups-page">
    <u-navbar title="宗亲群组" back-text="返回">
      <template #right>
        <u-button type="text" @click="onCreateGroup">
          创建群组
        </u-button>
      </template>
    </u-navbar>

    <view class="groups-container">
      <!-- 群组列表 -->
      <u-list>
        <u-list-item
          v-for="group in groupsList"
          :key="group.id"
          :title="group.name"
          :sub-title="`${group.memberCount}人`"
          :cover="group.avatar"
          :arrow="true"
          @click="onEnterGroup(group)"
        >
          <template #right>
            <view class="group-status" :class="group.status">
              {{ getStatusText(group.status) }}
            </view>
          </template>
        </u-list-item>
      </u-list>

      <!-- 空状态 -->
      <u-empty
        v-if="groupsList.length === 0"
        mode="chat"
        text="暂无群组，点击右上角创建"
      />

      <!-- 群组创建弹窗 -->
      <u-popup v-model="showCreateGroup" mode="center" :round="20">
        <view class="create-group-popup">
          <h3>创建宗亲群组</h3>
          <u-form ref="formRef" :model="groupForm" label-position="top" :rules="rules">
            <u-form-item label="群组名称" prop="name">
              <u-input v-model="groupForm.name" placeholder="请输入群组名称" />
            </u-form-item>

            <u-form-item label="群组类型" prop="type">
              <u-radio-group v-model="groupForm.type" direction="row">
                <u-radio name="clan">
                  宗族分支
                </u-radio>
                <u-radio name="activity">
                  宗族活动
                </u-radio>
                <u-radio name="interest">
                  兴趣交流
                </u-radio>
              </u-radio-group>
            </u-form-item>

            <u-form-item label="群组描述" prop="description">
              <u-input
                v-model="groupForm.description"
                type="textarea"
                :rows="4"
                placeholder="请输入群组描述"
                maxlength="200"
                show-word-limit
              />
            </u-form-item>

            <u-form-item label="加入方式" prop="joinType">
              <u-radio-group v-model="groupForm.joinType" direction="row">
                <u-radio name="open">
                  公开加入
                </u-radio>
                <u-radio name="apply">
                  申请加入
                </u-radio>
                <u-radio name="invite">
                  邀请加入
                </u-radio>
              </u-radio-group>
            </u-form-item>

            <view class="form-buttons">
              <u-button type="primary" @click="onSubmitCreate">
                创建
              </u-button>
              <u-button @click="showCreateGroup = false">
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
import { reactive, ref } from 'vue'

// 群组列表数据
const groupsList = ref([
  {
    id: 1,
    name: '李氏宗族总群',
    avatar: '/static/images/avatar.jpg',
    memberCount: 123,
    status: 'online',
    type: 'clan',
  },
  {
    id: 2,
    name: '2025年祭祖活动群',
    avatar: '/static/images/default-avatar.png',
    memberCount: 45,
    status: 'online',
    type: 'activity',
  },
  {
    id: 3,
    name: '李氏字辈研究群',
    avatar: '/static/images/avatar.jpg',
    memberCount: 28,
    status: 'offline',
    type: 'interest',
  },
  {
    id: 4,
    name: '李氏广东分支群',
    avatar: '/static/images/avatar.jpg',
    memberCount: 89,
    status: 'online',
    type: 'clan',
  },
  {
    id: 5,
    name: '李氏江苏分支群',
    avatar: '/static/images/default-avatar.png',
    memberCount: 67,
    status: 'online',
    type: 'clan',
  },
  {
    id: 6,
    name: '2025年宗亲聚会筹备群',
    avatar: '/static/images/avatar.jpg',
    memberCount: 32,
    status: 'online',
    type: 'activity',
  },
  {
    id: 7,
    name: '李氏家族企业交流群',
    avatar: '/static/images/default-avatar.png',
    memberCount: 56,
    status: 'offline',
    type: 'interest',
  },
  {
    id: 8,
    name: '李氏家族文化传承群',
    avatar: '/static/images/avatar.jpg',
    memberCount: 41,
    status: 'online',
    type: 'interest',
  },
  {
    id: 9,
    name: '李氏海外宗亲联络群',
    avatar: '/static/images/default-avatar.png',
    memberCount: 78,
    status: 'offline',
    type: 'clan',
  },
  {
    id: 10,
    name: '李氏青年宗亲群',
    avatar: '/static/images/avatar.jpg',
    memberCount: 92,
    status: 'online',
    type: 'activity',
  },
])

// 创建群组弹窗
const showCreateGroup = ref(false)
const formRef = ref<any>(null)
const groupForm = reactive({
  name: '',
  type: 'clan',
  description: '',
  joinType: 'open',
})

// 表单验证规则
const rules = {
  name: [
    {
      required: true,
      message: '请输入群组名称',
      trigger: ['change', 'blur'],
    },
    {
      min: 2,
      max: 20,
      message: '群组名称长度在2-20个字符',
      trigger: ['change', 'blur'],
    },
  ],
}

// 进入群组聊天
function onEnterGroup(group: any) {
  uni.navigateTo({
    url: `/pages/chat/chat?groupId=${group.id}&groupName=${encodeURIComponent(group.name)}`,
  })
}

// 创建群组
function onCreateGroup() {
  showCreateGroup.value = true
}

// 提交创建群组
function onSubmitCreate() {
  if (!groupForm.name.trim()) {
    uni.showToast({
      title: '请输入群组名称',
      icon: 'error',
    })
    return
  }

  if (groupForm.name.length < 2 || groupForm.name.length > 20) {
    uni.showToast({
      title: '群组名称长度在2-20个字符',
      icon: 'error',
    })
    return
  }

  // 模拟创建群组
  const newGroup = {
    id: Date.now(),
    name: groupForm.name,
    avatar: '/static/images/avatar.jpg',
    memberCount: 1,
    status: 'online',
    type: groupForm.type,
  }

  groupsList.value.unshift(newGroup)
  showCreateGroup.value = false

  uni.showToast({
    title: '群组创建成功！',
    icon: 'success',
  })

  // 重置表单
  Object.assign(groupForm, {
    name: '',
    type: 'clan',
    description: '',
    joinType: 'open',
  })
}

// 获取状态文本
function getStatusText(status: string) {
  switch (status) {
    case 'online': return '在线'
    case 'offline': return '离线'
    default: return '未知'
  }
}
</script>

<style scoped>
.groups-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.groups-container {
  padding: 20rpx;
}

.group-status {
  font-size: 24rpx;
  padding: 5rpx 15rpx;
  border-radius: 15rpx;
}

.group-status.online {
  background-color: #e8f5e8;
  color: #4caf50;
}

.group-status.offline {
  background-color: #f5f5f5;
  color: #9e9e9e;
}

.create-group-popup {
  width: 80%;
  background-color: #fff;
  padding: 30rpx;
  border-radius: 20rpx;
}

.create-group-popup h3 {
  text-align: center;
  margin-bottom: 30rpx;
  font-size: 32rpx;
  font-weight: bold;
}

.form-buttons {
  display: flex;
  gap: 20rpx;
  margin-top: 30rpx;
}

.form-buttons u-button {
  flex: 1;
}
</style>
