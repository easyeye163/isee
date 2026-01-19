<script lang="ts" setup>
// 引入页面配置
import { onLoad } from '@dcloudio/uni-app'

import { ref } from 'vue'

defineOptions({
  name: 'Home',
})
definePage({
  // 使用 type: "page" 属性设置为普通页面
  type: 'page',
  style: {
    // 'custom' 表示开启自定义导航栏，默认 'default'
    navigationStyle: 'custom',
    navigationBarTitleText: '%tabbar.home%',
  },
})

const description = ref(
  '宗族亲脉是一个专注于宗亲社交与族谱管理的平台，帮助用户连接宗亲、管理族谱信息，传承家族文化。',
)
console.log('index/index 首页打印了')

// 跳转到群聊页面
function navigateToChat() {
  uni.navigateTo({
    url: '/pages/chat/chat',
  })
}

// 跳转到群组管理页面
function navigateToGroups() {
  uni.navigateTo({
    url: '/pages/chat/groups',
  })
}

// 跳转到动态列表页面
function navigateToFeed() {
  uni.navigateTo({
    url: '/pages/feed/list',
  })
}

// 跳转到族谱录入页面
function navigateToFamilyTree() {
  uni.navigateTo({
    url: '/pages/family-tree/family-tree',
  })
}

// 跳转到宗族事务页面
function navigateToAffairs() {
  uni.navigateTo({
    url: '/pages/notification/affairs',
  })
}

// 跳转到AI起名页面
function navigateToNameGenerator() {
  uni.navigateTo({
    url: '/pages/tools/name-generator',
  })
}

// 跳转到黄道吉日查询页面
function navigateToAuspiciousDay() {
  uni.navigateTo({
    url: '/pages/tools/auspicious-day',
  })
}

// 跳转到实名认证页面
function navigateToAuth() {
  uni.navigateTo({
    url: '/pages/auth/real-name-auth',
  })
}

// 跳转到商城页面
function navigateToMall() {
  uni.navigateTo({
    url: '/pages/mall/index',
  })
}

onLoad(() => {
  console.log('测试 uni API 自动引入: onLoad')

  // 检查用户是否已登录，如果已登录则跳转到签到页面
  const userId = uni.getStorageSync('userId')
  if (userId) {
    console.log('用户已登录，跳转到签到页面')
    uni.redirectTo({
      url: '/pages/main/index',
    })
  }
})
</script>

<template>
  <view class="min-h-screen bg-[#f2f2f7] pt-safe">
    <!-- 顶部Logo和标题 -->
    <view class="mb-6 rounded-b-2xl bg-white p-6 shadow-sm">
      <view class="flex flex-col items-center">
        <image src="/static/logo.svg" alt="" class="mb-4 h-20 w-20" />
        <view class="text-3xl text-black font-semibold">
          宗族亲脉
        </view>
        <view class="mt-1 text-lg text-gray-500">
          宗亲社交与族谱管理平台
        </view>
      </view>

      <!-- 应用描述 -->
      <view class="mt-6 text-base text-gray-600 leading-relaxed">
        {{ description }}
      </view>
    </view>

    <!-- 功能入口卡片 -->
    <view class="px-4">
      <view class="grid grid-cols-2 gap-4">
        <!-- 宗亲群组 -->
        <view
          class="flex flex-col items-center justify-center rounded-xl bg-white p-5 shadow-sm"
          @click="navigateToGroups"
        >
          <view class="mb-3 h-16 w-16 flex items-center justify-center rounded-full bg-blue-100">
            <i-carbon-users class="text-2xl text-blue-600" />
          </view>
          <view class="text-lg text-black font-medium">
            宗亲群组
          </view>
        </view>

        <!-- 宗亲动态 -->
        <view
          class="flex flex-col items-center justify-center rounded-xl bg-white p-5 shadow-sm"
          @click="navigateToFeed"
        >
          <view class="mb-3 h-16 w-16 flex items-center justify-center rounded-full bg-blue-100">
            <i-carbon-feed class="text-2xl text-blue-600" />
          </view>
          <view class="text-lg text-black font-medium">
            宗亲动态
          </view>
        </view>

        <!-- 录入族谱 -->
        <view
          class="flex flex-col items-center justify-center rounded-xl bg-white p-5 shadow-sm"
          @click="navigateToFamilyTree"
        >
          <view class="mb-3 h-16 w-16 flex items-center justify-center rounded-full bg-green-100">
            <i-carbon-tree-view class="text-2xl text-green-600" />
          </view>
          <view class="text-lg text-black font-medium">
            录入族谱
          </view>
        </view>

        <!-- 宗族事务 -->
        <view
          class="flex flex-col items-center justify-center rounded-xl bg-white p-5 shadow-sm"
          @click="navigateToAffairs"
        >
          <view class="mb-3 h-16 w-16 flex items-center justify-center rounded-full bg-green-100">
            <i-carbon-calendar class="text-2xl text-green-600" />
          </view>
          <view class="text-lg text-black font-medium">
            宗族事务
          </view>
        </view>

        <!-- AI起名 -->
        <view
          class="flex flex-col items-center justify-center rounded-xl bg-white p-5 shadow-sm"
          @click="navigateToNameGenerator"
        >
          <view class="mb-3 h-16 w-16 flex items-center justify-center rounded-full bg-amber-100">
            <i-carbon-edit class="text-2xl text-amber-600" />
          </view>
          <view class="text-lg text-black font-medium">
            AI起名
          </view>
        </view>

        <!-- 宗亲商城 -->
        <view
          class="flex flex-col items-center justify-center rounded-xl bg-white p-5 shadow-sm"
          @click="navigateToMall"
        >
          <view class="mb-3 h-16 w-16 flex items-center justify-center rounded-full bg-purple-100">
            <i-carbon-shopping-cart class="text-2xl text-purple-600" />
          </view>
          <view class="text-lg text-black font-medium">
            宗亲商城
          </view>
        </view>

        <!-- 黄道吉日 -->
        <view
          class="flex flex-col items-center justify-center rounded-xl bg-white p-5 shadow-sm"
          @click="navigateToAuspiciousDay"
        >
          <view class="mb-3 h-16 w-16 flex items-center justify-center rounded-full bg-amber-100">
            <i-carbon-date class="text-2xl text-amber-600" />
          </view>
          <view class="text-lg text-black font-medium">
            黄道吉日
          </view>
        </view>

        <!-- 实名认证 -->
        <view
          class="flex flex-col items-center justify-center rounded-xl bg-white p-5 shadow-sm"
          @click="navigateToAuth"
        >
          <view class="mb-3 h-16 w-16 flex items-center justify-center rounded-full bg-red-100">
            <i-carbon-verify class="text-2xl text-red-600" />
          </view>
          <view class="text-lg text-black font-medium">
            实名认证
          </view>
        </view>
      </view>
    </view>

    <!-- 底部信息 -->
    <view class="mb-12 mt-8 px-4 text-center text-sm text-gray-500">
      <view class="mb-1">
        作者：<text class="text-blue-600">菲鸽</text>
      </view>
      <view>官网地址：<text class="text-blue-600">https://unibest.tech</text></view>
    </view>
  </view>
  <tabbar />
</template>
