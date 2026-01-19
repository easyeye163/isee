import { createI18n } from 'vue-i18n'

import en from './en.json'
import th from './th.json' // 泰语
import zhHans from './zh-Hans.json' // 简体中文

const messages = {
  en,
  'zh-Hans': zhHans, // key 不能乱写，查看截图 screenshots/i18n.png
  th,
}

const i18n = createI18n({
  locale: uni.getLocale(), // 获取已设置的语言，fallback 语言需要再 manifest.config.ts 中设置
  messages,
  allowComposition: true,
})

console.log(uni.getLocale())
console.log(i18n.global.locale)

/**
 * 可以拿到原始的语言模板，非 vue 文件使用这个方法，
 * @param { string } key 多语言的key，eg: "app.name"
 * @returns {string} 返回原始的多语言模板，eg: "{heavy}KG"
 */
export function getTemplateByKey(key: string): string {
  if (!key) {
    console.error(`[i18n] Function getTemplateByKey(), key param is required`)
    return ''
  }
  const locale = uni.getLocale()
  console.log('locale:', locale)

  // 获取当前语言模板，如果不存在则使用默认语言（简体中文）
  const message = messages[locale] || messages['zh-Hans']
  if (!message) {
    console.error(`[i18n] No message found for locale: ${locale}`)
    return ''
  }

  try {
    const keyList = key.split('.')
    let result: any = message

    for (const k of keyList) {
      if (!result || typeof result !== 'object') {
        throw new Error(`Key path ${key} not found`)
      }
      result = result[k]
    }

    return typeof result === 'string' ? result : ''
  }
  catch (error) {
    console.error(`[i18n] Function getTemplateByKey(), key param ${key} is not existed.`)
    return ''
  }
}

/**
 * formatI18n('我是{name},身高{detail.height},体重{detail.weight}',{name:'张三',detail:{height:178,weight:'75kg'}})
 * 暂不支持数组
 * @param template 多语言模板字符串，eg: `我是{name}`
 * @param {object | undefined} data 需要传递的数据对象，里面的key与多语言字符串对应，eg: `{name:'菲鸽'}`
 * @returns
 */
function formatI18n(template: string | undefined, data?: any) {
  if (!template) {
    return ''
  }
  return template.replace(/\{([^}]+)\}/g, (match, key: string) => {
    // console.log( match, key) // => { detail.height }  detail.height
    const arr = key.trim().split('.')
    let result = data
    while (arr.length) {
      const first = arr.shift()
      if (!result)
        break
      result = result[first]
    }
    return result || match
  })
}

/**
 * t('introduction',{name:'张三',detail:{height:178,weight:'75kg'}})
 * => formatI18n('我是{name},身高{detail.height},体重{detail.weight}',{name:'张三',detail:{height:178,weight:'75kg'}})
 * 没有key的，可以不传 data；暂不支持数组
 * @param key 多语言模板字符串，eg: `introduction`
 * @param data 需要传递的数据对象，里面的key与多语言字符串对应，eg: `{name:'菲鸽'}`
 * @returns 格式化后的字符串
 */
export function t(key: string, data?: Record<string, any>): string {
  return formatI18n(getTemplateByKey(key), data)
}
export default i18n
