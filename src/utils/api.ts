// API 基础配置
const API_BASE_URL = '/api'

// 接口响应类型
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  [key: string]: any
}

// 通用请求方法
function request<T = any>(options: any): Promise<ApiResponse<T>> {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${API_BASE_URL}${options.url}`,
      method: options.method || 'GET',
      data: options.data,
      header: {
        'Content-Type': 'application/json',
        ...options.header,
      },
      success: (res: any) => {
        const { statusCode, data } = res

        if (statusCode >= 200 && statusCode < 300) {
          resolve(data as ApiResponse<T>)
        }
        else {
          const errorMsg = (data as ApiResponse).error || (data as ApiResponse).message || `请求失败: ${statusCode}`
          reject(new Error(errorMsg))
        }
      },
      fail: (err: any) => {
        reject(new Error(err.errMsg || '网络请求失败'))
      },
    })
  })
}

// 用户相关 API
export const userApi = {
  // 注册用户
  register: (name: string, phone: string, password: string) => {
    return request({
      url: '/users',
      method: 'POST',
      data: { name, phone, password },
    })
  },

  // 用户登录
  login: (name: string, password: string) => {
    return request({
      url: '/users/login',
      method: 'POST',
      data: { name, password },
    })
  },

  // 获取用户信息
  getUserInfo: (userId: string) => {
    return request({
      url: `/users/${userId}`,
      method: 'GET',
    })
  },
}

// 联系人相关 API
export const contactApi = {
  // 获取联系人列表
  getContacts: (userId: string) => {
    return request({
      url: `/users/${userId}/contacts`,
      method: 'GET',
    })
  },

  // 添加联系人
  addContact: (userId: string, type: string, name: string, email: string, phone?: string) => {
    return request({
      url: `/users/${userId}/contacts`,
      method: 'POST',
      data: { type, name, email, phone },
    })
  },

  // 更新联系人
  updateContact: (contactId: string, type: string, name: string, email: string, phone?: string) => {
    return request({
      url: `/contacts/${contactId}`,
      method: 'PUT',
      data: { type, name, email, phone },
    })
  },

  // 删除联系人
  deleteContact: (contactId: string) => {
    return request({
      url: `/contacts/${contactId}`,
      method: 'DELETE',
    })
  },
}

// 签到相关 API
export const signInApi = {
  // 执行签到
  signIn: (userId: string) => {
    return request({
      url: `/users/${userId}/sign-in`,
      method: 'POST',
    })
  },

  // 获取签到状态
  getSignInStatus: (userId: string) => {
    return request({
      url: `/users/${userId}/sign-in-status`,
      method: 'GET',
    })
  },

  // 获取签到历史
  getSignInHistory: (userId: string, limit: number = 7) => {
    return request({
      url: `/users/${userId}/sign-ins`,
      method: 'GET',
      data: { limit },
    })
  },
}

// 导出默认 API 对象
export default {
  user: userApi,
  contact: contactApi,
  signIn: signInApi,
}
