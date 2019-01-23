const regArithmetic = /([+\-*!><]|[&|]{2}|={2,3})+/
const regVariable = /^[a-zA-Z_][0-9.]*/i

// 获得属性的访问路径
const accessPath = exp => {
  let ancestor, end
  if (/^([\w.]+)\.(\w+)$/.test(exp)) {
    ancestor = RegExp.$1
    end = RegExp.$2
  } else {
    ancestor = ''
    end = exp
  }
  return {ancestor, end}
}

/**
 * 获得表达式的值
 * 数据代理 实现 obj.xxx -> vm.data.xxx
 * @param {*} exp 指令表达式
 */
const getVal = (exp) => {
  let flt, params, vexp, args
  let code = 'if (obj) { let val; '

  if (/([\w.]+)\s+\|\s+(\w+)(\((.*)\))?/.test(exp)) {
    vexp = RegExp.$1 // 真实表达式部分
    flt = RegExp.$2 // 过滤器名称
    params = RegExp.$4 // 过滤器参数
  }
  if (flt) { // 包含过滤器
    if (params) {
      args = `obj.data.${vexp}, ${params}`
    } else {
      args = `obj.data.${vexp || exp}`
    }
    code += `val = obj.filters.${flt}(${args});`
  } else if (regArithmetic.test(exp)) { // 包含复合运算
    code += 'val = '
    exp.split(regArithmetic).forEach(item => {
      const mark = item.trim()
      if (regVariable.test(mark)) {
        code += 'obj.'
      }
      code += mark
    })
    code += ';'
  } else { // 常规取值
    code += `val = obj.${exp};`
    let {ancestor, end} = accessPath(vexp || exp)
    if (ancestor) {
      ancestor = '.' + ancestor
    }
    code += `if (obj.${vexp || exp} === undefined) { obj.observe(obj${ancestor}, '${end}') };`
  }
  code += 'return val; }'

  return (new Function('obj', code))
}

/**
 * 设置表达式的值
 * @param {*} exp 指令表达式
 */
export const setVal = (exp) => {
  return (new Function('obj', 'val', `obj.${exp} = val`))
}

export default getVal