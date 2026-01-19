<template>
  <view class="test-page">
    <u-navbar title="uView Plus 测试" back-text="返回" />

    <view class="test-content">
      <!-- 语言切换测试 -->
      <view class="section">
        <h3>{{ t('app.welcome') }}</h3>
        <u-picker
          v-model="selectedLanguage"
          :columns="languageOptions"
          placeholder="选择语言"
          @change="onLanguageChange"
        />
      </view>

      <!-- 聊天功能演示 -->
      <view class="section">
        <h3>{{ t('chat.group_chat') }}</h3>
        <u-button type="primary" @click="navigateToChat">
          进入群聊页面
        </u-button>
      </view>

      <!-- u-form组件测试 -->
      <view class="section">
        <h3>{{ t('form.family_name') }} {{ t('form.generation') }} {{ t('form.birth_date') }}</h3>
        <u-form ref="formRef" :model="formData" label-position="top">
          <u-form-item label="{{ t('user.name') }}" prop="name" required>
            <u-input v-model="formData.name" placeholder="请输入姓名" />
          </u-form-item>
          <u-form-item label="{{ t('form.family_name') }}" prop="familyName" required>
            <u-input v-model="formData.familyName" placeholder="请输入姓氏" />
          </u-form-item>
          <u-form-item label="{{ t('form.generation') }}" prop="generation">
            <u-input v-model="formData.generation" placeholder="请输入字辈" />
          </u-form-item>
          <u-form-item label="{{ t('form.birth_date') }}" prop="birthDate">
            <u-datetime-picker
              v-model="formData.birthDate"
              mode="date"
              placeholder="请选择出生日期"
            />
          </u-form-item>
          <u-form-item label="{{ t('form.marriage_status') }}" prop="marriageStatus">
            <u-radio-group v-model="formData.marriageStatus">
              <u-radio name="single">
                {{ t('form.marriage_status_single') }}
              </u-radio>
              <u-radio name="married">
                {{ t('form.marriage_status_married') }}
              </u-radio>
            </u-radio-group>
          </u-form-item>
          <view class="form-buttons">
            <u-button type="primary" @click="onSubmit">
              {{ t('common.submit') }}
            </u-button>
            <u-button @click="onReset">
              {{ t('common.reset') }}
            </u-button>
          </view>
        </u-form>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import i18n, { t } from '@/locale/index'

// 语言切换
const selectedLanguage = ref(uni.getLocale())
const languageOptions = [
  { value: 'zh-Hans', label: '简体中文' },
  { value: 'en', label: 'English' },
  { value: 'th', label: 'ไทย' },
]

function onLanguageChange(e: any) {
  const lang = e.value[0].value
  i18n.global.locale = lang
  uni.setLocale(lang)
  selectedLanguage.value = lang
}

// 跳转到群聊页面
function navigateToChat() {
  uni.navigateTo({
    url: '/pages/chat/chat',
  })
}

// 表单功能测试
const formRef = ref<any>(null)
const formData = ref({
  name: '',
  familyName: '',
  generation: '',
  birthDate: '',
  marriageStatus: 'single',
})

function onSubmit() {
  formRef.value.validate().then(() => {
    uni.showToast({
      title: `${t('common.save')}成功`,
      icon: 'success',
    })
  }).catch(() => {
    uni.showToast({
      title: `${t('common.save')}失败`,
      icon: 'error',
    })
  })
}

function onReset() {
  formRef.value.resetFields()
}
</script>

<style scoped>
.test-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.test-content {
  padding: 20rpx;
}

.section {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.section h3 {
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
</style>
