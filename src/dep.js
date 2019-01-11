let uid = 0
/**
 * 响应式属性的依赖
 * 联系 watcher 实例，和数据的直接桥梁
 */
class Dep {
  constructor () {
    this.id = uid++
    // 依赖于某个数据属性的 订阅者
    // 某个数据属性 如tie.comment.content 可能在页面上多个地方展示
    // 这里是 一对多的关系，一个数据属性对应多个
    this.subs = []
  }
  
  // 添加订阅者，即watcher实例
  addSub (sub) {
    this.subs.push(sub)
  }

  // 在 Observer 的getter中被调用，加入对数据属性的依赖
  depend () {
    Dep.target.addDep(this)
  }

  // 移除某个订阅者(Watcher)
  removeSub (sub) {
    const index = this.subs.indexOf(sub)
    if (index != -1) {
      this.subs.splice(index, 1)
    }
  }

  // 在 Observer 的setter中被调用，通知订阅了某个数据属性的所有Watcher实例更新
  notify () {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
}

Dep.target = null
export default Dep
