import Dep from './dep'
import {isObject, isArry} from './lang'

/**
 * 响应式数据变化的监视
 */
class Observer {
  constructor (data) {
    this.data = data
    this.walk(data)
  }

  walk (data) {
    Reflect.ownKeys(data).forEach(key => {
      const val = data[key]
      if (val !== undefined) {
        // 防止无限循环
        if (val === null || !val.__obv__) {
          defineReactive(data, key)
        }
      }
    })
  }
}

// 监视数据的属性变化
const defineReactive = (obj, key) => {
  const dep = new Dep()
  const property = Reflect.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) {
    return
  }
  let val = obj[key]
  if (isObject(val) || isArry(val)) {
    Reflect.defineProperty(val, '__obv__', {
      value: 1,
      enumerable: false,
      configurable: false
    })
  }
  if (Array.isArray(val)) {
    obj[key] = val = boostAry(obj[key], dep)
    val.forEach(item => observe(item))
  } else {
    observe(val)
  }

  Reflect.defineProperty(obj, key, {
    enumerable: true,
    configurable: false,
    get () {
      if (Dep.target) {
        dep.depend()
      }
      return val
    },
    set (newVal) {
      if (newVal === val) return
      val = newVal
      if (Array.isArray(val)) {
        val = boostAry(val, dep)
        val.forEach(item => observe(item))
      } else {
        observe(val)
      }
      // 通知订阅者
      dep.notify()
    }
  })
}

// 增强数组
const boostAry = (arry, dep) => {
  // 需要增强处理的的函数名
  const methods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse']
  const protoAry = []
  methods.forEach(method => {
    protoAry[method] = function(...args) {
      const ret = Array.prototype[method].apply(this, args)
      dep.notify()
      return ret
    }
  })
  Reflect.setPrototypeOf(arry, protoAry)
  return arry
}

// 观察数据
const observe = (value, key) => {
  if (isObject(value)) {
    if (value && key) {
      // 观察单一对象的 某个属性
      defineReactive(value, key)
    }
    return new Observer(value)
  }
}

export default observe
