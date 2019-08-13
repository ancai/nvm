import Watcher from '../watcher'
import parser from './parser'
import IF from './if'
import FOR from './for'
import getVal, {setVal} from '../value'

// 指令解析 初始化
const tagRE = /\{\{((?:.|\n)+?)\}\}/g
const dirs = {
  text (node, vm) {
    const rawCnt = node.textContent
    let match, index, lastIndex
    let exp
    tagRE.lastIndex = lastIndex = 0
    while ((match = tagRE.exec(rawCnt))) {
      index = match.index
      if (index >= lastIndex) {
        exp = match[1].trim()
      }
      lastIndex = index + match[0].length
      link(node, vm, exp, 'text')
    }
  },

  // if 指令初始化，生成对应的 Watcher 实例
  n_if (node, vm, exp) {
    const cif = new IF(node, vm)
    cif.update(getter(vm, exp))
    new Watcher(vm, exp, () => cif.update(getter(vm, exp)))
  },

  // for 指令初始化，生成对应的 Watcher 实例
  n_for (node, vm, exp) {
    const cfor = new FOR(node, vm)
    const [keyExp, listExp] = exp.split(/ in /).map(item => item.trim())
    const dataKeys = /\((\w+),\s?(\w+)\)/g.test(keyExp) ? [RegExp.$1, RegExp.$2] : [keyExp || 'item', 'index']

    cfor.update(getter(vm, listExp), dataKeys)
    new Watcher(vm, listExp, () => cfor.update(getter(vm, listExp), dataKeys))
  },

  // n-model 的简单实现，表单项变化 关联到数据
  model (node, vm, exp) {
    link(node, vm, exp, 'model')
    const fn = evt => {
      const oldVal = getter(vm, exp),
        newVal = evt.target.value
      if (oldVal !== newVal) {
        setter(vm, exp, newVal)
      }
    }
    if (node.tagName === 'INPUT' && node.type === 'text' || node.tagName === 'TEXTAREA') {
      node.addEventListener('input', fn)
    }
    if (node.tagName === 'INPUT' && node.type === 'radio') {
      node.addEventListener('change', evt => {
        if (evt.target.checked) {
          fn(evt)
        }
      })
    }
    if (node.tagName === 'INPUT' && node.type === 'checkbox') {
      node.addEventListener('change', evt => {
        const val = getter(vm, exp)
        if (typeof val === 'boolean') {
          setter(vm, exp, node.checked)
        }
        if (Array.isArray(val)) {
          if (node.checked) {
            val.push(node.value)
          } else {
            val.splice(val.indexOf(node.value), 1)
          }
        }
      })
    }
    if (node.tagName === 'SELECT') {
      node.addEventListener('change', evt => {
        const val = getter(vm, exp)
        if (typeof val === 'string') {
          setter(vm, exp, node.value)
        }
        if (Array.isArray(val)) {
          val.splice(0, val.length, ...Array.from(node.selectedOptions).map(optionNode => optionNode.value))
        }
      })
    }
  },

  // 样式类指令
  class (node, vm, exp) {
    const parserFn = parser('class')
    exp.replace(/{|}|'/g, '').split(/,/).forEach(item => {
      const [clazz, val] = item.split(':').map(item => item.trim())
      parserFn(node, getter(vm, val), clazz)

      val.split(/[<>&&!||]/).forEach(item => {
        const mark = item.trim()
        if (mark && /[^\d]/.test(mark)) {
          new Watcher(vm, mark, () => {
            parserFn(node, getter(vm, val), clazz)
          })
        }
      })
    })
  }
}

// 链接到指令解析器
const link = (node, vm, exp, dir) => {
  const parserFn = parser(dir), compositeReg = /{{(\w+?)}}/g
  if (node.nodeType === Element.ELEMENT_NODE) {
    node._originalDisplay = node.style.display
  }

  if (compositeReg.test(exp)) {
    // multiple directive property
    // for instance, :style="background-color: {{bgColor}};border: solid {{borderWidth}}px black;"
    const data = {}
    const compositeValue = exp.replace(compositeReg, (match, p1) => data[p1] = getter(vm, p1))
    parserFn(node, compositeValue, {exp, dir})
    let result
    while ((result = compositeReg.exec(exp)) != null) {
      const [match, key] = result
      new Watcher(vm, key, (newVal, oldVal) => {
        data[key] = newVal
        const compositeValue = exp.replace(compositeReg, (match, p1) => data[p1])
        parserFn(node, compositeValue, {exp:key, oldVal, dir})
      })
    }
  } else {
    const value = getter(vm, exp)
    parserFn(node, value, {exp, dir})
    new Watcher(vm, exp, (newVal, oldVal) => parserFn(node, newVal, {exp, oldVal, dir}))
  }
}

const getter = (vm, exp) => (getVal(exp))(vm)
const setter = (vm, exp, newVal) => (setVal(exp))(vm, newVal)

/**
 * 普通指令数据绑定
 * @param {*} dir 指令
 * @param {*} node 模板DOM结点
 * @param {*} vm VM实例
 * @param {*} exp 表达式
 */
const bind = (dir, node, vm, exp) => {
  if (dirs[dir]) {
    dirs[dir](node, vm, exp)
  } else {
    link(node, vm, exp, dir)
  }
}

/**
 * 事件指令绑定
 */
const eventBind = (dir, node, vm, exp) => {
  let name = exp, params
  if (/^(\w+)(\((.*)\))?$/.test(exp)) {
    name = RegExp.$1
    params = RegExp.$3
  }
  let eventType = dir, fn = vm.listener[name]
  
  if (eventType) {
    if (!fn) {
      fn = new Function('this.' + exp)
    }
    node.addEventListener(eventType, (event) => {
      let args = []
      // 如果事件处理函数，含有参数
      if (params) {
        args = params.split(/,/).map(item => {
          let value = vm.data[item.trim()]
          if (value === undefined) {
            value = item.trim()
          }
          return value
        })
      }
      args.push(event)
      fn.bind(vm, ...args)()
    }, false)
  }
}

export default {
  bind,
  eventBind
}
