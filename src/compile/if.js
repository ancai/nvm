/**
 * if 条件 解析器
 */
import MVVM from '../index'
import util from './util'

class IF {
  /**
   * 初次解析 n-if时 执行，用一个注释结点占据原先的 n-if 结点位置
   * @param {*} node 
   * @param {*} vm 
   */
  constructor (node, vm) {
    this.template = node.cloneNode(true)
    this.vm = vm
    this.ref = document.createComment('n-if')
    this.inserted = false
    util.before(this.ref, node)
    util.remove(node)
  }

  /**
   * 当n-if指令依赖的数据发生变化时触发此更新函数
   * @param {*} value 
   */
  update (value) {
    if (value) {
      // 加载 子 实例
      if (!this.inserted) {
        this.build(this.template, value)
        util.remove(this.ref)
        this.inserted = true
      }
    } else {
      if (this.inserted) {
        this.ref = document.createComment('n-if')
        util.before(this.ref, this.template)
        util.remove(this.template)
        this.inserted = false
      }
    }
  }

  /**
   * 对于 n-if结点不能当成普通的结点来处理，更像是一个子实例
   * 所以我们将整个 n-if 结点当成是另外一个 MVVM实例
   */
  build (template) {
    const data = {}
    data.__proto__ = this.vm.data
    const childVM = new MVVM({
      template,
      parent: this.vm,
      data
    })
    util.after(childVM.rendered(), this.ref)
  }
}

export default IF