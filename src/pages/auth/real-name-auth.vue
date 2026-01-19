<template>
  <view class="auth-page">
    <u-navbar title="实名认证" back-text="返回" />

    <view class="auth-content">
      <!-- 认证步骤指示器 -->
      <u-steps :active="activeStep" direction="horizontal" class="step-indicator">
        <u-steps-item title="身份证信息" />
        <u-steps-item title="人脸验证" />
        <u-steps-item title="认证结果" />
      </u-steps>

      <!-- 身份证信息录入 -->
      <u-form
        v-if="activeStep === 0"
        ref="idCardFormRef"
        :model="idCardForm"
        label-position="top"
        :rules="idCardRules"
      >
        <u-form-item label="姓名" prop="name" required>
          <u-input v-model="idCardForm.name" placeholder="请输入姓名" />
        </u-form-item>

        <u-form-item label="身份证号" prop="idCardNumber" required>
          <u-input v-model="idCardForm.idCardNumber" placeholder="请输入身份证号" />
        </u-form-item>

        <u-form-item label="身份证正面" prop="idCardFront">
          <u-upload
            :file-list="idCardFrontList"
            name="idCardFront"
            max-count="1"
            :max-size="5 * 1024 * 1024"
            @after-read="onIdCardFrontRead"
            @delete="onIdCardFrontDelete"
          />
        </u-form-item>

        <u-form-item label="身份证背面" prop="idCardBack">
          <u-upload
            :file-list="idCardBackList"
            name="idCardBack"
            max-count="1"
            :max-size="5 * 1024 * 1024"
            @after-read="onIdCardBackRead"
            @delete="onIdCardBackDelete"
          />
        </u-form-item>

        <view class="form-buttons">
          <u-button type="primary" @click="onIdCardSubmit">
            下一步
          </u-button>
        </view>
      </u-form>

      <!-- 人脸验证 -->
      <view v-if="activeStep === 1" class="face-verification">
        <view class="face-container">
          <u-loading-icon size="40" color="#007aff" text="准备人脸识别..." />
          <view class="face-tip">
            请确保光线充足，正视摄像头
          </view>
        </view>

        <view class="form-buttons">
          <u-button type="primary" @click="onFaceVerify">
            开始人脸识别
          </u-button>
          <u-button @click="onStepBack">
            上一步
          </u-button>
        </view>
      </view>

      <!-- 认证结果 -->
      <view v-if="activeStep === 2" class="auth-result">
        <view class="result-icon" :class="authResult === 'success' ? 'success' : 'fail'">
          <u-icon :name="authResult === 'success' ? 'success' : 'close'" size="80" color="#fff" />
        </view>
        <view class="result-title">
          {{ authResult === 'success' ? '认证成功' : '认证失败' }}
        </view>
        <view class="result-desc">
          {{ authResult === 'success' ? '恭喜您，实名认证已通过！' : '认证失败，请检查信息后重新尝试。' }}
        </view>

        <view class="form-buttons">
          <u-button
            type="primary"
            @click="onResultConfirm"
          >
            {{ authResult === 'success' ? '完成' : '重新认证' }}
          </u-button>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

// 认证步骤
const activeStep = ref(0)
// 认证结果
const authResult = ref<'success' | 'fail' | ''>('')

// 身份证表单数据
const idCardForm = reactive({
  name: '',
  idCardNumber: '',
  idCardFront: '',
  idCardBack: '',
})

// 身份证正面文件列表
const idCardFrontList = ref([])
// 身份证背面文件列表
const idCardBackList = ref([])

// 表单验证规则
const idCardRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  idCardNumber: [
    { required: true, message: '请输入身份证号', trigger: 'blur' },
    {
      pattern: /(^\d{15}$)|(^\d{18}$)|(^\d{17}([\dX])$)/i,
      message: '请输入有效的身份证号',
      trigger: 'blur',
    },
  ],
}

// 表单引用
const idCardFormRef = ref<any>(null)

// 身份证正面上传
function onIdCardFrontRead(event: any) {
  const { file } = event
  file.status = 'uploading'
  file.message = '上传中...'

  // 模拟上传
  setTimeout(() => {
    file.status = 'done'
    file.message = ''
    file.url = file.path
    idCardForm.idCardFront = file.path
    idCardFrontList.value = [file]
  }, 1500)
}

// 身份证正面删除
function onIdCardFrontDelete() {
  idCardForm.idCardFront = ''
  idCardFrontList.value = []
}

// 身份证背面上传
function onIdCardBackRead(event: any) {
  const { file } = event
  file.status = 'uploading'
  file.message = '上传中...'

  // 模拟上传
  setTimeout(() => {
    file.status = 'done'
    file.message = ''
    file.url = file.path
    idCardForm.idCardBack = file.path
    idCardBackList.value = [file]
  }, 1500)
}

// 身份证背面删除
function onIdCardBackDelete() {
  idCardForm.idCardBack = ''
  idCardBackList.value = []
}

// 身份证表单提交
function onIdCardSubmit() {
  idCardFormRef.value.validate().then(() => {
    // 验证通过，进入下一步
    activeStep.value = 1
  }).catch(() => {
    uni.showToast({
      title: '表单验证失败',
      icon: 'error',
    })
  })
}

// 人脸识别
function onFaceVerify() {
  uni.showLoading({
    title: '人脸识别中...',
  })

  // 模拟人脸识别
  setTimeout(() => {
    uni.hideLoading()

    // 随机模拟认证结果（实际项目中应调用真实的人脸识别API）
    const success = Math.random() > 0.2
    authResult.value = success ? 'success' : 'fail'
    activeStep.value = 2
  }, 2000)
}

// 上一步
function onStepBack() {
  if (activeStep.value > 0) {
    activeStep.value--
  }
}

// 结果确认
function onResultConfirm() {
  if (authResult.value === 'success') {
    // 认证成功，返回首页
    uni.navigateBack()
  }
  else {
    // 认证失败，重新开始
    activeStep.value = 0
    authResult.value = ''
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.auth-content {
  padding: 20rpx;
}

.step-indicator {
  margin-bottom: 30rpx;
  background-color: #fff;
  padding: 20rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.face-verification {
  background-color: #fff;
  padding: 40rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.face-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40rpx;
}

.face-tip {
  margin-top: 20rpx;
  color: #666;
  font-size: 28rpx;
}

.auth-result {
  background-color: #fff;
  padding: 40rpx;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.result-icon {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
}

.result-icon.success {
  background-color: #07c160;
}

.result-icon.fail {
  background-color: #ee0a24;
}

.result-title {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 10rpx;
}

.result-desc {
  color: #666;
  margin-bottom: 40rpx;
  text-align: center;
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
