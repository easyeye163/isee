<template>
  <view class="profile-page">
    <u-navbar title="个人资料" back-text="返回" />

    <view class="profile-content">
      <!-- 头像编辑 -->
      <view class="avatar-section">
        <u-avatar :src="userInfo.avatar" size="120" />
        <view class="avatar-upload">
          <u-button type="primary" size="mini" @click="onAvatarUpload">
            更换头像
          </u-button>
        </view>
      </view>

      <!-- 基础信息编辑 -->
      <u-form
        ref="formRef"
        :model="userForm"
        label-position="top"
        :rules="rules"
      >
        <u-form-item label="用户名" prop="username">
          <u-input v-model="userForm.username" placeholder="请输入用户名" />
        </u-form-item>

        <u-form-item label="昵称" prop="nickname">
          <u-input v-model="userForm.nickname" placeholder="请输入昵称" />
        </u-form-item>

        <u-form-item label="姓名" prop="realName">
          <u-input v-model="userForm.realName" placeholder="请输入真实姓名" />
        </u-form-item>

        <u-form-item label="性别" prop="gender">
          <u-radio-group v-model="userForm.gender" direction="row">
            <u-radio name="male">
              男
            </u-radio>
            <u-radio name="female">
              女
            </u-radio>
            <u-radio name="other">
              其他
            </u-radio>
          </u-radio-group>
        </u-form-item>

        <u-form-item label="年龄" prop="age">
          <u-input v-model.number="userForm.age" type="number" placeholder="请输入年龄" :min="0" :max="150" />
        </u-form-item>

        <u-form-item label="籍贯" prop="nativePlace">
          <u-input v-model="userForm.nativePlace" placeholder="请输入籍贯" />
        </u-form-item>

        <u-form-item label="姓氏" prop="familyName">
          <u-input v-model="userForm.familyName" placeholder="请输入姓氏" />
        </u-form-item>

        <u-form-item label="字辈" prop="generation">
          <u-input v-model="userForm.generation" placeholder="请输入字辈" />
        </u-form-item>

        <!-- 宗族标签 -->
        <u-form-item label="宗族标签">
          <u-checkbox-group v-model="selectedTags">
            <u-checkbox
              v-for="tag in tagOptions"
              :key="tag.value"
              :name="tag.value"
            >
              {{ tag.label }}
            </u-checkbox>
          </u-checkbox-group>
        </u-form-item>

        <!-- 提交按钮 -->
        <view class="form-buttons">
          <u-button type="primary" @click="onSubmit">
            保存修改
          </u-button>
        </view>
      </u-form>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useUserStore } from '@/store/user'

// 用户 Store
const userStore = useUserStore()

// 用户信息
const userInfo = computed(() => userStore.userInfo)

// 表单引用
const formRef = ref<any>(null)

// 表单数据
const userForm = reactive({
  username: userInfo.value.username,
  nickname: userInfo.value.nickname,
  realName: userInfo.value.realName || '',
  gender: userInfo.value.gender || 'male',
  age: userInfo.value.age || 0,
  nativePlace: userInfo.value.nativePlace || '',
  familyName: userInfo.value.familyName || '',
  generation: userInfo.value.generation || '',
})

// 宗族标签选项
const tagOptions = ref([
  { value: 'ancestor', label: '先祖祭祀' },
  { value: 'genealogy', label: '族谱管理' },
  { value: 'clan_activity', label: '宗族活动' },
  { value: 'family_reunion', label: '家族聚会' },
  { value: 'name_study', label: '姓名学' },
  { value: 'family_history', label: '家族历史' },
  { value: 'heritage', label: '文化传承' },
  { value: 'dna_test', label: 'DNA检测' },
  { value: 'overseas_clan', label: '海外宗亲' },
  { value: 'clan_business', label: '宗族商业' },
])

// 选中的标签
const selectedTags = ref<string[]>(userInfo.value.tags || [])

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  nickname: [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 2, max: 20, message: '昵称长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  realName: [
    { required: true, message: '请输入真实姓名', trigger: 'blur' },
  ],
}

// 页面加载时初始化表单数据
onMounted(() => {
  // 同步用户信息到表单
  userForm.username = userInfo.value.username
  userForm.nickname = userInfo.value.nickname
  userForm.realName = userInfo.value.realName || ''
  userForm.gender = userInfo.value.gender || 'male'
  userForm.age = userInfo.value.age || 0
  userForm.nativePlace = userInfo.value.nativePlace || ''
  userForm.familyName = userInfo.value.familyName || ''
  userForm.generation = userInfo.value.generation || ''
  selectedTags.value = userInfo.value.tags || []
})

// 更换头像
function onAvatarUpload() {
  uni.chooseImage({
    count: 1,
    sizeType: ['compressed'],
    sourceType: ['album', 'camera'],
    success: (res) => {
      const tempFilePath = res.tempFilePaths[0]
      // 模拟上传头像
      uni.showLoading({
        title: '上传中...',
      })

      setTimeout(() => {
        // 更新头像
        userStore.setUserAvatar(tempFilePath)
        uni.hideLoading()
        uni.showToast({
          title: '头像更新成功',
          icon: 'success',
        })
      }, 1500)
    },
  })
}

// 提交表单
function onSubmit() {
  formRef.value.validate().then(() => {
    // 验证通过，提交修改
    uni.showLoading({
      title: '保存中...',
    })

    // 合并用户信息
    const updatedUserInfo = {
      ...userInfo.value,
      ...userForm,
      tags: selectedTags.value,
    }

    // 更新用户信息
    setTimeout(() => {
      userStore.setUserInfo(updatedUserInfo)
      uni.hideLoading()
      uni.showToast({
        title: '保存成功',
        icon: 'success',
      })
      uni.navigateBack()
    }, 1500)
  }).catch(() => {
    uni.showToast({
      title: '表单验证失败',
      icon: 'error',
    })
  })
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.profile-content {
  padding: 20rpx;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40rpx;
  padding: 40rpx;
  background-color: #fff;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.avatar-upload {
  margin-top: 20rpx;
}

.form-buttons {
  display: flex;
  margin-top: 40rpx;
}

.form-buttons u-button {
  flex: 1;
}

/* 标签样式 */
.u-checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
}

.u-checkbox {
  margin-right: 0;
}
</style>
