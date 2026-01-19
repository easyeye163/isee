<template>
  <view class="feed-list-page">
    <u-navbar title="宗亲动态" back-text="返回">
      <template #right>
        <u-button type="text" @click="onPublish">
          发布
        </u-button>
      </template>
    </u-navbar>

    <view class="feed-container">
      <!-- 动态列表 -->
      <u-list>
        <u-list-item
          v-for="feed in feedList"
          :key="feed.id"
          :title="feed.user.name"
          :sub-title="feed.createTime"
          :cover="feed.user.avatar"
          :arrow="false"
          :custom-item="true"
        >
          <view class="feed-item">
            <!-- 动态内容 -->
            <view class="feed-content">
              <text>{{ feed.content }}</text>
            </view>

            <!-- 动态图片 -->
            <view v-if="feed.images && feed.images.length > 0" class="feed-images">
              <view class="image-grid" :class="{ 'grid-1': feed.images.length === 1 }">
                <image
                  v-for="(image, index) in feed.images"
                  :key="index"
                  :src="image.url"
                  mode="aspectFill"
                  @click="onImagePreview(image.url, feed.images)"
                />
              </view>
            </view>

            <!-- 动态视频 -->
            <view v-if="feed.video" class="feed-video">
              <video
                :src="feed.video.url"
                controls
                :poster="feed.video.poster"
                :show-center-play-btn="true"
              />
            </view>

            <!-- 动态操作栏 -->
            <view class="feed-actions">
              <view class="action-item" @click="onLike(feed)">
                <u-icon :name="feed.isLiked ? 'heart-fill' : 'heart'" :color="feed.isLiked ? '#ee0a24' : '#999'" size="24" />
                <text>{{ feed.likeCount }}</text>
              </view>
              <view class="action-item" @click="onComment(feed)">
                <u-icon name="chat" color="#999" size="24" />
                <text>{{ feed.commentCount }}</text>
              </view>
              <view class="action-item" @click="onShare(feed)">
                <u-icon name="share" color="#999" size="24" />
                <text>{{ feed.shareCount }}</text>
              </view>
            </view>

            <!-- 动态类型标签 -->
            <u-tag
              :type="getTagType(feed.type)"
              size="small"
              class="feed-tag"
            >
              {{ getTagText(feed.type) }}
            </u-tag>
          </view>
        </u-list-item>
      </u-list>

      <!-- 加载更多 -->
      <u-loadmore :status="loadStatus" @loadmore="onLoadMore" />
    </view>

    <!-- 评论弹窗 -->
    <u-popup v-model="showComment" mode="bottom" :round="20" height="60%">
      <view class="comment-popup">
        <h3>评论 ({{ selectedFeed?.commentCount || 0 }})</h3>

        <view class="comment-list">
          <view v-for="comment in comments" :key="comment.id" class="comment-item">
            <image :src="comment.user.avatar" class="comment-avatar" />
            <view class="comment-content">
              <view class="comment-header">
                <text class="comment-name">{{ comment.user.name }}</text>
                <text class="comment-time">{{ comment.createTime }}</text>
              </view>
              <text class="comment-text">{{ comment.content }}</text>
              <view class="comment-actions">
                <text class="like-btn" @click="onCommentLike(comment)">
                  <u-icon :name="comment.isLiked ? 'heart-fill' : 'heart'" :color="comment.isLiked ? '#ee0a24' : '#999'" size="18" />
                  <text>{{ comment.likeCount }}</text>
                </text>
              </view>
            </view>
          </view>
        </view>

        <view class="comment-input">
          <u-input
            v-model="commentInput"
            placeholder="写下你的评论..."
            maxlength="200"
            show-word-limit
          />
          <u-button type="primary" size="small" @click="onSubmitComment">
            发送
          </u-button>
        </view>
      </view>
    </u-popup>
  </view>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 动态列表
const feedList = ref([
  {
    id: 1,
    user: {
      id: 1,
      name: '张三',
      avatar: '/static/images/avatar.jpg',
    },
    content: '今天参加了宗族祭祖活动，感觉非常有意义！',
    createTime: '2025-12-16 10:30',
    images: [
      { url: '/static/images/avatar.jpg' },
      { url: '/static/images/default-avatar.png' },
    ],
    video: null,
    type: 'event',
    likeCount: 12,
    commentCount: 5,
    shareCount: 3,
    isLiked: false,
    comments: [
      {
        id: 1,
        user: {
          id: 4,
          name: '赵六',
          avatar: '/static/images/default-avatar.png',
        },
        content: '活动很有意义，下次一定要参加！',
        createTime: '2025-12-16 10:35',
        likeCount: 3,
        isLiked: false,
      },
      {
        id: 2,
        user: {
          id: 5,
          name: '孙七',
          avatar: '/static/images/avatar.jpg',
        },
        content: '照片拍得不错，很有氛围！',
        createTime: '2025-12-16 10:40',
        likeCount: 2,
        isLiked: true,
      },
    ],
  },
  {
    id: 2,
    user: {
      id: 2,
      name: '李四',
      avatar: '/static/images/default-avatar.png',
    },
    content: '分享一张我们家族的老照片，这是1980年拍摄的全家福。',
    createTime: '2025-12-15 15:20',
    images: [
      { url: '/static/images/avatar.jpg' },
    ],
    video: null,
    type: 'normal',
    likeCount: 25,
    commentCount: 8,
    shareCount: 6,
    isLiked: true,
    comments: [
      {
        id: 3,
        user: {
          id: 6,
          name: '周八',
          avatar: '/static/images/avatar.jpg',
        },
        content: '这张照片很珍贵，一定要好好保存！',
        createTime: '2025-12-15 15:25',
        likeCount: 5,
        isLiked: false,
      },
      {
        id: 4,
        user: {
          id: 7,
          name: '吴九',
          avatar: '/static/images/default-avatar.png',
        },
        content: '看到了很多熟悉的面孔，时光荏苒啊！',
        createTime: '2025-12-15 15:30',
        likeCount: 3,
        isLiked: true,
      },
    ],
  },
  {
    id: 3,
    user: {
      id: 3,
      name: '王五',
      avatar: '/static/images/avatar.jpg',
    },
    content: '我家新生儿出生了，按照字辈取名为张明宇，希望他能健康成长！',
    createTime: '2025-12-14 09:15',
    images: [],
    video: {
      url: 'https://example.com/video.mp4',
      poster: '/static/images/avatar.jpg',
    },
    type: 'achievement',
    likeCount: 45,
    commentCount: 15,
    shareCount: 12,
    isLiked: false,
    comments: [
      {
        id: 5,
        user: {
          id: 8,
          name: '郑十',
          avatar: '/static/images/avatar.jpg',
        },
        content: '恭喜恭喜！宝宝可爱！',
        createTime: '2025-12-14 09:20',
        likeCount: 10,
        isLiked: false,
      },
      {
        id: 6,
        user: {
          id: 9,
          name: '王十一',
          avatar: '/static/images/default-avatar.png',
        },
        content: '名字取得好，有意义！',
        createTime: '2025-12-14 09:25',
        likeCount: 7,
        isLiked: true,
      },
    ],
  },
  {
    id: 4,
    user: {
      id: 10,
      name: '赵十二',
      avatar: '/static/images/avatar.jpg',
    },
    content: '最新消息：宗族理事会决定明年清明节举行大型祭祖活动，欢迎大家参加！',
    createTime: '2025-12-13 14:45',
    images: [],
    video: null,
    type: 'news',
    likeCount: 38,
    commentCount: 12,
    shareCount: 8,
    isLiked: false,
    comments: [
      {
        id: 7,
        user: {
          id: 11,
          name: '孙十三',
          avatar: '/static/images/avatar.jpg',
        },
        content: '好消息！一定参加！',
        createTime: '2025-12-13 14:50',
        likeCount: 8,
        isLiked: false,
      },
    ],
  },
  {
    id: 5,
    user: {
      id: 12,
      name: '李十四',
      avatar: '/static/images/default-avatar.png',
    },
    content: '今天和几位宗亲一起讨论了族谱修订的事情，大家都很积极参与。',
    createTime: '2025-12-12 16:30',
    images: [
      { url: '/static/images/avatar.jpg' },
      { url: '/static/images/default-avatar.png' },
      { url: '/static/images/avatar.jpg' },
    ],
    video: null,
    type: 'event',
    likeCount: 22,
    commentCount: 7,
    shareCount: 4,
    isLiked: true,
    comments: [
      {
        id: 8,
        user: {
          id: 13,
          name: '周十五',
          avatar: '/static/images/avatar.jpg',
        },
        content: '族谱修订很重要，一定要认真对待！',
        createTime: '2025-12-12 16:35',
        likeCount: 4,
        isLiked: false,
      },
    ],
  },
  {
    id: 6,
    user: {
      id: 14,
      name: '吴十六',
      avatar: '/static/images/avatar.jpg',
    },
    content: '分享一下我的书法作品，最近练习写宗族字辈。',
    createTime: '2025-12-11 10:00',
    images: [
      { url: '/static/images/avatar.jpg' },
    ],
    video: null,
    type: 'normal',
    likeCount: 18,
    commentCount: 5,
    shareCount: 2,
    isLiked: false,
    comments: [
      {
        id: 9,
        user: {
          id: 15,
          name: '郑十七',
          avatar: '/static/images/avatar.jpg',
        },
        content: '字写得好！功底深厚！',
        createTime: '2025-12-11 10:05',
        likeCount: 6,
        isLiked: true,
      },
    ],
  },
  {
    id: 7,
    user: {
      id: 16,
      name: '王十八',
      avatar: '/static/images/default-avatar.png',
    },
    content: '我家双胞胎出生了，取名为李博文和李文博，希望他们能成为有学问的人！',
    createTime: '2025-12-10 08:20',
    images: [],
    video: {
      url: 'https://example.com/video.mp4',
      poster: '/static/images/avatar.jpg',
    },
    type: 'achievement',
    likeCount: 56,
    commentCount: 18,
    shareCount: 15,
    isLiked: true,
    comments: [
      {
        id: 10,
        user: {
          id: 17,
          name: '赵十九',
          avatar: '/static/images/avatar.jpg',
        },
        content: '恭喜恭喜！双胞胎太可爱了！',
        createTime: '2025-12-10 08:25',
        likeCount: 12,
        isLiked: false,
      },
    ],
  },
  {
    id: 8,
    user: {
      id: 18,
      name: '孙二十',
      avatar: '/static/images/avatar.jpg',
    },
    content: '宗族微信群已经建立，欢迎宗亲们加入，一起交流家族文化！',
    createTime: '2025-12-09 19:00',
    images: [],
    video: null,
    type: 'news',
    likeCount: 42,
    commentCount: 14,
    shareCount: 10,
    isLiked: false,
    comments: [
      {
        id: 11,
        user: {
          id: 19,
          name: '李二十一',
          avatar: '/static/images/default-avatar.png',
        },
        content: '已经加入了，氛围很好！',
        createTime: '2025-12-09 19:05',
        likeCount: 9,
        isLiked: true,
      },
    ],
  },
  {
    id: 9,
    user: {
      id: 20,
      name: '周二十二',
      avatar: '/static/images/avatar.jpg',
    },
    content: '今天去拜访了家族长辈，听他讲述了很多家族历史，收获颇多！',
    createTime: '2025-12-08 16:15',
    images: [],
    video: null,
    type: 'normal',
    likeCount: 26,
    commentCount: 9,
    shareCount: 5,
    isLiked: true,
    comments: [
      {
        id: 12,
        user: {
          id: 21,
          name: '吴二十三',
          avatar: '/static/images/avatar.jpg',
        },
        content: '应该多听听长辈们的讲述，这些都是宝贵的家族财富！',
        createTime: '2025-12-08 16:20',
        likeCount: 7,
        isLiked: false,
      },
    ],
  },
  {
    id: 10,
    user: {
      id: 22,
      name: '郑二十四',
      avatar: '/static/images/default-avatar.png',
    },
    content: '家族网站已经上线，上面有族谱查询、宗亲联谊等功能，欢迎大家访问！',
    createTime: '2025-12-07 14:00',
    images: [
      { url: '/static/images/avatar.jpg' },
      { url: '/static/images/default-avatar.png' },
    ],
    video: null,
    type: 'news',
    likeCount: 48,
    commentCount: 16,
    shareCount: 12,
    isLiked: false,
    comments: [
      {
        id: 13,
        user: {
          id: 23,
          name: '王二十五',
          avatar: '/static/images/avatar.jpg',
        },
        content: '太好了！网站功能很实用！',
        createTime: '2025-12-07 14:05',
        likeCount: 11,
        isLiked: true,
      },
    ],
  },
])

// 加载状态
const loadStatus = ref('loadmore')

// 评论弹窗
const showComment = ref(false)
const selectedFeed = ref<any>(null)
const comments = ref<any[]>([])
const commentInput = ref('')

// 发布动态
function onPublish() {
  uni.navigateTo({
    url: '/pages/feed/publish',
  })
}

// 点赞
function onLike(feed: any) {
  feed.isLiked = !feed.isLiked
  feed.likeCount += feed.isLiked ? 1 : -1
}

// 评论
function onComment(feed: any) {
  selectedFeed.value = feed
  // 使用当前动态的评论数据
  comments.value = feed.comments || []
  showComment.value = true
}

// 分享
function onShare(feed: any) {
  uni.showActionSheet({
    itemList: ['分享给朋友', '分享到朋友圈', '复制链接'],
    success: (res) => {
      uni.showToast({
        title: '分享成功！',
        icon: 'success',
      })
    },
  })
}

// 图片预览
function onImagePreview(currentUrl: string, images: any[]) {
  const urls = images.map(image => image.url)
  uni.previewImage({
    urls,
    current: currentUrl,
  })
}

// 获取标签类型
function getTagType(type: string) {
  switch (type) {
    case 'event': return 'primary'
    case 'news': return 'warning'
    case 'achievement': return 'success'
    default: return 'default'
  }
}

// 获取标签文本
function getTagText(type: string) {
  switch (type) {
    case 'event': return '宗族活动'
    case 'news': return '宗族新闻'
    case 'achievement': return '个人成就'
    default: return '普通动态'
  }
}

// 加载更多
function onLoadMore() {
  // 模拟加载更多
  loadStatus.value = 'loading'
  setTimeout(() => {
    loadStatus.value = 'nomore'
  }, 1500)
}

// 评论点赞
function onCommentLike(comment: any) {
  comment.isLiked = !comment.isLiked
  comment.likeCount += comment.isLiked ? 1 : -1
}

// 提交评论
function onSubmitComment() {
  if (!commentInput.value.trim())
    return

  // 模拟提交评论
  const newComment = {
    id: Date.now(), // 使用时间戳作为唯一ID
    user: {
      id: 1,
      name: '我',
      avatar: '/static/images/avatar.jpg',
    },
    content: commentInput.value,
    createTime: new Date().toLocaleString(),
    likeCount: 0,
    isLiked: false,
  }

  // 添加到全局评论数组
  comments.value.unshift(newComment)

  // 添加到当前动态的评论数组
  if (selectedFeed.value) {
    // 如果当前动态没有评论数组，初始化一个
    if (!selectedFeed.value.comments) {
      selectedFeed.value.comments = []
    }
    // 添加新评论到当前动态的评论数组
    selectedFeed.value.comments.unshift(newComment)
    // 更新评论计数
    selectedFeed.value.commentCount++
  }

  // 清空评论输入框
  commentInput.value = ''

  // 显示评论成功提示
  uni.showToast({
    title: '评论成功！',
    icon: 'success',
    duration: 2000,
  })
}
</script>

<style scoped>
.feed-list-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.feed-container {
  padding: 20rpx;
}

.feed-item {
  padding: 20rpx 0;
  border-bottom: 1rpx solid #eee;
}

.feed-content {
  margin-bottom: 15rpx;
  color: #333;
  line-height: 1.5;
}

.feed-images {
  margin-bottom: 15rpx;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10rpx;
}

.image-grid.grid-1 {
  grid-template-columns: 1fr;
}

.image-grid image {
  width: 100%;
  height: 200rpx;
  border-radius: 10rpx;
}

.image-grid.grid-1 image {
  height: 400rpx;
}

.feed-video {
  margin-bottom: 15rpx;
}

.feed-video video {
  width: 100%;
  height: 400rpx;
  border-radius: 10rpx;
}

.feed-actions {
  display: flex;
  gap: 40rpx;
  margin-bottom: 15rpx;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 5rpx;
  color: #999;
  font-size: 24rpx;
  cursor: pointer;
}

.feed-tag {
  position: absolute;
  top: 20rpx;
  right: 20rpx;
}

.comment-popup {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.comment-popup h3 {
  text-align: center;
  margin: 20rpx 0;
  font-size: 32rpx;
  font-weight: bold;
}

.comment-list {
  flex: 1;
  overflow-y: auto;
  padding: 0 20rpx;
}

.comment-item {
  display: flex;
  margin-bottom: 20rpx;
  gap: 15rpx;
}

.comment-avatar {
  width: 60rpx;
  height: 60rpx;
  border-radius: 50%;
}

.comment-content {
  flex: 1;
  background-color: #f5f5f5;
  padding: 15rpx;
  border-radius: 10rpx;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rpx;
}

.comment-name {
  font-weight: bold;
  color: #333;
}

.comment-time {
  font-size: 20rpx;
  color: #999;
}

.comment-text {
  color: #666;
  line-height: 1.5;
}

.comment-actions {
  margin-top: 10rpx;
  display: flex;
  justify-content: flex-end;
}

.like-btn {
  display: flex;
  align-items: center;
  gap: 5rpx;
  color: #999;
  font-size: 20rpx;
  cursor: pointer;
}

.comment-input {
  display: flex;
  gap: 10rpx;
  padding: 20rpx;
  border-top: 1rpx solid #eee;
  background-color: #fff;
  align-items: center;
}

.comment-input u-input {
  flex: 1;
}
</style>
