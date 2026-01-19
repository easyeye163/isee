<template>
  <div class="page container">
    <div class="header">
      <div class="logo">
        知晓
      </div>
      <div class="subtitle">
        每日报平安
      </div>
    </div>

    <!-- 状态卡片 -->
    <div class="card status-card">
      <div class="status-icon">
        😊
      </div>
      <div class="status-text">
        您好，{{ userName }}
      </div>
      <div class="status-detail">
        <template v-if="signInStatus">
          <div v-if="signInStatus.todaySignedIn">
            今日已签到 | 连续签到 {{ signInStatus.streak }} 天
          </div>
          <div v-else>
            今天是 {{ currentDate }}，记得签到哦！
          </div>
          <div v-if="signInStatus.lastSignIn">
            上次签到：{{ formatDate(signInStatus.lastSignIn) }}
          </div>
        </template>
        <template v-else>
          正在加载状态...
        </template>
      </div>
    </div>

    <!-- 签到按钮 -->
    <div class="card">
      <button
        class="sign-in-btn"
        :disabled="signInStatus?.todaySignedIn || loading"
        :class="{ success: signInSuccess }"
        style="position: relative; z-index: 999; font-size: 2rem; padding: 60px 20px; border-radius: 50px; background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); color: white; border: none; cursor: pointer; font-weight: bold; box-shadow: 0 10px 30px rgba(74, 144, 226, 0.4); transition: var(--transition);"
        @click="handleSignIn"
      >
        {{ signInStatus?.todaySignedIn ? '今日已签到' : '签到' }}
      </button>
    </div>

    <!-- 倒计时 -->
    <div class="card">
      <div class="countdown">
        <div class="countdown-title">
          {{ signInStatus?.todaySignedIn ? '距离下次签到还有' : '距离签到截止还有' }}
        </div>
        <div class="countdown-timer">
          {{ countdown }}
        </div>
      </div>
    </div>

    <!-- 联系人列表 -->
    <div class="card">
      <div style="margin-bottom: 10px;">
        <h2>联系人</h2>
      </div>
      <div style="display: flex; justify-content: flex-end; gap: 10px">
        <button type="button" class="btn" style=" font-size: 0.9rem;" @click="editContacts">
          编辑
        </button>
        <button type="button" class="btn" style="font-size: 0.9rem; background: #f5a623;" @click="logout">
          退出登录
        </button>
      </div>
      <div class="contact-list">
        <div v-for="contact in contacts" :key="contact.id" class="contact-item">
          <div>
            <div><strong>{{ contact.type }}：{{ contact.name }}</strong></div>
            <div style="font-size: 0.8rem; color: var(--text-light);">
              {{ contact.email }}
            </div>
            <div v-if="contact.phone" style="font-size: 0.8rem; color: var(--text-light);">
              {{ contact.phone }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

// 导入真实 API
import api from '@/utils/api'

const loading = ref(false)
const signInSuccess = ref(false)
const signInStatus = ref<any>(null)
const contacts = ref<any[]>([])
const userName = ref('')
const currentDate = ref('')
const countdown = ref('23:59:59')
let countdownInterval: number | null = null

// 获取用户ID
function getUserId() {
  return uni.getStorageSync('userId')
}

// // 格式化日期 - 支持多种格式包括GMT和Date对象
// const formatDate = (dateValue: string | Date) => {
//   // 处理Date对象和字符串两种情况
//   let date: Date
//   if (dateValue instanceof Date) {
//     date = dateValue
//   } else {
//     // 尝试直接解析日期字符串，支持GMT格式
//     date = new Date(dateValue)
//   }

//   // 处理无效日期情况
//   if (Number.isNaN(date.getTime())) {
//     console.warn('无效的日期:', dateValue)
//     return ''
//   }

//   // 统一格式输出 - 使用明确的格式选项
//   return date.toLocaleString('zh-CN', {
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: false // 强制使用24小时制，避免AM/PM格式
//   })
// }

/**
 * 统一格式化日期为 "YYYY/MM/DD HH:mm" 格式
 * @param {Date | string | number} dateInput 输入日期（Date对象/合法日期字符串/时间戳）
 * @returns {string} 格式化后的日期字符串，格式错误返回空字符串
 */
function formatDate(dateInput) {
  // 步骤1：统一将输入转换为标准Date对象
  let date
  if (dateInput instanceof Date) {
    // 输入是Date对象，直接使用
    date = dateInput
  }
  else if (typeof dateInput === 'string' || typeof dateInput === 'number') {
    // 输入是字符串/时间戳，转换为Date对象
    date = new Date(dateInput)
  }
  else {
    // 不合法输入，返回空字符串（可根据需求调整默认值）
    return ''
  }

  // 步骤2：校验Date对象是否有效（避免无效日期转换）
  if (Number.isNaN(date.getTime())) {
    return ''
  }

  // 步骤3：提取年月日、时分（补零保证格式统一，如1月→01，9分→09）
  const year = date.getFullYear()
  // 月份是0-11，需要+1
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  // 步骤4：拼接成目标格式并返回
  return `${year}/${month}/${day} ${hours}:${minutes}`
}

// 更新当前日期
function updateCurrentDate() {
  const now = new Date()
  currentDate.value = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// 计算倒计时
function calculateCountdown() {
  const now = new Date()
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0)
  const timeLeft = endOfDay.getTime() - now.getTime()

  const hours = Math.floor(timeLeft / (1000 * 60 * 60))
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000)

  countdown.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

// 启动倒计时
function startCountdown() {
  calculateCountdown()
  countdownInterval = setInterval(calculateCountdown, 1000) as unknown as number
}

// 停止倒计时
function stopCountdown() {
  if (countdownInterval) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
}

// 加载签到状态
async function loadSignInStatus() {
  const userId = getUserId()
  if (!userId) {
    uni.redirectTo({
      url: '/pages/init/index',
    })
    return
  }

  try {
    // 获取签到状态
    const signInResult = await api.signIn.getSignInStatus(userId)
    signInStatus.value = signInResult

    // 从用户信息API获取真实用户名
    const userResult = await api.user.getUserInfo(userId)
    userName.value = userResult.name
  }
  catch (error) {
    console.error('获取签到状态失败:', error)
    uni.showToast({
      title: '获取签到状态失败',
      icon: 'none',
    })
  }
}

// 加载联系人列表
async function loadContacts() {
  const userId = getUserId()
  if (!userId)
    return

  try {
    const result = await api.contact.getContacts(userId)
    contacts.value = result
  }
  catch (error) {
    console.error('获取联系人列表失败:', error)
    uni.showToast({
      title: '获取联系人列表失败',
      icon: 'none',
    })
  }
}

// 执行签到
async function handleSignIn() {
  if (!signInStatus.value || signInStatus.value.todaySignedIn)
    return

  const userId = getUserId()
  if (!userId)
    return

  loading.value = true
  try {
    await api.signIn.signIn(userId)

    // 显示成功动画和提示
    signInSuccess.value = true

    // 重新加载签到状态
    await loadSignInStatus()

    // 重置成功状态
    setTimeout(() => {
      signInSuccess.value = false
    }, 1500)

    // 显示成功提示
    uni.showToast({
      title: '签到成功！',
      icon: 'success',
    })
  }
  catch (error: any) {
    console.error('签到失败:', error)
    // 根据错误类型显示不同的提示
    let errorMessage = '签到失败，请重试'
    if (error.message && error.message.includes('Already signed in today')) {
      // 已签到的情况，更新状态并提示
      await loadSignInStatus()
      errorMessage = '今日已签到！'
    }
    else if (error.message) {
      errorMessage = error.message
    }

    uni.showToast({
      title: errorMessage,
      icon: 'none',
    })
  }
  finally {
    loading.value = false
  }
}

// 编辑联系人
function editContacts() {
  uni.navigateTo({
    url: '/pages/contacts/index',
  })
}

// 退出登录
function logout() {
  // 清除localStorage中的用户ID
  uni.removeStorageSync('userId')

  // 跳转到登录首页
  uni.redirectTo({
    url: '/pages/init/index',
  })
}

// 页面挂载时初始化
onMounted(() => {
  updateCurrentDate()
  startCountdown()
  loadSignInStatus()
  loadContacts()
})

// 页面卸载前清理
onBeforeUnmount(() => {
  if (countdownInterval !== null) {
    clearInterval(countdownInterval)
    countdownInterval = null
  }
})
</script>

<style scoped>
/* 页面特定样式 */
.card h2 {
  margin-bottom: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 退出登录按钮样式优化 */
.btn[style*='background: #f5a623'] {
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.btn[style*='background: #f5a623']:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(245, 166, 35, 0.3);
  background: #f7b955 !important;
}

.btn[style*='background: #f5a623']:active {
  transform: translateY(0);
}
</style>
