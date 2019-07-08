import directives from './directives'
import util from './util'

const {
  C_IF,
  C_FOR,
  isElementNode,
  isString,
  nodeToFragment,
  isDirective,
  isEventDirective,
  isTextNode,
  isRepeatNode,
  isIfNode,
  stringToNode
} = util

class Compile {
  constructor (vm) {
    this.vm = vm
    this.fragment = null
    if (vm.el) {
      // 首次全部解析
      this.init(vm.el, vm.template)
    } else { // 局部更新
      this.localProc(vm.template)
    }
  }

  init (el, template) {
    let fragment
    if (isString(el)) {
      el = document.querySelector(el)
    }
    if (!template) {
      fragment = template = nodeToFragment(el)
    }
    if (isString(template)) {
      fragment = stringToNode(template)
    }
    if (isElementNode(template)) {
      fragment = nodeToFragment(template)
    }
    this.compileElement(fragment)
    el.appendChild(fragment)
    this.fragment = fragment
  }

  localProc (template) {
    let fragment = document.createDocumentFragment()
    if (isString(template)) {
      template = stringToNode(template)
    }
    if (isElementNode(template)) {
      fragment.appendChild(template)
    }
    this.fragment = fragment
    this.compileElement(fragment)
  }

  compileElement (fragment) {
    const childNodes = fragment.childNodes
    Array.from(childNodes).forEach(node => {
      if (isElementNode(node)) {
        if (isRepeatNode(node)) {
          this.compileRepeat(node)
        } else if (isIfNode(node)) {
          this.compileIf(node)
        } else {
          this.compile(node)
          if (node.hasChildNodes()) {
            this.compileElement(node)
          }
        }
      } else if (isTextNode(node)) {
        // this.compileText(node)
        directives.bind('text', node, this.vm)
      }
    })
  }

  compile (node) {
    const nodeAttrs = node.attributes
    Array.from(nodeAttrs).forEach(attr => {
      const attrName = attr.name
      if (isDirective(attrName)) {
        const exp = attr.value
        const dir = attrName.substring(/^(@|:)/.test(attrName) ? 1 : 2)
        if (isEventDirective(attrName)) { // 事件指令
          directives.eventBind(dir, node, this.vm, exp)
        } else { // 普通指令
          directives.bind(dir, node, this.vm, exp)
        }
        node.removeAttribute(attrName)
      }
    })
  }

  compileText (node) {
    directives.text(node, this.vm)
  }

  compileRepeat (node) {
    const exp = node.getAttribute(C_FOR)
    node.removeAttribute(C_FOR)
    directives.bind('n_for', node, this.vm, exp)
  }

  compileIf (node) {
    const exp = node.getAttribute(C_IF)
    node.removeAttribute(C_IF)
    directives.bind('n_if', node, this.vm, exp)
  }

}

export default Compile
