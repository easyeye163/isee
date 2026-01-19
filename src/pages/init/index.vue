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

    <div class="card">
      <h1>欢迎使用</h1>
      <p style="text-align: center; color: var(--text-light); margin-bottom: 30px;">
        只需简单设置，即可获得安心保障
      </p>

      <div class="steps">
        <div class="step active">
          <div class="step-number">
            1
          </div>
          <div style="font-size: 0.8rem;">
            基本信息
          </div>
        </div>
        <div class="step">
          <div class="step-number">
            2
          </div>
          <div style="font-size: 0.8rem;">
            联系人
          </div>
        </div>
        <div class="step">
          <div class="step-number">
            3
          </div>
          <div style="font-size: 0.8rem;">
            完成
          </div>
        </div>
      </div>

      <!-- 切换注册/登录模式 -->
      <div class="auth-tabs">
        <button
          class="auth-tab"
          :class="{ active: isRegister }"
          @click="isRegister = true"
        >
          注册
        </button>
        <button
          class="auth-tab"
          :class="{ active: !isRegister }"
          @click="isRegister = false"
        >
          登录
        </button>
      </div>

      <!-- 登录/注册表单 -->
      <div class="form-group">
        <label for="name">手机号</label>
        <input
          id="name"
          v-model="user.name"
          type="tel"
          placeholder="请输入您的手机号"
          required
          class="custom-input"
        >
      </div>

      <!-- 姓名输入框，仅在注册模式显示 -->
      <div v-if="isRegister" class="form-group">
        <label for="realName">您的姓名</label>
        <input
          id="realName"
          v-model="user.realName"
          type="text"
          placeholder="请输入您的真实姓名"
          required
          class="custom-input"
        >
      </div>

      <div class="form-group">
        <label for="password">密码</label>
        <input
          id="password"
          v-model="user.password"
          type="password"
          placeholder="请输入密码"
          required
          minlength="6"
          class="custom-input"
        >
      </div>

      <!-- 记住我选项 -->
      <!-- <div class="remember-me">
        <input
          type="checkbox"
          id="rememberMe"
          v-model="rememberMe"
        >
        <label for="rememberMe">记住我</label>
      </div> -->

      <!-- 登录/注册按钮 -->
      <button type="button" :disabled="loading" class="auth-button" @click="handleSubmit">
        {{ loading ? (isRegister ? '正在注册...' : '正在登录...') : (isRegister ? '下一步' : '登录') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

// 导入真实 API
import api from '@/utils/api'

// 页面配置
definePage({
  type: 'home',
  style: {
    navigationBarTitleText: '欢迎使用',
  },
})

const loading = ref(false)
const isRegister = ref(true) // true: 注册模式, false: 登录模式
const rememberMe = ref(true) // 是否记住我，默认记住用户登录状态
const user = ref({
  name: '', // 登录时：手机号/用户名；注册时：手机号
  realName: '', // 注册时：真实姓名
  password: '',
})

async function handleSubmit() {
  console.log('handleSubmit called, isRegister:', isRegister.value)

  // 验证手机号和密码
  if (!user.value.name.trim() || !user.value.password.trim()) {
    uni.showToast({
      title: '请输入手机号和密码',
      icon: 'none',
    })
    return
  }

  // 注册模式下验证真实姓名
  if (isRegister.value && !user.value.realName.trim()) {
    uni.showToast({
      title: '请输入真实姓名',
      icon: 'none',
    })
    return
  }

  loading.value = true
  try {
    let result

    if (isRegister.value) {
      // 注册模式：使用realName作为用户名，name作为手机号
      result = await api.user.register(user.value.realName, user.value.name, user.value.password)
    }
    else {
      // 登录模式：直接使用name作为登录凭证（支持手机号或用户名）
      result = await api.user.login(user.value.name, user.value.password)
    }

    // 保存用户ID到存储
    if (rememberMe.value) {
      // 30天免登录，使用localStorage
      uni.setStorageSync('userId', result.id)
    }
    else {
      // 会话登录，使用sessionStorage
      uni.setStorageSync('userId', result.id)
    }

    // 登录成功后，检查用户是否已有联系人
    const contactsResult = await api.contact.getContacts(result.id)
    if (contactsResult && contactsResult.length > 0) {
      // 已有联系人，跳转到主页面（签到界面）
      uni.redirectTo({
        url: '/pages/main/index',
      })
    }
    else {
      // 没有联系人，跳转到联系人页面
      uni.redirectTo({
        url: '/pages/contacts/index',
      })
    }
  }
  catch (error: any) {
    console.error(isRegister.value ? '注册失败:' : '登录失败:', error)

    // 根据错误类型显示不同提示
    let errorMessage = isRegister.value ? '注册失败，请重试' : '登录失败，请检查手机号和密码'
    if (error.message && error.message.includes('409')) {
      errorMessage = '手机号已被注册'
    }

    uni.showToast({
      title: error.message || errorMessage,
      icon: 'none',
    })
  }
  finally {
    loading.value = false
  }
}

// 页面挂载时检查登录状态
onMounted(() => {
  console.log('init/index onMounted - checking login status')

  // 检查用户是否已登录
  const userId = uni.getStorageSync('userId')
  if (userId) {
    console.log('用户已登录，跳转到签到页面')
    // 检查用户是否已有联系人
    api.contact.getContacts(userId).then((contactsResult) => {
      if (contactsResult && contactsResult.length > 0) {
        // 已有联系人，跳转到主页面（签到界面）
        uni.redirectTo({
          url: '/pages/main/index',
        })
      }
      else {
        // 没有联系人，跳转到联系人页面
        uni.redirectTo({
          url: '/pages/contacts/index',
        })
      }
    }).catch((error) => {
      console.error('获取联系人失败:', error)
      // 发生错误时，默认跳转到签到页面
      uni.redirectTo({
        url: '/pages/main/index',
      })
    })
  }
})
</script>

<style scoped>
/* 登录/注册切换标签样式 */
.auth-tabs {
  display: flex;
  margin-bottom: 20px;
  border-radius: 12px;
  background-color: var(--background-color);
  overflow: hidden;
}

.auth-tab {
  flex: 1;
  /* padding: 12px; */
  background: transparent;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--text-light);
}

.auth-tab.active {
  background-color: var(--primary-color);
  color: white;
}

/* 表单样式 */
.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: var(--text-color);
}

.custom-input {
  width: 100%;
  padding: 18px 14px;
  border: 2px solid var(--border-color);
  border-radius: 12px;
  font-size: 1rem;
  background: var(--card-background);
  color: var(--text-color);
  transition: var(--transition);
}

.custom-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

/* 记住我选项样式 */
.remember-me {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  margin: 15px 0;
  font-size: 0.9rem;
  color: var(--text-color);
  white-space: nowrap;
  width: 100%;
}

.remember-me input[type='checkbox'] {
  width: auto;
  margin-right: 10px;
  cursor: pointer;
  flex-shrink: 0;
  height: auto;
  padding: 0;
  margin-left: 0;
  border-width: 2px;
  border-color: var(--border-color);
}

.remember-me label {
  width: auto;
  cursor: pointer;
  user-select: none;
  flex-shrink: 0;
  margin: 0;
  display: inline-block;
  padding: 0;
  text-align: left;
}

/* 登录/注册按钮样式 */
.auth-button {
  width: 100%;
  padding: 18px 14px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  background: var(--primary-color);
  color: white;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow);
  min-height: 56px;
  line-height: normal;
}

.auth-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 25px rgba(74, 144, 226, 0.3);
}

.auth-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
