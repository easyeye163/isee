<template>
  <view class="family-tree-page">
    <u-navbar title="族谱信息录入" back-text="返回" />

    <view class="form-container">
      <u-form
        ref="formRef"
        :model="formData"
        label-position="top"
        :rules="rules"
      >
        <!-- 基础信息 -->
        <view class="form-section">
          <h3>基础信息</h3>

          <u-form-item label="{{ t('user.name') }}" prop="name" required>
            <u-input v-model="formData.name" placeholder="请输入姓名" />
          </u-form-item>

          <u-form-item label="{{ t('form.family_name') }}" prop="familyName" required>
            <u-input v-model="formData.familyName" placeholder="请输入姓氏" />
          </u-form-item>

          <u-form-item label="{{ t('form.generation') }}" prop="generation">
            <u-input v-model="formData.generation" placeholder="请输入字辈" />
          </u-form-item>

          <u-form-item label="{{ t('user.gender') }}" prop="gender" required>
            <u-radio-group v-model="formData.gender" direction="row">
              <u-radio name="male">
                男
              </u-radio>
              <u-radio name="female">
                女
              </u-radio>
            </u-radio-group>
          </u-form-item>

          <u-form-item label="{{ t('form.birth_date') }}" prop="birthDate" required>
            <u-datetime-picker
              v-model="formData.birthDate"
              mode="date"
              placeholder="请选择出生日期"
              :start-year="1900"
              :end-year="2100"
            />
          </u-form-item>

          <u-form-item label="{{ t('form.birth_place') }}" prop="birthPlace">
            <u-input v-model="formData.birthPlace" placeholder="请输入出生地" />
          </u-form-item>
        </view>

        <!-- 婚姻信息 -->
        <view class="form-section">
          <h3>婚姻信息</h3>

          <u-form-item label="{{ t('form.marriage_status') }}" prop="marriageStatus">
            <u-radio-group v-model="formData.marriageStatus" direction="row">
              <u-radio name="single">
                {{ t('form.marriage_status_single') }}
              </u-radio>
              <u-radio name="married">
                {{ t('form.marriage_status_married') }}
              </u-radio>
              <u-radio name="divorced">
                离异
              </u-radio>
              <u-radio name="widowed">
                丧偶
              </u-radio>
            </u-radio-group>
          </u-form-item>

          <u-form-item v-if="formData.marriageStatus === 'married'" label="{{ t('form.spouse_name') }}" prop="spouseName">
            <u-input v-model="formData.spouseName" placeholder="请输入配偶姓名" />
          </u-form-item>
        </view>

        <!-- 家庭关系 -->
        <view class="form-section">
          <h3>家庭关系</h3>

          <u-form-item label="父亲姓名" prop="fatherName">
            <u-input v-model="formData.fatherName" placeholder="请输入父亲姓名" />
          </u-form-item>

          <u-form-item label="母亲姓名" prop="motherName">
            <u-input v-model="formData.motherName" placeholder="请输入母亲姓名" />
          </u-form-item>

          <u-form-item label="子女数量" prop="childrenCount">
            <u-input
              v-model.number="formData.childrenCount"
              type="number"
              placeholder="请输入子女数量"
              :min="0"
            />
          </u-form-item>
        </view>

        <!-- 其他信息 -->
        <view class="form-section">
          <h3>其他信息</h3>

          <u-form-item label="生平简介" prop="biography">
            <u-input
              v-model="formData.biography"
              type="textarea"
              placeholder="请输入生平简介"
              :rows="4"
            />
          </u-form-item>

          <u-form-item label="照片上传">
            <u-upload
              :file-list="fileList"
              name="avatar"
              multiple
              max-count="5"
              @after-read="onAfterRead"
              @delete="onDelete"
            />
          </u-form-item>
        </view>

        <!-- 操作按钮 -->
        <view class="form-buttons">
          <u-button type="primary" @click="onSubmit">
            {{ t('common.submit') }}
          </u-button>
          <u-button @click="onReset">
            {{ t('common.reset') }}
          </u-button>
          <u-button type="warning" @click="onScanImport">
            扫描导入
          </u-button>
        </view>
      </u-form>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { t } from '@/locale/index'

// 表单引用
const formRef = ref<any>(null)

// 表单数据
const formData = reactive({
  name: '',
  familyName: '',
  generation: '',
  gender: 'male',
  birthDate: '',
  birthPlace: '',
  marriageStatus: 'single',
  spouseName: '',
  fatherName: '',
  motherName: '',
  childrenCount: 0,
  biography: '',
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' },
  ],
  familyName: [
    { required: true, message: '请输入姓氏', trigger: 'blur' },
    { min: 1, max: 10, message: '姓氏长度在 1 到 10 个字符', trigger: 'blur' },
  ],
  gender: [
    { required: true, message: '请选择性别', trigger: 'change' },
  ],
  birthDate: [
    { required: true, message: '请选择出生日期', trigger: 'change' },
  ],
}

// 文件列表
const fileList = ref([])

// 文件上传
function onAfterRead(event: any) {
  const { file } = event
  file.status = 'uploading'
  file.message = '上传中...'

  // 模拟上传
  setTimeout(() => {
    file.status = 'done'
    file.message = ''
    file.url = file.path
  }, 1500)
}

// 删除文件
function onDelete(event: any) {
  const { index } = event
  fileList.value.splice(index, 1)
}

// 提交表单
function onSubmit() {
  formRef.value.validate().then(() => {
    uni.showLoading({
      title: '提交中...',
    })

    // 模拟提交
    setTimeout(() => {
      uni.hideLoading()
      uni.showToast({
        title: '提交成功',
        icon: 'success',
      })

      // 重置表单
      onReset()
    }, 1500)
  }).catch(() => {
    uni.showToast({
      title: '表单验证失败',
      icon: 'error',
    })
  })
}

// 重置表单
function onReset() {
  formRef.value.resetFields()
  fileList.value = []
}

// 扫描导入
function onScanImport() {
  uni.navigateTo({
    url: '/pages/family-tree/scan',
  })
}
</script>

<style scoped>
.family-tree-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.form-container {
  padding: 20rpx;
}

.form-section {
  background-color: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.form-section h3 {
  margin: 0 0 20rpx 0;
  font-size: 32rpx;
  color: #333;
  border-bottom: 2rpx solid #eee;
  padding-bottom: 10rpx;
}

.form-buttons {
  display: flex;
  gap: 20rpx;
  margin-top: 20rpx;
  padding: 20rpx;
  background-color: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.form-buttons u-button {
  flex: 1;
}
</style>
