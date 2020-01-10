import Watcher from './watcher'
import observe from './observer'
import Compile from './compile/scan.js'
import {proxy} from './lang'
import filters from './filters'
class NVM {
  constructor (options = {}) {
    // 配置选项
    this.options = options
    // 视图数据
    const data = this.data = this.options.data
    // 模板
    this.template = options.template || ''
    // 视图插入点
    this.el = options.el
    // 父级实例
    this.parent = options.parent
    // 事件处理函数
    const listener = this.options.methods || {}
    listener.__proto__ = this.parent && this.parent.listener
    this.listener = listener
    // 过滤器
    this.filters = NVM.filters = Object.assign(options.filters || {}, filters)

    // 数据代理 实现 vm.xxx -> vm._data.xxx
    this.proxyData(data)
    // 计算属性
    this.initComputed()
    // 监视数据变化
    observe(data)
    this.observe = observe
    // 编译模板
    this.compile = new Compile(this)
    // 钩子函数
    options.created && options.created.call(this)
  }

  watch (key, cb) {
    new Watcher(this, key, cb)
  }

  proxyData (data) {
    for (const key in data) {
      proxy(this, data, key)
    }
  }

  initComputed () {
    const computed = this.options.computed
    if (typeof computed === 'object') {
      Object.keys(computed).forEach(key => {
        Object.defineProperty(this, key, {
          get: typeof computed[key] === 'function' ? computed[key] : computed[key].get,
          set () {}
        })
      })
    }
  }

  rendered () {
    return this.compile.fragment
  }
  
}

window.NVM = window.nvm = NVM
export default NVM