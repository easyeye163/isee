<template>
  <view class="scan-page">
    <u-navbar title="纸质族谱扫描" back-text="返回" />

    <view class="scan-content">
      <!-- 扫描说明 -->
      <view class="scan-guide">
        <h3>扫描指南</h3>
        <ul>
          <li>请确保族谱页面平整，光线充足</li>
          <li>调整拍摄角度，确保完整捕捉页面内容</li>
          <li>支持批量上传，单次最多50页</li>
          <li>可手动调整识别区域，提高识别准确率</li>
        </ul>
      </view>

      <!-- 扫描模式选择 -->
      <view class="scan-mode">
        <h3>扫描模式</h3>
        <u-radio-group v-model="scanMode" direction="row">
          <u-radio name="camera">
            拍照
          </u-radio>
          <u-radio name="album">
            相册选择
          </u-radio>
        </u-radio-group>
      </view>

      <!-- 识别类型选择 -->
      <view class="recognition-type">
        <h3>识别类型</h3>
        <u-radio-group v-model="recognitionType" direction="row">
          <u-radio name="genealogy">
            纸质族谱
          </u-radio>
          <u-radio name="tombstone">
            墓碑照片
          </u-radio>
        </u-radio-group>
      </view>

      <!-- 识别区域调整 -->
      <view class="crop-section">
        <h3>识别区域调整</h3>
        <view v-if="selectedImage" class="crop-container">
          <image
            :src="selectedImage"
            alt="族谱图片"
            class="crop-image"
            mode="aspectFit"
          />
          <!-- 裁剪框 -->
          <view
            class="crop-box"
            :style="{
              left: `${cropArea.x}px`,
              top: `${cropArea.y}px`,
              width: `${cropArea.width}px`,
              height: `${cropArea.height}px`,
            }"
          >
            <view class="crop-handle top-left" />
            <view class="crop-handle top-right" />
            <view class="crop-handle bottom-left" />
            <view class="crop-handle bottom-right" />
          </view>
        </view>
        <u-button
          v-else
          type="default"
          plain
          class="placeholder-btn"
        >
          选择或拍摄图片后显示识别区域
        </u-button>
      </view>

      <!-- 批量上传列表 -->
      <view class="batch-upload">
        <h3>上传列表 ({{ uploadList.length }}/50)</h3>
        <u-upload
          :file-list="uploadList"
          :max-count="50"
          :max-size="10 * 1024 * 1024"
          multiple
          name="genealogy"
          @after-read="onAfterRead"
          @delete="onDelete"
          @preview="onPreview"
        />
      </view>

      <!-- 操作按钮 -->
      <view class="action-buttons">
        <u-button
          type="primary"
          size="large"
          :disabled="uploadList.length === 0"
          @click="onStartScan"
        >
          开始扫描识别
        </u-button>
        <u-button
          type="default"
          size="large"
          :disabled="uploadList.length === 0"
          @click="onClearAll"
        >
          清空列表
        </u-button>
      </view>

      <!-- 扫描进度 -->
      <view v-if="showProgress" class="scan-progress">
        <h3>扫描进度</h3>
        <u-line-progress
          :percent="scanProgress"
          :show-text="true"
          active-color="#07c160"
        />
        <view class="progress-text">
          正在处理第 {{ currentPage }}/{{ totalPages }} 页
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

// 扫描模式
const scanMode = ref('camera')
// 识别类型
const recognitionType = ref('genealogy')
// 选择的图片
const selectedImage = ref('')
// 上传列表
const uploadList = ref([])
// 识别区域
const cropArea = reactive({
  x: 50,
  y: 50,
  width: 300,
  height: 400,
})
// 扫描进度
const showProgress = ref(false)
const scanProgress = ref(0)
const currentPage = ref(0)
const totalPages = ref(0)

// 图片上传后
function onAfterRead(event: any) {
  const { file, files } = event
  if (files) {
    // 批量上传
    uploadList.value = [...uploadList.value, ...files]
  }
  else {
    // 单张上传
    uploadList.value.push(file)
  }
  // 显示第一张图片的识别区域
  if (uploadList.value.length > 0 && !selectedImage.value) {
    selectedImage.value = uploadList.value[0].url
  }
}

// 删除图片
function onDelete(event: any) {
  const { index } = event
  uploadList.value.splice(index, 1)
  // 如果删除的是当前显示的图片，切换到第一张
  if (index === 0 && uploadList.value.length > 0) {
    selectedImage.value = uploadList.value[0].url
  }
  else if (uploadList.value.length === 0) {
    selectedImage.value = ''
  }
}

// 预览图片
function onPreview(event: any) {
  const { index } = event
  selectedImage.value = uploadList.value[index].url
}

// 开始扫描识别
function onStartScan() {
  if (uploadList.value.length === 0) {
    uni.showToast({
      title: '请先选择图片',
      icon: 'error',
    })
    return
  }

  // 显示扫描进度
  showProgress.value = true
  scanProgress.value = 0
  currentPage.value = 0
  totalPages.value = uploadList.value.length

  // 模拟扫描过程
  const scanInterval = setInterval(() => {
    currentPage.value++
    scanProgress.value = Math.round((currentPage.value / totalPages.value) * 100)

    if (currentPage.value >= totalPages.value) {
      clearInterval(scanInterval)

      // 扫描完成
      setTimeout(() => {
        showProgress.value = false
        uni.showToast({
          title: '扫描完成！',
          icon: 'success',
        })

        // 跳转到识别结果页面
        uni.navigateTo({
          url: `/pages/family-tree/ocr-result?type=${recognitionType.value}`,
        })
      }, 1000)
    }
  }, 500) // 模拟每页扫描时间500ms，实际项目中应根据真实扫描时间调整
}

// 清空列表
function onClearAll() {
  uni.showModal({
    title: '提示',
    content: '确定要清空所有上传的图片吗？',
    success: (res) => {
      if (res.confirm) {
        uploadList.value = []
        selectedImage.value = ''
      }
    },
  })
}
</script>

<style scoped>
.scan-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.scan-content {
  padding: 20rpx;
}

.scan-guide,
.scan-mode,
.crop-section,
.batch-upload,
.scan-progress {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

h3 {
  margin: 0 0 20rpx 0;
  font-size: 32rpx;
  color: #333;
}

ul {
  margin: 0;
  padding-left: 20rpx;
}

li {
  margin-bottom: 10rpx;
  font-size: 28rpx;
  color: #666;
}

.scan-mode u-radio {
  margin-right: 40rpx;
}

.crop-container {
  position: relative;
  width: 100%;
  height: 400rpx;
  border: 2rpx dashed #ddd;
  border-radius: 10rpx;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.crop-image {
  width: 100%;
  height: 100%;
}

.crop-box {
  position: absolute;
  border: 2rpx solid #07c160;
  box-sizing: border-box;
  pointer-events: none;
}

.crop-handle {
  position: absolute;
  width: 20rpx;
  height: 20rpx;
  background-color: #07c160;
  border-radius: 50%;
  pointer-events: auto;
}

.top-left {
  left: -10rpx;
  top: -10rpx;
}

.top-right {
  right: -10rpx;
  top: -10rpx;
}

.bottom-left {
  left: -10rpx;
  bottom: -10rpx;
}

.bottom-right {
  right: -10rpx;
  bottom: -10rpx;
}

.placeholder-btn {
  width: 100%;
}

.action-buttons {
  display: flex;
  gap: 20rpx;
  margin-top: 20rpx;
}

.action-buttons u-button {
  flex: 1;
}

.progress-text {
  text-align: center;
  margin-top: 10rpx;
  font-size: 28rpx;
  color: #666;
}
</style>
