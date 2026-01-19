<template>
  <view class="ocr-result-page">
    <u-navbar title="OCR识别结果" back-text="返回" />

    <view class="ocr-result-content">
      <!-- 识别结果统计 -->
      <view class="result-stats">
        <h3>识别结果统计</h3>
        <view class="stats-container">
          <view class="stat-item">
            <text class="stat-value">{{ totalPages }}</text>
            <text class="stat-label">总页数</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ successPages }}</text>
            <text class="stat-label">成功识别</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ errorPages }}</text>
            <text class="stat-label">识别失败</text>
          </view>
          <view class="stat-item">
            <text class="stat-value">{{ accuracy }}%</text>
            <text class="stat-label">识别准确率</text>
          </view>
        </view>
      </view>

      <!-- 识别结果列表 -->
      <view class="result-list">
        <h3>识别结果</h3>
        <u-tabs v-model="activeTab" :list="tabList" @change="onTabChange" />

        <!-- 识别结果详情 -->
        <u-collapse v-model="activeNames" accordion>
          <u-collapse-item
            v-for="(result) in displayResults"
            :key="result.id"
            :title="`第${result.pageNumber}页 - ${result.status === 'success' ? '识别成功' : '识别失败'}`"
            :name="result.id"
          >
            <view class="result-detail">
              <view class="result-image">
                <image :src="result.imageUrl" alt="族谱页面" mode="aspectFit" />
              </view>

              <view class="result-data">
                <u-form
                  ref="formRefs[index]"
                  :model="result.data"
                  label-position="top"
                >
                  <!-- 核心身份信息 -->
                  <view class="form-section">
                    <h4>核心身份信息</h4>

                    <u-form-item label="姓名" prop="name">
                      <u-input v-model="result.data.name" placeholder="请输入姓名" />
                    </u-form-item>

                    <u-form-item label="性别" prop="gender">
                      <u-radio-group v-model="result.data.gender" direction="row">
                        <u-radio name="male">
                          男
                        </u-radio>
                        <u-radio name="female">
                          女
                        </u-radio>
                      </u-radio-group>
                    </u-form-item>

                    <u-form-item label="出生日期" prop="birthDate">
                      <u-input v-model="result.data.birthDate" placeholder="请输入出生日期" />
                    </u-form-item>

                    <template v-if="recognitionType !== 'tombstone'">
                      <u-form-item label="出生时间" prop="birthTime">
                        <u-input v-model="result.data.birthTime" placeholder="请输入出生时间（如：辰时）" />
                      </u-form-item>
                    </template>

                    <u-form-item label="去世日期" prop="deathDate">
                      <u-input v-model="result.data.deathDate" placeholder="请输入去世日期" />
                    </u-form-item>

                    <template v-if="recognitionType !== 'tombstone'">
                      <u-form-item label="去世时间" prop="deathTime">
                        <u-input v-model="result.data.deathTime" placeholder="请输入去世时间（如：戌时）" />
                      </u-form-item>
                    </template>
                  </view>

                  <!-- 家庭关系 -->
                  <view class="form-section">
                    <h4>家庭关系</h4>

                    <u-form-item label="父亲姓名" prop="fatherName">
                      <u-input v-model="result.data.fatherName" placeholder="请输入父亲姓名" />
                    </u-form-item>

                    <template v-if="recognitionType !== 'tombstone'">
                      <u-form-item label="父亲字辈" prop="fatherGeneration">
                        <u-input v-model="result.data.fatherGeneration" placeholder="请输入父亲字辈" />
                      </u-form-item>
                    </template>

                    <u-form-item label="母亲姓名" prop="motherName">
                      <u-input v-model="result.data.motherName" placeholder="请输入母亲姓名" />
                    </u-form-item>

                    <template v-if="recognitionType !== 'tombstone'">
                      <u-form-item label="母亲字辈" prop="motherGeneration">
                        <u-input v-model="result.data.motherGeneration" placeholder="请输入母亲字辈" />
                      </u-form-item>
                    </template>

                    <u-form-item label="配偶姓名" prop="spouseName">
                      <u-input v-model="result.data.spouseName" placeholder="请输入配偶姓名" />
                    </u-form-item>

                    <template v-if="recognitionType !== 'tombstone'">
                      <u-form-item label="配偶字辈" prop="spouseGeneration">
                        <u-input v-model="result.data.spouseGeneration" placeholder="请输入配偶字辈" />
                      </u-form-item>
                    </template>

                    <u-form-item label="子女" prop="children">
                      <u-input v-model="result.data.children" placeholder="请输入子女姓名，用逗号分隔" />
                    </u-form-item>

                    <template v-if="recognitionType !== 'tombstone'">
                      <u-form-item label="子女字辈" prop="childrenGenerations">
                        <u-input v-model="result.data.childrenGenerations" placeholder="请输入子女字辈，用逗号分隔" />
                      </u-form-item>
                    </template>
                  </view>

                  <!-- 宗族信息 -->
                  <view class="form-section">
                    <h4>宗族信息</h4>

                    <u-form-item label="姓氏" prop="familyName">
                      <u-input v-model="result.data.familyName" placeholder="请输入姓氏" />
                    </u-form-item>

                    <u-form-item label="字辈" prop="generation">
                      <u-input v-model="result.data.generation" placeholder="请输入字辈" />
                    </u-form-item>

                    <u-form-item label="籍贯" prop="nativePlace">
                      <u-input v-model="result.data.nativePlace" placeholder="请输入籍贯" />
                    </u-form-item>

                    <template v-if="recognitionType !== 'tombstone'">
                      <u-form-item label="祖籍" prop="ancestralHome">
                        <u-input v-model="result.data.ancestralHome" placeholder="请输入祖籍" />
                      </u-form-item>
                    </template>
                  </view>

                  <!-- 其他信息 -->
                  <view class="form-section">
                    <h4>其他信息</h4>

                    <u-form-item label="享年" prop="longevity">
                      <u-input v-model="result.data.longevity" placeholder="请输入享年（如：80岁）" />
                    </u-form-item>

                    <u-form-item label="墓地" prop="burialPlace">
                      <u-input v-model="result.data.burialPlace" placeholder="请输入墓地位置" />
                    </u-form-item>

                    <u-form-item label="墓志铭" prop="epitaph">
                      <u-input
                        v-model="result.data.epitaph"
                        type="textarea"
                        :rows="4"
                        placeholder="请输入墓志铭"
                      />
                      <u-button
                        type="primary"
                        size="small"
                        style="margin-top: 10rpx;"
                        @click="generateEpitaph(result)"
                      >
                        AI生成墓志铭
                      </u-button>
                    </u-form-item>

                    <u-form-item label="生平事迹" prop="accomplishments">
                      <u-input
                        v-model="result.data.accomplishments"
                        type="textarea"
                        :rows="4"
                        placeholder="请输入生平事迹"
                      />
                    </u-form-item>
                  </view>

                  <view class="form-buttons">
                    <u-button
                      type="primary"
                      size="small"
                      @click="onSaveResult(result)"
                    >
                      保存修改
                    </u-button>
                  </view>
                </u-form>
              </view>
            </view>
          </u-collapse-item>
        </u-collapse>
      </view>

      <!-- 操作按钮 -->
      <view class="action-buttons">
        <u-button
          type="primary"
          size="large"
          @click="onImportToFamilyTree"
        >
          导入到族谱
        </u-button>
        <u-button
          type="default"
          size="large"
          :disabled="errorPages === 0"
          @click="onRetryFailed"
        >
          重新识别失败页
        </u-button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

// 标签页列表
const tabList = [
  { name: 'all', label: '全部' },
  { name: 'success', label: '成功识别' },
  { name: 'error', label: '识别失败' },
]

// 当前激活的标签页
const activeTab = ref('all')
// 折叠面板激活的名称
const activeNames = ref(['1'])
// 表单引用
const formRefs = ref([])
// 获取路由信息
const route = useRoute()
// 识别类型
const recognitionType = ref('genealogy')

// 识别结果数据
const ocrResults = ref([
  {
    id: '1',
    pageNumber: 1,
    status: 'success',
    imageUrl: 'https://uviewui.com/common/logo.png',
    accuracy: 95,
    data: {
      // 核心身份信息
      name: '张三',
      gender: 'male',
      birthDate: '1980-01-01',
      birthTime: '辰时',
      deathDate: '',
      deathTime: '',

      // 家庭关系
      fatherName: '张父',
      fatherGeneration: '德',
      motherName: '张母',
      motherGeneration: '秀',
      spouseName: '李四',
      spouseGeneration: '丽',
      children: '张小明,张小红',
      childrenGenerations: '国,家',

      // 宗族信息
      familyName: '张',
      generation: '明',
      nativePlace: '北京市',
      ancestralHome: '山西省洪洞县',

      // 其他信息
      longevity: '',
      burialPlace: '',
      epitaph: '',
      accomplishments: '毕业于北京大学，现任某公司CEO',
    },
  },
  {
    id: '2',
    pageNumber: 2,
    status: 'success',
    imageUrl: 'https://uviewui.com/common/logo.png',
    accuracy: 92,
    data: {
      name: '李四',
      gender: 'female',
      birthDate: '1982-03-15',
      birthTime: '午时',
      deathDate: '',
      deathTime: '',

      fatherName: '李父',
      fatherGeneration: '福',
      motherName: '李母',
      motherGeneration: '惠',
      spouseName: '张三',
      spouseGeneration: '明',
      children: '张小明,张小红',
      childrenGenerations: '国,家',

      familyName: '李',
      generation: '丽',
      nativePlace: '上海市',
      ancestralHome: '江苏省苏州市',

      longevity: '',
      burialPlace: '',
      epitaph: '',
      accomplishments: '毕业于清华大学，现任某高校教授',
    },
  },
  {
    id: '3',
    pageNumber: 3,
    status: 'error',
    imageUrl: 'https://uviewui.com/common/logo.png',
    accuracy: 0,
    data: {
      name: '',
      gender: '',
      birthDate: '',
      birthTime: '',
      deathDate: '',
      deathTime: '',

      fatherName: '',
      fatherGeneration: '',
      motherName: '',
      motherGeneration: '',
      spouseName: '',
      spouseGeneration: '',
      children: '',
      childrenGenerations: '',

      familyName: '',
      generation: '',
      nativePlace: '',
      ancestralHome: '',

      longevity: '',
      burialPlace: '',
      epitaph: '',
      accomplishments: '',
    },
  },
])

// 计算属性：总页数
const totalPages = computed(() => ocrResults.value.length)
// 计算属性：成功识别页数
const successPages = computed(() => ocrResults.value.filter(result => result.status === 'success').length)
// 计算属性：识别失败页数
const errorPages = computed(() => ocrResults.value.filter(result => result.status === 'error').length)
// 计算属性：平均识别准确率
const accuracy = computed(() => {
  const successResults = ocrResults.value.filter(result => result.status === 'success')
  if (successResults.length === 0)
    return 0
  const totalAccuracy = successResults.reduce((sum, result) => sum + result.accuracy, 0)
  return Math.round(totalAccuracy / successResults.length)
})

// 计算属性：根据标签页显示的结果
const displayResults = computed(() => {
  if (activeTab.value === 'all') {
    return ocrResults.value
  }
  else if (activeTab.value === 'success') {
    return ocrResults.value.filter(result => result.status === 'success')
  }
  else {
    return ocrResults.value.filter(result => result.status === 'error')
  }
})

// 标签页切换
function onTabChange() {
  // 切换标签页时重置折叠面板
  activeNames.value = []
}

// 保存修改
function onSaveResult(result: any) {
  uni.showToast({
    title: '保存成功',
    icon: 'success',
  })
}

// AI生成墓志铭
function generateEpitaph(result: any) {
  uni.showLoading({
    title: '生成中...',
  })

  // 模拟AI生成过程
  setTimeout(() => {
    // 基于人物信息生成不同风格的墓志铭
    const epitaphs = [
      `${result.data.name}，生于${result.data.birthDate}，卒于${result.data.deathDate}，享年${result.data.longevity}。一生${result.data.accomplishments || '勤劳善良'}，忠厚传家。今长眠于此，音容宛在，德范长存。`,
      `${result.data.name}公（太君）之墓。${result.data.familyName}氏 ${result.data.generation}字辈。${result.data.birthDate} - ${result.data.deathDate}。生平${result.data.accomplishments || '平凡而伟大'}，子孙后代永怀铭记。`,
      `先${result.data.gender === 'male' ? '考' : '妣'} ${result.data.name} ${result.data.familyName}公（太君）。生于${result.data.birthDate}，卒于${result.data.deathDate}。${result.data.accomplishments || '勤俭持家，教子有方'}。风范长存，子孙永祀。`,
    ]

    // 弹窗展示生成的墓志铭选项
    uni.showActionSheet({
      itemList: epitaphs.map((epitaph, index) => `墓志铭 ${index + 1}`),
      success: (res) => {
        // 将选中的墓志铭填充到表单
        result.data.epitaph = epitaphs[res.tapIndex]
        uni.showToast({
          title: '墓志铭生成成功！',
          icon: 'success',
        })
      },
    })

    uni.hideLoading()
  }, 1500)
}

// 导入到族谱
function onImportToFamilyTree() {
  uni.showLoading({
    title: '导入中...',
  })

  // 模拟导入过程
  setTimeout(() => {
    uni.hideLoading()
    uni.showToast({
      title: '导入成功！',
      icon: 'success',
    })

    // 跳转到族谱页面
    uni.navigateTo({
      url: '/pages/family-tree/family-tree',
    })
  }, 1500)
}

// 重新识别失败页
function onRetryFailed() {
  uni.showToast({
    title: '重新识别功能开发中',
    icon: 'none',
  })
}

// 生成墓碑识别结果数据
function generateTombstoneResults() {
  return [
    {
      id: '1',
      pageNumber: 1,
      status: 'success',
      imageUrl: 'https://uviewui.com/common/logo.png',
      accuracy: 88,
      data: {
        // 核心身份信息
        name: '李公讳德明',
        gender: 'male',
        birthDate: '1920-05-10',
        deathDate: '2015-12-25',

        // 家庭关系
        fatherName: '李公讳福生',
        motherName: '张太君',
        spouseName: '王太君',
        children: '李建国,李建华,李建民',

        // 宗族信息
        familyName: '李',
        generation: '德',
        nativePlace: '河南省郑州市',

        // 其他信息
        longevity: '95岁',
        burialPlace: '郑州市烈士陵园',
        epitaph: '',
        accomplishments: '一生务农，抚养三子成人，深受乡邻爱戴',
      },
    },
    {
      id: '2',
      pageNumber: 2,
      status: 'success',
      imageUrl: 'https://uviewui.com/common/logo.png',
      accuracy: 92,
      data: {
        name: '张太君',
        gender: 'female',
        birthDate: '1922-03-15',
        deathDate: '2020-08-10',

        fatherName: '张公讳贵生',
        motherName: '刘太君',
        spouseName: '李公讳德明',
        children: '李建国,李建华,李建民',

        familyName: '张',
        generation: '秀',
        nativePlace: '河南省郑州市',

        longevity: '98岁',
        burialPlace: '郑州市烈士陵园',
        epitaph: '',
        accomplishments: '贤妻良母，慈祥仁爱，一生勤劳俭朴',
      },
    },
  ]
}

// 更新识别结果数据
function updateOcrResults() {
  if (recognitionType.value === 'tombstone') {
    ocrResults.value = generateTombstoneResults()
  }
  else {
    // 保留原族谱识别结果
    ocrResults.value = [
      {
        id: '1',
        pageNumber: 1,
        status: 'success',
        imageUrl: 'https://uviewui.com/common/logo.png',
        accuracy: 95,
        data: {
          // 核心身份信息
          name: '张三',
          gender: 'male',
          birthDate: '1980-01-01',
          birthTime: '辰时',
          deathDate: '',
          deathTime: '',

          // 家庭关系
          fatherName: '张父',
          fatherGeneration: '德',
          motherName: '张母',
          motherGeneration: '秀',
          spouseName: '李四',
          spouseGeneration: '丽',
          children: '张小明,张小红',
          childrenGenerations: '国,家',

          // 宗族信息
          familyName: '张',
          generation: '明',
          nativePlace: '北京市',
          ancestralHome: '山西省洪洞县',

          // 其他信息
          longevity: '',
          burialPlace: '',
          epitaph: '',
          accomplishments: '毕业于北京大学，现任某公司CEO',
        },
      },
      {
        id: '2',
        pageNumber: 2,
        status: 'success',
        imageUrl: 'https://uviewui.com/common/logo.png',
        accuracy: 92,
        data: {
          name: '李四',
          gender: 'female',
          birthDate: '1982-03-15',
          birthTime: '午时',
          deathDate: '',
          deathTime: '',

          fatherName: '李父',
          fatherGeneration: '福',
          motherName: '李母',
          motherGeneration: '惠',
          spouseName: '张三',
          spouseGeneration: '明',
          children: '张小明,张小红',
          childrenGenerations: '国,家',

          familyName: '李',
          generation: '丽',
          nativePlace: '上海市',
          ancestralHome: '江苏省苏州市',

          longevity: '',
          burialPlace: '',
          epitaph: '',
          accomplishments: '毕业于清华大学，现任某高校教授',
        },
      },
      {
        id: '3',
        pageNumber: 3,
        status: 'error',
        imageUrl: 'https://uviewui.com/common/logo.png',
        accuracy: 0,
        data: {
          name: '',
          gender: '',
          birthDate: '',
          birthTime: '',
          deathDate: '',
          deathTime: '',

          fatherName: '',
          fatherGeneration: '',
          motherName: '',
          motherGeneration: '',
          spouseName: '',
          spouseGeneration: '',
          children: '',
          childrenGenerations: '',

          familyName: '',
          generation: '',
          nativePlace: '',
          ancestralHome: '',

          longevity: '',
          burialPlace: '',
          epitaph: '',
          accomplishments: '',
        },
      },
    ]
  }
  // 初始化表单引用
  formRefs.value = ocrResults.value.map(() => null)
}

// 监听路由参数变化
watch(() => route.query.type, (newType) => {
  recognitionType.value = newType as string || 'genealogy'
  updateOcrResults()
}, { immediate: true })

// 页面加载时初始化
onMounted(() => {
  // 从路由获取识别类型
  if (route.query.type) {
    recognitionType.value = route.query.type as string
  }
  updateOcrResults()
})
</script>

<style scoped>
.ocr-result-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.ocr-result-content {
  padding: 20rpx;
}

.result-stats,
.result-list {
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

.stats-container {
  display: flex;
  justify-content: space-around;
  padding: 20rpx 0;
  border-top: 1rpx solid #eee;
  border-bottom: 1rpx solid #eee;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 4rpx;
}

.stat-label {
  font-size: 24rpx;
  color: #999;
}

.result-detail {
  padding: 10rpx 0;
}

.result-image {
  width: 100%;
  height: 300rpx;
  margin-bottom: 20rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 10rpx;
  overflow: hidden;
}

.result-image image {
  width: 100%;
  height: 100%;
}

/* 表单分组样式 */
.form-section {
  background-color: #f9f9f9;
  border-radius: 10rpx;
  padding: 20rpx;
  margin-bottom: 20rpx;
  border-left: 4rpx solid #07c160;
}

.form-section h4 {
  margin: 0 0 15rpx 0;
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

/* 表单项目间距 */
.form-section .u-form-item {
  margin-bottom: 15rpx;
}

.form-buttons {
  margin-top: 20rpx;
  display: flex;
  justify-content: flex-end;
  padding: 20rpx 0;
}

.action-buttons {
  display: flex;
  gap: 20rpx;
  margin-top: 20rpx;
}

.action-buttons u-button {
  flex: 1;
}
</style>
