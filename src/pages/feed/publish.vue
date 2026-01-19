<template>
  <!-- 动态发布页面 -->
  <view class="publish-page">
    <!-- 顶部导航栏 -->
    <u-navbar title="发布动态" back-text="返回" />

    <view class="publish-container">
      <!-- 发布表单 -->
      <u-form
        ref="formRef"
        :model="publishForm"
        label-position="top"
        :rules="formRules"
      >
        <!-- 动态内容输入 -->
        <u-form-item label="动态内容" prop="content">
          <u-input
            v-model="publishForm.content"
            type="textarea"
            :rows="6"
            placeholder="分享你的宗族动态..."
            maxlength="500"
            show-word-limit
          />
        </u-form-item>

        <!-- 图片上传组件 -->
        <u-form-item label="图片">
          <u-upload
            :file-list="imageList"
            name="images"
            multiple
            :max-count="9"
            :max-size="10 * 1024 * 1024"
            @after-read="handleImageUpload"
            @delete="handleImageDelete"
            @preview="handleImagePreview"
          />
        </u-form-item>

        <!-- 视频上传组件 -->
        <u-form-item label="视频">
          <u-upload
            :file-list="videoList"
            name="video"
            multiple
            :max-count="1"
            :max-size="100 * 1024 * 1024"
            accept="video"
            @after-read="handleVideoUpload"
            @delete="handleVideoDelete"
            @preview="handleVideoPreview"
          />
        </u-form-item>

        <!-- 动态类型选择 -->
        <u-form-item label="动态类型" prop="type">
          <u-radio-group v-model="publishForm.type" direction="row">
            <u-radio name="normal">
              普通动态
            </u-radio>
            <u-radio name="event">
              宗族活动
            </u-radio>
            <u-radio name="news">
              宗族新闻
            </u-radio>
            <u-radio name="achievement">
              个人成就
            </u-radio>
          </u-radio-group>
        </u-form-item>

        <!-- 可见范围选择 -->
        <u-form-item label="可见范围" prop="visibility">
          <u-radio-group v-model="publishForm.visibility" direction="row">
            <u-radio name="public">
              公开
            </u-radio>
            <u-radio name="clan">
              仅宗族可见
            </u-radio>
            <u-radio name="friends">
              仅好友可见
            </u-radio>
            <u-radio name="private">
              仅自己可见
            </u-radio>
          </u-radio-group>
        </u-form-item>

        <!-- 操作按钮组 -->
        <view class="form-buttons">
          <u-button
            type="primary"
            size="large"
            :loading="isPublishing"
            :disabled="isPublishing"
            @click="publishDynamic"
          >
            {{ isPublishing ? '发布中...' : '发布' }}
          </u-button>
          <u-button
            :disabled="isPublishing"
            @click="cancelPublish"
          >
            取消
          </u-button>
        </view>
      </u-form>

      <!-- 发布进度条 -->
      <view v-if="showProgress" class="publish-progress">
        <u-line-progress
          :percent="publishProgress"
          :show-text="true"
          active-color="#07c160"
        />
        <view class="progress-text">
          正在发布动态...
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

/**
 * 发布表单数据
 */
const publishForm = reactive({
  content: '', // 动态内容
  type: 'normal', // 动态类型：normal普通动态, event宗族活动, news宗族新闻, achievement个人成就
  visibility: 'public', // 可见范围：public公开, clan仅宗族可见, friends仅好友可见, private仅自己可见
})

/**
 * 表单引用
 */
const formRef = ref<any>(null)

/**
 * 表单验证规则
 */
const formRules = {
  content: [
    {
      required: true,
      message: '请输入动态内容',
      trigger: ['change', 'blur'],
    },
    {
      min: 1,
      max: 500,
      message: '动态内容长度在1-500个字符',
      trigger: ['change', 'blur'],
    },
  ],
}

/**
 * 媒体文件管理
 */
const imageList = ref<any[]>([]) // 上传的图片列表
const videoList = ref<any[]>([]) // 上传的视频列表

/**
 * 发布状态管理
 */
const isPublishing = ref(false) // 是否正在发布
const showProgress = ref(false) // 是否显示发布进度
const publishProgress = ref(0) // 发布进度百分比

/**
 * 图片上传事件处理
 */
function handleImageUpload(event: any) {
  const { file } = event
  file.status = 'uploading'
  file.message = '上传中...'

  // 模拟图片上传过程
  setTimeout(() => {
    file.status = 'done'
    file.message = ''
    imageList.value.push(file)
  }, 1500)
}

/**
 * 图片删除事件处理
 */
function handleImageDelete(event: any) {
  const { index } = event
  imageList.value.splice(index, 1)
}

/**
 * 图片预览事件处理
 */
function handleImagePreview(event: any) {
  const { index } = event
  const urls = imageList.value.map(file => file.url)
  // 调用系统图片预览
  uni.previewImage({
    urls,
    current: index,
  })
}

/**
 * 视频上传事件处理
 */
function handleVideoUpload(event: any) {
  const { file } = event
  file.status = 'uploading'
  file.message = '上传中...'

  // 模拟视频上传过程
  setTimeout(() => {
    file.status = 'done'
    file.message = ''
    videoList.value.push(file)
  }, 2500)
}

/**
 * 视频删除事件处理
 */
function handleVideoDelete(event: any) {
  const { index } = event
  videoList.value.splice(index, 1)
}

/**
 * 视频预览事件处理
 */
function handleVideoPreview(event: any) {
  const { file } = event
  // 调用系统媒体预览
  uni.previewMedia({
    sources: [{
      url: file.url,
      type: 'video',
    }],
  })
}

/**
 * 发布动态
 */
function publishDynamic() {
  // 表单验证
  formRef.value.validate().then(() => {
    // 设置发布状态
    isPublishing.value = true
    showProgress.value = true
    publishProgress.value = 0

    // 模拟发布进度更新
    const progressInterval = setInterval(() => {
      publishProgress.value += 10
      if (publishProgress.value >= 100) {
        clearInterval(progressInterval)

        // 发布完成
        setTimeout(() => {
          // 重置发布状态
          isPublishing.value = false
          showProgress.value = false

          // 显示发布成功提示
          uni.showToast({
            title: '动态发布成功！',
            icon: 'success',
            duration: 2000,
          })

          // 跳转到动态列表页
          setTimeout(() => {
            uni.navigateTo({
              url: '/pages/feed/list',
            })
          }, 1000)
        }, 500)
      }
    }, 300)
  }).catch(() => {
    // 表单验证失败，显示错误提示
    uni.showToast({
      title: '请输入动态内容',
      icon: 'error',
      duration: 2000,
    })
  })
}

/**
 * 取消发布
 */
function cancelPublish() {
  // 调用系统确认对话框
  uni.showModal({
    title: '确认取消',
    content: '确定要取消发布吗？',
    success: (res) => {
      if (res.confirm) {
        // 关闭当前页面
        uni.navigateBack()
      }
    },
  })
}
</script>

<style scoped>
/* 页面容器样式 */
.publish-page {
  min-height: 100vh;
  background-color: #f2f2f7; /* iOS系统背景色 */
}

/* 内容容器样式 */
.publish-container {
  padding: 20rpx;
}

/* 表单按钮组样式 */
.form-buttons {
  display: flex;
  gap: 20rpx;
  margin-top: 20rpx;
}

/* 按钮样式 */
.form-buttons u-button {
  flex: 1;
}

/* 发布进度容器样式 */
.publish-progress {
  margin-top: 20rpx;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

/* 进度文本样式 */
.progress-text {
  margin-top: 10rpx;
  text-align: center;
  color: #666;
  font-size: 28rpx;
}
</style>
