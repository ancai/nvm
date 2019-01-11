export const isArry = (value) => {
  return Array.isArray(value)
}

export const isObject = (value) => {
  return value && typeof value === 'object'
}

/**
 * 代理属性
 * @param {*} to 目标对象
 * @param {*} from 当前对象
 * @param {*} key 属性键
 */
export const proxy = (to, from, key) => {
  if (to.hasOwnProperty(key)) return
  Reflect.defineProperty(to, key, {
    enumerable: true,
    configurable: false,
    get () {
      return from[key]
    },
    set (val) {
      from[key] = val
    }
  })
}
