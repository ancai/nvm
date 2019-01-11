import Dep from './dep'
import Batcher from './batcher'
import getVal from './value'

const batcher = new Batcher()
let uid = 0
/**
 * 在 首次解析指令的时候 实例化 Watcher
 * 连接 数据 和 模板的 中介
 */
class Watcher {
  // 在 directives.js 的 link 方法中生成实例
  constructor (vm, expOrFn, cb) {
    this.id = uid++
    this.cb = cb
    this.vm = vm
    this.expOrFn = expOrFn
    this.depIds = {}
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = this.parseGetter(expOrFn)
    }

    // 此处为了触发属性的getter，从而在dep添加自己，结合Observer更易理解
    this.value = this.get()
  }

  update () {
    // 属性值变化收到通知
    // this.run() 同步方式
    batcher.push(this)
  }

  run () {
    const value = this.get()  // 取到最新值
    const oldVal = this.value
    if (value !== oldVal) {
      this.value = value
      this.cb.call(this.vm, value, oldVal)
    }
    if (Array.isArray(value)) {
      this.cb.call(this.vm, value, oldVal)
    }
  }

  addDep (dep) {
    // 1.(observer)属性setter -> (dep)notify -> (watcher)run -> (observer)属性的getter -> dep.depend -> (这里)addDep
    // 2. dep.id存在当前watcher的depIds里，说明不是一个新的属性，仅改变其值
    // 3.假如是新属性 vm.dog={name: 'tom'}，将当前watcher(dog.name)实例加入新属性dog.name的依赖dep里
    // 4.子属性的watcher被添加到子属性的依赖dep时，也会被添加到(getVal时会先触发父级getter)祖先级属性的依赖dep。
    // 当前watcher实例是'pet.dog.name', 那么pet, pet.dog, pet.dog.name这三个属性的dep都会加入当前watcher。这样祖先级属性改变，子级属性也能感知到。

    if (!this.depIds.hasOwnProperty(dep.id)) {
      dep.addSub(this)
      this.depIds[dep.id] = dep      
    }
  }

  get () {
    // 将当前订阅者指向自己
    Dep.target = this
    // 触发getter，添加自己到属性订阅器中
    const value = this.getter.call(this.vm, this.vm)
    // 添加完毕，重置
    Dep.target = null
    return value
  }

  parseGetter (exp) {
    return getVal(exp)
  }
}

export default Watcher