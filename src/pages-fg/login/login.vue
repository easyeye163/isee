<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useTokenStore } from '@/store/token'

definePage({
  style: {
    navigationBarTitleText: '登录',
  },
})

// Token Store
const tokenStore = useTokenStore()

// 手机号登录表单数据
const phoneLoginForm = reactive({
  phone: '',
  code: '',
})

// 验证码倒计时
const countdown = ref(0)

// 表单引用
const phoneFormRef = ref<any>(null)

// 手机号登录验证规则
const phoneRules = {
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号', trigger: 'blur' },
  ],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '请输入6位验证码', trigger: 'blur' },
  ],
}

// 发送验证码
function onSendCode() {
  // 验证手机号格式
  if (!/^1[3-9]\d{9}$/.test(phoneLoginForm.phone)) {
    uni.showToast({
      title: '请输入有效的手机号',
      icon: 'error',
    })
    return
  }

  // 模拟发送验证码
  uni.showToast({
    title: '验证码发送成功',
    icon: 'success',
  })

  // 开始倒计时
  countdown.value = 60
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 手机号登录
function onPhoneLogin() {
  phoneFormRef.value.validate().then(async () => {
    try {
      // 调用手机号登录接口（模拟）
      await tokenStore.login({
        username: phoneLoginForm.phone,
        password: '123456', // 实际项目中应使用验证码登录
      })
      uni.navigateBack()
    }
    catch (error) {
      console.log('登录失败', error)
    }
  }).catch(() => {
    uni.showToast({
      title: '表单验证失败',
      icon: 'error',
    })
  })
}

// 微信登录
async function onWxLogin() {
  try {
    await tokenStore.wxLogin()
    uni.navigateBack()
  }
  catch (error) {
    console.log('微信登录失败', error)
  }
}

// QQ登录
function onQQLogin() {
  uni.showToast({
    title: 'QQ登录功能开发中',
    icon: 'none',
  })
}

// 立即注册
function onRegister() {
  uni.showToast({
    title: '注册功能开发中',
    icon: 'none',
  })
}

// 忘记密码
function onForgotPassword() {
  uni.showToast({
    title: '找回密码功能开发中',
    icon: 'none',
  })
}
</script>

<template>
  <view class="login-container">
    <!-- 本页面是非MP的登录页，主要用于 h5 和 APP -->
    <view class="login-box">
      <image src="/static/logo.svg" alt="宗族亲脉" class="logo" />
      <view class="login-title">
        宗族亲脉
      </view>

      <!-- 手机号登录 -->
      <u-form
        ref="phoneFormRef"
        :model="phoneLoginForm"
        label-position="left"
        :rules="phoneRules"
        class="login-form"
      >
        <u-form-item label="手机号" prop="phone" required>
          <u-input
            v-model="phoneLoginForm.phone"
            placeholder="请输入手机号"
            type="number"
            maxlength="11"
          />
        </u-form-item>

        <u-form-item label="验证码" prop="code" required>
          <template #right>
            <u-input
              v-model="phoneLoginForm.code"
              placeholder="请输入验证码"
              type="number"
              maxlength="6"
            >
              <template #suffix>
                <u-button
                  type="text"
                  size="small"
                  :disabled="countdown > 0"
                  @click="onSendCode"
                >
                  {{ countdown > 0 ? `${countdown}s后重发` : '获取验证码' }}
                </u-button>
              </template>
            </u-input>
          </template>
        </u-form-item>

        <u-form-item>
          <u-button
            type="primary"
            size="large"
            class="login-btn"
            @click="onPhoneLogin"
          >
            手机号登录
          </u-button>
        </u-form-item>
      </u-form>

      <!-- 分隔线 -->
      <view class="divider">
        <view class="line" />
        <text class="text">其他登录方式</text>
        <view class="line" />
      </view>

      <!-- 第三方登录 -->
      <view class="third-login">
        <u-button
          type="primary"
          plain
          icon="weixin"
          class="third-btn"
          @click="onWxLogin"
        >
          微信登录
        </u-button>
        <u-button
          type="primary"
          plain
          icon="qq"
          class="third-btn"
          @click="onQQLogin"
        >
          QQ登录
        </u-button>
      </view>

      <!-- 底部链接 -->
      <view class="login-footer">
        <text class="link" @click="onRegister">立即注册</text>
        <text class="link" @click="onForgotPassword">忘记密码</text>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.login-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
}

.login-box {
  width: 100%;
  max-width: 500rpx;
  background-color: #fff;
  border-radius: 20rpx;
  padding: 60rpx 40rpx;
  box-shadow: 0 4rpx 20rpx rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.logo {
  width: 120rpx;
  height: 120rpx;
  margin-bottom: 20rpx;
}

.login-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 40rpx;
}

.login-form {
  width: 100%;
  margin-bottom: 20rpx;
}

.login-btn {
  width: 100%;
  margin-top: 20rpx;
}

.divider {
  display: flex;
  align-items: center;
  width: 100%;
  margin: 30rpx 0;
}

.divider .line {
  flex: 1;
  height: 1rpx;
  background-color: #eee;
}

.divider .text {
  margin: 0 20rpx;
  font-size: 28rpx;
  color: #999;
}

.third-login {
  display: flex;
  width: 100%;
  justify-content: space-around;
  margin-bottom: 30rpx;
}

.third-btn {
  flex: 1;
  margin: 0 10rpx;
}

.login-footer {
  display: flex;
  justify-content: space-between;
  width: 100%;
  font-size: 28rpx;
}

.login-footer .link {
  color: #007aff;
  cursor: pointer;
}
</style>
