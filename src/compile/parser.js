// 指令解析器，更新视图数据
const validVal = value => {
  return value !== undefined ? value : ''
}

let cache = {}, uid = 0
const parser = {
  text (node, value, {exp}) {
    let data, token = exp
    if (!node._uid) {
      node._uid = ++uid
      cache[uid] = data = {
        tokens: {[token]: value},
        template: node.textContent
      }
    } else {
      data = cache[node._uid]
      data.tokens[token] = value
    }
    let str =  data.template, val
    Reflect.ownKeys(data.tokens).forEach(key => {
      val = data.tokens[key]
      if (val === undefined || val === null) {
        val = ''
      }
      str = str.replace(`{{${key}}}`, val)
    })
    node.textContent = str
  },

  html (node, value) {
    node.innerHTML = validVal(value)
  },

  class (node, value, clazz) {
    if (value) {
      node.classList.add(clazz)
    } else {
      node.classList.remove(clazz)
    }
  },

  model (node, value) {
    node.value = value
  },

  hide (node, value) {
    node.style.display = value ? 'none' : node._originalDisplay
  },

  show (node, value) {
    node.style.display = value ? node._originalDisplay : 'none'
  }

}

const attr = (node, value, {dir: property}) => {
  node.setAttribute(property, value)
}

export default dir => {
  return parser[dir] || attr
}