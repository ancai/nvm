/**
 * 循环解析器
 */
import MVVM from '../index'
import util from './util'

class FOR {
  constructor (node, vm) {
    this.ref = document.createComment('n-for')
    this.template = node.cloneNode(true)
    this.vm = vm
    this.forVM = new Map()
    this.data = []
    util.replaceWith(this.ref, node)
  }

  update (data, dataKeys) {
    if (data && Array.isArray(data)) {
      this.diff(data, dataKeys)
    }
  }

  /**
   * 对比旧实例，以便复用，提升性能
   * @param {*} data 
   * @param {*} oldChildVM 
   */
  diff (data, dataKeys) {
    let targetNext = this.ref
    data.forEach((item, i) => {
      if (this.forVM.has(item)) {
        setTimeout(() => this.forVM.get(item).data[dataKeys[1]] = i)
      } else {
        this.build(item, i, dataKeys, targetNext)
      }

      if (!(targetNext = targetNext.nextElementSibling)) {
        targetNext = this.ref
      }
    })

    this.removeInvalid(data)
  }

  build (dataItem, index, dataKeys, targetNext) {
    const [key, key2] = dataKeys
    const data = {
      [key]: dataItem,
      [key2]: index
    }
    data.__proto__ = this.vm.data
    const itemVM = new MVVM({
      template: this.template.cloneNode(true),
      parent: this.vm,
      data,
      _cache: dataItem
    })
    util.after(itemVM.rendered(), targetNext)
    this.forVM.set(dataItem, itemVM)
  }

  removeInvalid (data) {
    const oldData = this.data
    let flag = true
    if (data && oldData) {
      this.data = oldData.filter(item => {
        if (!util.includes(data, item)) {
          if (this.forVM.has(item)) {
            const validVm = this.forVM.get(item)
            util.remove(validVm.template)
            this.forVM.delete(item)
          }
          flag = false
        }
        return flag
      })
      this.data.length = 0
      data.forEach(item => this.data.push(item))
    }
  }
}

export default FOR
