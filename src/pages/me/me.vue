<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { LOGIN_PAGE } from '@/router/config'
import { useUserStore } from '@/store'
import { useTokenStore } from '@/store/token'

definePage({
  style: {
    navigationBarTitleText: '我的',
  },
})

const userStore = useUserStore()
const tokenStore = useTokenStore()
// 使用storeToRefs解构userInfo
const { userInfo } = storeToRefs(userStore)

// 微信小程序下登录
async function handleLogin() {
  // #ifdef MP-WEIXIN
  // 微信登录
  await tokenStore.wxLogin()

  // #endif
  // #ifndef MP-WEIXIN
  uni.navigateTo({
    url: `${LOGIN_PAGE}`,
  })
  // #endif
}

function handleLogout() {
  uni.showModal({
    title: '提示',
    content: '确定要退出登录吗？',
    success: (res) => {
      if (res.confirm) {
        // 清空用户信息
        useTokenStore().logout()
        // 执行退出登录逻辑
        uni.showToast({
          title: '退出登录成功',
          icon: 'success',
        })
        // #ifdef MP-WEIXIN
        // 微信小程序，去首页
        // uni.reLaunch({ url: '/pages/index/index' })
        // #endif
        // #ifndef MP-WEIXIN
        // 非微信小程序，去登录页
        // uni.navigateTo({ url: LOGIN_PAGE })
        // #endif
      }
    },
  })
}

// 跳转到个人资料页面
function navigateToProfile() {
  uni.navigateTo({
    url: '/pages/user/profile',
  })
}

// 跳转到实名认证页面
function navigateToAuth() {
  uni.navigateTo({
    url: '/pages/auth/real-name-auth',
  })
}

// 跳转到设置页面
function navigateToSettings() {
  uni.showToast({
    title: '设置功能开发中',
    icon: 'none',
  })
}

// 跳转到关于我们页面
function navigateToAbout() {
  uni.showToast({
    title: '关于我们功能开发中',
    icon: 'none',
  })
}
</script>

<template>
  <view class="profile-container">
    <view v-if="tokenStore.hasLogin" class="user-info-section">
      <view class="user-header">
        <u-avatar :src="userInfo.avatar" size="80" />
        <view class="user-details">
          <view class="user-name">
            {{ userInfo.nickname || userInfo.username }}
          </view>
          <view class="user-id">
            ID: {{ userInfo.userId }}
          </view>
        </view>
        <u-button
          type="text"
          icon="arrow-right"
          @click="navigateToProfile"
        >
          编辑资料
        </u-button>
      </view>

      <view class="user-stats">
        <view class="stat-item">
          <view class="stat-value">
            0
          </view>
          <view class="stat-label">
            宗亲
          </view>
        </view>
        <view class="stat-item">
          <view class="stat-value">
            0
          </view>
          <view class="stat-label">
            族谱
          </view>
        </view>
        <view class="stat-item">
          <view class="stat-value">
            0
          </view>
          <view class="stat-label">
            动态
          </view>
        </view>
      </view>
    </view>

    <view v-else class="login-section">
      <view class="mt-3 break-all px-3 text-center text-green-500">
        未登录
      </view>
      <button type="primary" class="mt-4 w-full" @click="handleLogin">
        登录
      </button>
    </view>

    <view v-if="tokenStore.hasLogin" class="menu-section">
      <u-list>
        <u-list-item
          title="个人资料"
          right-icon="arrow-right"
          @click="navigateToProfile"
        />
        <u-list-item
          title="实名认证"
          right-icon="arrow-right"
          @click="navigateToAuth"
        />
        <u-list-item
          title="设置"
          right-icon="arrow-right"
          @click="navigateToSettings"
        />
        <u-list-item
          title="关于我们"
          right-icon="arrow-right"
          @click="navigateToAbout"
        />
      </u-list>
    </view>

    <view v-if="tokenStore.hasLogin" class="logout-section">
      <button type="warn" class="w-full" @click="handleLogout">
        退出登录
      </button>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.profile-container {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20rpx;
}

.user-info-section {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.user-header {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.user-details {
  flex: 1;
  margin: 0 20rpx;
}

.user-name {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.user-id {
  font-size: 24rpx;
  color: #999;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  padding-top: 20rpx;
  border-top: 1rpx solid #eee;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 4rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #999;
}

.login-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 60vh;
}

.menu-section {
  background-color: #fff;
  border-radius: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.logout-section {
  background-color: #fff;
  border-radius: 20rpx;
  padding: 30rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}
</style>
