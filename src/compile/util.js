const C_IF = 'n-if', C_FOR = 'n-for'

export default  {
  C_IF,
  C_FOR,
  isDirective: (attr) => {
    return /^(n-|:|@)/.test(attr)
  },

  isString: (val) => {
    return val && typeof val === 'string'
  },

  isEventDirective (dir) {
    return /^@/.test(dir)
  },

  isElementNode: (node) => {
    return node.nodeType === Node.ELEMENT_NODE
  },

  isTextNode (node) {
    return node.nodeType === Node.TEXT_NODE
  },

  isFragmentNode (node) {
    return node.nodeType === Node.DOCUMENT_FRAGMENT_NODE
  },

  isRepeatNode (node) {
    return node.hasAttribute(C_FOR)
  },

  isIfNode (node) {
    return node.hasAttribute(C_IF)
  },

  isPriorityDirs (node) {
    return this.isRepeatNode(node) || this.isIfNode(node)
  },

  nodeToFragment (node) {
    const fragment = document.createDocumentFragment()
    let child
    // appendChild改变原dom结构特点
    // 逐步把dom元素节点移到fragment中
    while ((child = node.firstChild)) {
      fragment.appendChild(child)
    }

    return fragment
  },

  stringToNode (str) {
    // returns a HTMLDocument, which also is a Document.
    const parser = new DOMParser()
    const doc = parser.parseFromString(str, 'text/html')

    return doc.body.firstChild
  },

  /**
   * shim experimental API before
   * @param {Element} newNode 
   * @param {Element} refNode 
   */
  before (newNode, refNode) {
    if (refNode.before) {
      refNode.before(newNode)
    } else {
      refNode.parentNode.insertBefore(newNode, refNode)
    }
  },

  /**
   * shim experimental API after
   * @param {Element} newNode 
   * @param {Element} refNode 
   */
  after (newNode, refNode) {
    if (refNode.after) {
      refNode.after(newNode)
    } else {
      refNode.parentNode.insertBefore(newNode, refNode)
    }
  },

  /**
   * shim experimental API replaceWith
   * @param {Element} newNode 
   * @param {Element} oldNode 
   */
  replaceWith (newNode, oldNode) {
    if (oldNode.replaceWith) {
      oldNode.replaceWith(newNode)
    } else {
      oldNode.parentNode.replaceChild(newNode, oldNode)
    }
  },

  remove (node) {
    if (node.remove) {
      node.remove()
    } else {
      node.parentNode.removeChild(node)
    }
  },

  includes (arry, item) {
    if (arry.includes) {
      return arry.includes(item)
    } else {
      let flag = 0
      for (let i = 0; i < arry.length; i++) {
        if (arry[i] === item) {
          flag = 1
          break
        }
      }
      return flag 
    }
  }
}
