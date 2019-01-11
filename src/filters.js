// 视图内容过滤器
export default {
  /**
   * 控制字符串长度
   * @param {*} srcStr 
   * @param {*} len 截取前 len 个
   * @param {*} hasDot 是否显示省略符号(...)
   */
  strLen (srcStr = '', len, hasDot) {
    len = len * 2
    let tempStr = '',
      count = 0 // 预期计数：中文2字节，英文1字节
    for (let i = 0; i < srcStr.length; i++) {
      if (srcStr.charCodeAt(i) > 255) { // 按照预期计数增加2
        count += 2
      } else {
        count++
      }
      if (count >= len) {
        return hasDot ? tempStr + '...' : tempStr
      }
      // 将当前内容加到临时字符串
      tempStr += srcStr.charAt(i)
    }
    // 如果全部是单字节字符，就直接返回源字符串
    return srcStr
  }
}