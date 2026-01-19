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
      <h1>紧急联系人</h1>
      <p style="text-align: center; color: var(--text-light); margin-bottom: 30px;">
        添加 1-3 位紧急联系人邮箱
      </p>

      <div class="steps">
        <div class="step completed">
          <div class="step-number">
            1
          </div>
          <div style="font-size: 0.8rem;">
            基本信息
          </div>
        </div>
        <div class="step active">
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

      <!-- 联系人列表 -->
      <div v-if="contacts.length > 0" class="contact-list">
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
          <div class="contact-actions">
            <button
              type="button btn-primary"
              class="edit-contact"
              style="background-color:var(--primary-color); color:white; cursor: pointer; "
              @click="editContact(contact)"
            >
              编辑
            </button>
            <button
              type="button"
              class="remove-contact"
              style="background-color:coral; cursor: pointer;"
              @click="removeContact(contact.id)"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <!-- 编辑联系人表单 -->
      <div v-if="editingContact.id" class="card" style="margin-top: 20px;">
        <h3>编辑联系人</h3>
        <div class="form-group">
          <!-- <label for="editContactType">联系人类型</label>
          <picker
            v-model="editingContact.type"
            :range="['家人', '朋友', '同事', '其他']"
            class="custom-input"
            style="padding: 10px; border: 1px solid var(--border-color); border-radius: 5px;"
          >
            <view class="picker-display">
              {{ editingContact.type }}
            </view>
          </picker> -->
        </div>

        <div class="form-group">
          <label for="editContactName">联系人姓名</label>
          <input
            id="editContactName"
            v-model="editingContact.name"
            type="text"
            placeholder="请输入联系人姓名"
            required
            class="custom-input"
          >
        </div>

        <div class="form-group">
          <label for="editContactEmail">联系人邮箱</label>
          <input
            id="editContactEmail"
            v-model="editingContact.email"
            type="email"
            placeholder="请输入联系人邮箱"
            required
            class="custom-input"
          >
        </div>

        <div class="form-group">
          <label for="editContactPhone">联系人手机（可选）</label>
          <input
            id="editContactPhone"
            v-model="editingContact.phone"
            type="tel"
            placeholder="请输入联系人手机号码"
            class="custom-input"
          >
        </div>

        <div style="display: flex; gap: 10px;">
          <button
            type="button"
            class="btn custom-button"
            style="flex: 1; background: var(--background-color); color: var(--text-color);"
            @click="cancelEdit"
          >
            取消
          </button>
          <button
            type="button"
            class="btn btn-primary custom-button"
            style="flex: 1;"
            :disabled="!canSaveContact || loading"
            @click="saveContact"
          >
            {{ loading ? '正在保存...' : '保存修改' }}
          </button>
        </div>
      </div>

      <!-- 添加联系人表单 -->
      <div v-else class="card" style="margin-top: 20px;">
        <h3>添加新联系人</h3>
        <div class="form-group">
          <label for="contactType">联系人类型</label>
          <picker
            v-model="newContact.type"
            :range="['家人', '朋友', '同事', '其他']"
            class="custom-input"
            style="padding: 10px; border: 1px solid var(--border-color); border-radius: 5px;"
          >
            <view class="picker-display">
              {{ newContact.type }}
            </view>
          </picker>
        </div>

        <div class="form-group">
          <label for="contactName">联系人姓名</label>
          <input
            id="contactName"
            v-model="newContact.name"
            type="text"
            placeholder="请输入联系人姓名"
            required
            class="custom-input"
          >
        </div>

        <div class="form-group">
          <label for="contactEmail">联系人邮箱</label>
          <input
            id="contactEmail"
            v-model="newContact.email"
            type="email"
            placeholder="请输入联系人邮箱"
            required
            class="custom-input"
          >
        </div>

        <div class="form-group">
          <label for="contactPhone">联系人手机（可选）</label>
          <input
            id="contactPhone"
            v-model="newContact.phone"
            type="tel"
            placeholder="请输入联系人手机号码"
            class="custom-input"
          >
        </div>

        <button
          type="button"
          class="btn btn-primary custom-button"
          :disabled="contacts.length >= 3 || !canAddContact || loading"
          @click="addContact"
        >
          {{ loading ? '正在添加...' : '添加联系人' }}
        </button>
      </div>

      <!-- 操作按钮 -->
      <div style="margin-top: 30px; display: flex; gap: 10px;">
        <button type="button" class="btn" style="flex: 1; background: var(--background-color); color: var(--text-color);" @click="goBack">
          上一步
        </button>
        <button
          type="button"
          class="btn btn-primary"
          style="flex: 2;"
          :disabled="contacts.length < 1"
          @click="completeSetup"
        >
          完成设置
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

// 导入真实 API
import api from '@/utils/api'

const loading = ref(false)
const contacts = ref<any[]>([])
const newContact = ref({
  type: '家人',
  name: '',
  email: '',
  phone: '',
})
const editingContact = ref({
  id: '',
  type: '家人',
  name: '',
  email: '',
  phone: '',
})

// 计算是否可以添加联系人
const canAddContact = computed(() => {
  return newContact.value.type && newContact.value.name && newContact.value.email
})

// 计算是否可以保存联系人
const canSaveContact = computed(() => {
  return editingContact.value.type && editingContact.value.name && editingContact.value.email
})

// 获取用户ID
function getUserId() {
  return uni.getStorageSync('userId')
}

// 加载联系人列表
async function loadContacts() {
  const userId = getUserId()
  if (!userId) {
    uni.redirectTo({
      url: '/pages/init/index',
    })
    return
  }

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

// 添加联系人
async function addContact() {
  if (!canAddContact.value || contacts.value.length >= 3)
    return

  const userId = getUserId()
  if (!userId)
    return

  loading.value = true
  try {
    const result = await api.contact.addContact(
      userId,
      newContact.value.type,
      newContact.value.name,
      newContact.value.email,
      newContact.value.phone,
    )

    // 添加到联系人列表
    contacts.value.push(result)

    // 重置表单
    newContact.value = {
      type: '家人',
      name: '',
      email: '',
      phone: '',
    }

    uni.showToast({
      title: '联系人添加成功',
      icon: 'success',
    })
  }
  catch (error) {
    console.error('添加联系人失败:', error)
    uni.showToast({
      title: '添加联系人失败，请重试',
      icon: 'none',
    })
  }
  finally {
    loading.value = false
  }
}

// 编辑联系人
function editContact(contact: any) {
  editingContact.value = {
    id: contact.id,
    type: contact.type,
    name: contact.name,
    email: contact.email,
    phone: contact.phone || '',
  }
}

// 取消编辑
function cancelEdit() {
  editingContact.value = {
    id: '',
    type: '家人',
    name: '',
    email: '',
    phone: '',
  }
}

// 保存联系人修改
async function saveContact() {
  if (!canSaveContact.value)
    return

  loading.value = true
  try {
    const result = await api.contact.updateContact(
      editingContact.value.id,
      editingContact.value.type,
      editingContact.value.name,
      editingContact.value.email,
      editingContact.value.phone,
    )

    // 更新联系人列表
    const index = contacts.value.findIndex(contact => contact.id === editingContact.value.id)
    if (index !== -1) {
      contacts.value[index] = result
    }

    // 重置编辑表单
    cancelEdit()

    uni.showToast({
      title: '联系人更新成功',
      icon: 'success',
    })
  }
  catch (error) {
    console.error('更新联系人失败:', error)
    uni.showToast({
      title: '更新联系人失败，请重试',
      icon: 'none',
    })
  }
  finally {
    loading.value = false
  }
}

// 删除联系人
async function removeContact(contactId: string) {
  // 如果正在编辑该联系人，先取消编辑
  if (editingContact.value.id === contactId) {
    cancelEdit()
  }

  try {
    await api.contact.deleteContact(contactId)
    // 从列表中移除
    contacts.value = contacts.value.filter(contact => contact.id !== contactId)

    uni.showToast({
      title: '联系人删除成功',
      icon: 'success',
    })
  }
  catch (error) {
    console.error('删除联系人失败:', error)
    uni.showToast({
      title: '删除联系人失败，请重试',
      icon: 'none',
    })
  }
}

// 返回上一步
function goBack() {
  uni.navigateBack()
}

// 完成设置
function completeSetup() {
  if (contacts.value.length < 1)
    return

  // 跳转到主页面
  uni.redirectTo({
    url: '/pages/main/index',
  })
}

// 页面加载时获取联系人列表
onMounted(() => {
  loadContacts()
})
</script>

<style scoped>
/* 页面特定样式 */

/* 自定义输入框样式 - 应用于原生 input 元素 */
.custom-input {
  position: relative;
  z-index: 999 !important;
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  background: var(--card-background);
  color: var(--text-color);
  transition: var(--transition);
  margin-bottom: 20px;
}

/* 输入框聚焦样式 */
.custom-input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
}

/* 本地 uni-input 样式已被全局样式覆盖，此处保留以确保兼容性 */

/* 自定义按钮样式 */
.custom-button {
  position: relative;
  z-index: 1000 !important;
  width: 100%;
  padding: 18px 14px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: var(--shadow);
  min-height: 56px;
  line-height: normal;
  display: inline-block;
  pointer-events: auto;
  user-select: none;
  outline: none;
}
</style>
