<template>
  <view class="name-generator-page">
    <u-navbar title="新生儿AI起名" back-text="返回" />

    <view class="generator-container">
      <!-- 起名参数设置 -->
      <u-form ref="formRef" :model="nameForm" label-position="top" :rules="rules">
        <u-form-item label="姓氏" prop="surname">
          <u-input v-model="nameForm.surname" placeholder="请输入姓氏" />
        </u-form-item>

        <u-form-item label="字辈（选填）" prop="generation">
          <u-input v-model="nameForm.generation" placeholder="请输入字辈" />
        </u-form-item>

        <u-form-item label="性别" prop="gender">
          <u-radio-group v-model="nameForm.gender" direction="row">
            <u-radio name="male">
              男
            </u-radio>
            <u-radio name="female">
              女
            </u-radio>
            <u-radio name="neutral">
              中性
            </u-radio>
          </u-radio-group>
        </u-form-item>

        <u-form-item label="五行偏好" prop="wuxing">
          <u-checkbox-group v-model="nameForm.wuxing">
            <u-checkbox name="金">
              金
            </u-checkbox>
            <u-checkbox name="木">
              木
            </u-checkbox>
            <u-checkbox name="水">
              水
            </u-checkbox>
            <u-checkbox name="火">
              火
            </u-checkbox>
            <u-checkbox name="土">
              土
            </u-checkbox>
          </u-checkbox-group>
        </u-form-item>

        <u-form-item label="音律偏好" prop="tone">
          <u-radio-group v-model="nameForm.tone" direction="row">
            <u-radio name="pingze">
              平仄相间
            </u-radio>
            <u-radio name="allping">
              全平
            </u-radio>
            <u-radio name="allze">
              全仄
            </u-radio>
          </u-radio-group>
        </u-form-item>

        <u-form-item label="名字长度" prop="length">
          <u-radio-group v-model="nameForm.length" direction="row">
            <u-radio name="2">
              2字
            </u-radio>
            <u-radio name="3">
              3字
            </u-radio>
            <u-radio name="4">
              4字
            </u-radio>
          </u-radio-group>
        </u-form-item>

        <!-- 生成按钮 -->
        <view class="generate-button">
          <u-button
            type="primary"
            size="large"
            :loading="generating"
            :disabled="generating"
            @click="onGenerateNames"
          >
            {{ generating ? '生成中...' : '生成名字' }}
          </u-button>
        </view>
      </u-form>

      <!-- 生成结果 -->
      <view v-if="nameResults.length > 0" class="result-section">
        <h3>生成的名字</h3>
        <u-list>
          <u-list-item
            v-for="(result, index) in nameResults"
            :key="index"
            :title="result.name"
            :arrow="true"
            :custom-item="true"
            @click="onViewNameDetail(result)"
          >
            <view class="name-result-item">
              <!-- 名字评分 -->
              <view class="name-score">
                <u-rate :count="5" :current="result.score" :show-text="true" :size="24" />
                <text class="score-text">{{ result.score * 20 }}分</text>
              </view>

              <!-- 名字标签 -->
              <view class="name-tags">
                <u-tag v-for="tag in result.tags" :key="tag" size="small" :type="getTagType(tag)">
                  {{ tag }}
                </u-tag>
              </view>
            </view>
          </u-list-item>
        </u-list>
      </view>

      <!-- 名字详情弹窗 -->
      <u-popup v-model="showNameDetail" mode="center" :round="20" width="80%">
        <view v-if="selectedName" class="name-detail-popup">
          <h3>{{ selectedName.name }}</h3>

          <view class="name-detail-info">
            <view class="info-item">
              <text class="label">姓氏：</text>
              <text class="value">{{ selectedName.surname }}</text>
            </view>
            <view v-if="selectedName.generation" class="info-item">
              <text class="label">字辈：</text>
              <text class="value">{{ selectedName.generation }}</text>
            </view>
            <view class="info-item">
              <text class="label">性别：</text>
              <text class="value">{{ selectedName.gender === 'male' ? '男' : selectedName.gender === 'female' ? '女' : '中性' }}</text>
            </view>
            <view class="info-item">
              <text class="label">五行：</text>
              <text class="value">{{ selectedName.wuxing }}</text>
            </view>
            <view class="info-item">
              <text class="label">音律：</text>
              <text class="value">{{ selectedName.tone }}</text>
            </view>
          </view>

          <view class="name-meaning">
            <h4>名字寓意</h4>
            <text>{{ selectedName.meaning }}</text>
          </view>

          <view class="name-origin">
            <h4>名字出处</h4>
            <text>{{ selectedName.origin }}</text>
          </view>

          <u-button type="primary" @click="onSaveName">
            保存名字
          </u-button>
          <u-button @click="showNameDetail = false">
            关闭
          </u-button>
        </view>
      </u-popup>
    </view>
  </view>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

// 起名表单
const formRef = ref<any>(null)
const nameForm = reactive({
  surname: '',
  generation: '',
  gender: 'neutral',
  wuxing: [],
  tone: 'pingze',
  length: '3',
})

// 表单验证规则
const rules = {
  surname: [
    {
      required: true,
      message: '请输入姓氏',
      trigger: ['change', 'blur'],
    },
    {
      min: 1,
      max: 10,
      message: '姓氏长度在1-10个字符',
      trigger: ['change', 'blur'],
    },
  ],
}

// 生成状态
const generating = ref(false)

// 生成结果
const nameResults = ref([])

// 名字详情
const showNameDetail = ref(false)
const selectedName = ref<any>(null)

// 生成名字
function onGenerateNames() {
  formRef.value.validate().then(() => {
    // 显示生成中状态
    generating.value = true

    // 模拟AI生成名字
    setTimeout(() => {
      // 生成10个名字
      nameResults.value = [
        {
          id: 1,
          name: `${nameForm.surname + (nameForm.generation || '')}明宇`,
          surname: nameForm.surname,
          generation: nameForm.generation,
          gender: nameForm.gender,
          wuxing: '金',
          tone: '平仄相间',
          score: 4.5,
          tags: ['大气', '有内涵', '适合男孩'],
          meaning: '明亮的宇宙，寓意有广阔的发展前景和光明的未来',
          origin: '《周易》："明出地上，晋，君子以自昭明德。"',
        },
        {
          id: 2,
          name: `${nameForm.surname + (nameForm.generation || '')}诗涵`,
          surname: nameForm.surname,
          generation: nameForm.generation,
          gender: nameForm.gender,
          wuxing: '水',
          tone: '平仄相间',
          score: 4.8,
          tags: ['文雅', '有诗意', '适合女孩'],
          meaning: '如诗如画，有涵养，寓意有文化底蕴和优雅气质',
          origin: '《诗经》："蒹葭苍苍，白露为霜。所谓伊人，在水一方。"',
        },
        {
          id: 3,
          name: `${nameForm.surname + (nameForm.generation || '')}浩轩`,
          surname: nameForm.surname,
          generation: nameForm.generation,
          gender: nameForm.gender,
          wuxing: '土',
          tone: '平仄相间',
          score: 4.6,
          tags: ['大气', '稳重', '适合男孩'],
          meaning: '浩瀚的宇宙，轩昂的气质，寓意有远大的志向和高贵的品质',
          origin: '《楚辞》："望崦嵫而勿迫，恐鹈鴂之先鸣。"',
        },
        {
          id: 4,
          name: `${nameForm.surname + (nameForm.generation || '')}雨桐`,
          surname: nameForm.surname,
          generation: nameForm.generation,
          gender: nameForm.gender,
          wuxing: '木',
          tone: '平仄相间',
          score: 4.7,
          tags: ['清新', '自然', '适合女孩'],
          meaning: '雨中的梧桐，寓意坚韧不拔，茁壮成长',
          origin: '《庄子》："夫鹓鶵发于南海，而飞于北海，非梧桐不止。"',
        },
        {
          id: 5,
          name: `${nameForm.surname + (nameForm.generation || '')}宇航`,
          surname: nameForm.surname,
          generation: nameForm.generation,
          gender: nameForm.gender,
          wuxing: '火',
          tone: '平仄相间',
          score: 4.4,
          tags: ['现代', '科技感', '适合男孩'],
          meaning: '宇宙航行，寓意有探索精神和远大抱负',
          origin: '现代科技词汇，象征人类对宇宙的探索精神',
        },
        {
          id: 6,
          name: `${nameForm.surname + (nameForm.generation || '')}雅琳`,
          surname: nameForm.surname,
          generation: nameForm.generation,
          gender: nameForm.gender,
          wuxing: '木',
          tone: '平仄相间',
          score: 4.6,
          tags: ['优雅', '美丽', '适合女孩'],
          meaning: '优雅的美玉，寓意高雅、纯洁',
          origin: '《诗经》："投我以木桃，报之以琼瑶。"',
        },
        {
          id: 7,
          name: `${nameForm.surname + (nameForm.generation || '')}俊杰`,
          surname: nameForm.surname,
          generation: nameForm.generation,
          gender: nameForm.gender,
          wuxing: '金',
          tone: '平仄相间',
          score: 4.5,
          tags: ['杰出', '优秀', '适合男孩'],
          meaning: '才智出众的人，寓意有卓越的才能和品质',
          origin: '《史记》："夫运筹策帷帐之中，决胜于千里之外，吾不如子房；镇国家，抚百姓，给馈饷，不绝粮道，吾不如萧何；连百万之军，战必胜，攻必取，吾不如韩信。此三者，皆人杰也。"',
        },
        {
          id: 8,
          name: `${nameForm.surname + (nameForm.generation || '')}梦瑶`,
          surname: nameForm.surname,
          generation: nameForm.generation,
          gender: nameForm.gender,
          wuxing: '水',
          tone: '平仄相间',
          score: 4.7,
          tags: ['梦幻', '美好', '适合女孩'],
          meaning: '如梦幻般的美玉，寓意美好、珍贵',
          origin: '《庄子》："昔者庄周梦为胡蝶，栩栩然胡蝶也，自喻适志与！不知周也。"',
        },
        {
          id: 9,
          name: `${nameForm.surname + (nameForm.generation || '')}睿哲`,
          surname: nameForm.surname,
          generation: nameForm.generation,
          gender: nameForm.gender,
          wuxing: '金',
          tone: '平仄相间',
          score: 4.6,
          tags: ['聪明', '有智慧', '适合男孩'],
          meaning: '聪明睿智，寓意有卓越的智慧和判断力',
          origin: '《尚书》："睿哲文明，温恭允塞。"',
        },
        {
          id: 10,
          name: `${nameForm.surname + (nameForm.generation || '')}依娜`,
          surname: nameForm.surname,
          generation: nameForm.generation,
          gender: nameForm.gender,
          wuxing: '土',
          tone: '平仄相间',
          score: 4.5,
          tags: ['温柔', '美丽', '适合女孩'],
          meaning: '依靠的姿态，婀娜的身姿，寓意温柔、优雅',
          origin: '《诗经》："依彼平林，有集维鷮。"',
        },
      ]

      // 隐藏生成中状态
      generating.value = false
    }, 2000)
  }).catch(() => {
    uni.showToast({
      title: '请输入姓氏',
      icon: 'error',
    })
  })
}

// 查看名字详情
function onViewNameDetail(name: any) {
  selectedName.value = name
  showNameDetail.value = true
}

// 保存名字
function onSaveName() {
  uni.showToast({
    title: '名字已保存',
    icon: 'success',
  })
  showNameDetail.value = false
}

// 获取标签类型
function getTagType(tag: string) {
  const tagMap: any = {
    大气: 'primary',
    有内涵: 'success',
    适合男孩: 'warning',
    文雅: 'primary',
    有诗意: 'success',
    适合女孩: 'error',
    稳重: 'warning',
    清新: 'success',
    自然: 'primary',
    现代: 'warning',
    科技感: 'primary',
    优雅: 'success',
    美丽: 'error',
    杰出: 'primary',
    优秀: 'success',
    梦幻: 'error',
    美好: 'success',
    聪明: 'primary',
    有智慧: 'success',
    温柔: 'error',
  }
  return tagMap[tag] || 'default'
}
</script>

<style scoped>
.name-generator-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.generator-container {
  padding: 20rpx;
}

.generate-button {
  margin-top: 30rpx;
}

.result-section {
  margin-top: 30rpx;
  background-color: #fff;
  padding: 20rpx;
  border-radius: 10rpx;
  box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.1);
}

.result-section h3 {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  text-align: center;
}

.name-result-item {
  padding: 20rpx 0;
}

.name-score {
  display: flex;
  align-items: center;
  margin-bottom: 10rpx;
}

.score-text {
  margin-left: 10rpx;
  color: #ff9800;
  font-size: 24rpx;
}

.name-tags {
  display: flex;
  gap: 10rpx;
  flex-wrap: wrap;
}

.name-detail-popup {
  background-color: #fff;
  padding: 30rpx;
  border-radius: 20rpx;
}

.name-detail-popup h3 {
  font-size: 36rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  text-align: center;
}

.name-detail-popup h4 {
  font-size: 28rpx;
  font-weight: bold;
  margin: 20rpx 0 10rpx 0;
}

.name-detail-info {
  background-color: #f5f5f5;
  padding: 20rpx;
  border-radius: 10rpx;
  margin-bottom: 20rpx;
}

.info-item {
  display: flex;
  margin-bottom: 15rpx;
  align-items: center;
}

.info-item:last-child {
  margin-bottom: 0;
}

.info-item .label {
  font-weight: bold;
  margin-right: 10rpx;
  color: #666;
  min-width: 80rpx;
}

.info-item .value {
  color: #333;
}

.name-meaning,
.name-origin {
  margin-bottom: 20rpx;
}

.name-meaning text,
.name-origin text {
  color: #666;
  line-height: 1.6;
}

.name-detail-popup u-button {
  margin-top: 10rpx;
}
</style>
