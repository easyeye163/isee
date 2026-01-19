<template>
  <div :data-theme="theme">
    <!-- 主题切换按钮 -->
    <button class="theme-toggle" aria-label="切换主题" @click="toggleTheme">
      {{ theme === 'dark' ? '☀️' : '🌙' }}
    </button>

    <!-- 成功提示 -->
    <div class="success-toast" :class="{ show: showToast }">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { onHide, onLaunch, onShow } from '@dcloudio/uni-app'
import { onMounted, ref } from 'vue'
import { navigateToInterceptor } from '@/router/interceptor'

// 主题管理
const theme = ref('light')

// Toast管理
const showToast = ref(false)
const toastMessage = ref('')

// 初始化主题
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
    || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
  theme.value = savedTheme
})

// 切换主题
function toggleTheme() {
  theme.value = theme.value === 'dark' ? 'light' : 'dark'
  localStorage.setItem('theme', theme.value)
}

// 显示Toast
function showSuccessToast(message = '操作成功！') {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 2000)
}

// 保留 zongqing-app 原有的生命周期函数
onLaunch((options) => {
  console.log('App.vue onLaunch', options)

  // 检查用户是否已登录
  const userId = uni.getStorageSync('userId')
  console.log('App launch - userId:', userId)
})
onShow((options) => {
  console.log('App.vue onShow', options)

  // 检查用户是否已登录，如果已登录且当前是首页，则跳转到签到页面
  const userId = uni.getStorageSync('userId')
  if (userId && options?.path === 'pages/index/index') {
    console.log('用户已登录且在首页，跳转到签到页面')
    uni.redirectTo({
      url: '/pages/main/index',
    })
    return
  }

  if (options?.path) {
    navigateToInterceptor.invoke({ url: `/${options.path}`, query: options.query })
  }
  else {
    navigateToInterceptor.invoke({ url: '/' })
  }
})
onHide(() => {
  console.log('App Hide')
})
</script>

<style lang="scss">
/* 全局样式 */
:root {
  --primary-color: #4a90e2;
  --secondary-color: #f5a623;
  --background-color: #f8f9fa;
  --card-background: #ffffff;
  --text-color: #333333;
  --text-light: #666666;
  --border-color: #e0e0e0;
  --success-color: #50e3c2;
  --warning-color: #f8e71c;
  --shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  --border-radius: 16px;
  --transition: all 0.3s ease;
}

[data-theme='dark'] {
  --primary-color: #5aa0f2;
  --secondary-color: #f7b955;
  --background-color: #121212;
  --card-background: #1e1e1e;
  --text-color: #ffffff;
  --text-light: #b0b0b0;
  --border-color: #333333;
  --shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: var(--background-color);
  color: var(--text-color);
  transition: var(--transition);
  overflow-x: hidden;
}

/* 主题切换按钮 */
.theme-toggle {
  position: absolute;
  top: 20px;
  right: 20px;
  background: var(--card-background);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow);
  transition: var(--transition);
  color: var(--text-color);
}

.theme-toggle:hover {
  transform: scale(1.1);
}

/* 成功提示 */
.success-toast {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--success-color);
  color: white;
  padding: 20px 40px;
  border-radius: 25px;
  font-weight: bold;
  box-shadow: var(--shadow);
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition: var(--transition);
}

.success-toast.show {
  opacity: 1;
}
</style>
