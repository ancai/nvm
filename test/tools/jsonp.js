let expando = 'jsonp'
let nonce = Date.now()
let rquery = (/\?/)
let domHead = document.head || document.getElementsByTagName('head')[0]

const JSONP_KEY = 'callback'
const SCRIPT_CHARSET = 'UTF-8'
const URL_SUFFIX = true

let serialize = obj => {
  let arry = []
  for (let k in obj) {
    let val = obj[k]
    if (val.constructor === Array) {
      for (let i = 0, len = val.length; i < len; i++) {
        arry.push(k + '=' + encodeURIComponent(val[i]))
      }
    } else {
      arry.push(k + '=' + encodeURIComponent(val))
    }
  }
  return arry.join('&')
}

// 专门处理 跨域的GET请求 jsonp option
//      jsonp 回调参数key 默认 callback
//      jsonpCallback 回调函数名  默认 动态的函数名
//      urlSuffix 请求的地址是否动态追加随机后缀 默认 true

export default (option, callback) => {
  let data = option.data
  let url = option.url
  let jsonpKey = option.jsonp || JSONP_KEY
  let script = document.createElement('script')
  let urlSuffix = option.urlSuffix === undefined ? URL_SUFFIX : option.urlSuffix
  let responseContainer
  option.jsonpCallback = option.jsonpCallback || expando + '_' + nonce++
  if (data) {
    data = (typeof data === 'object') ? serialize(data) : data
    url += (rquery.test(url) ? '&' : '?') + data
    data = null
  }
  url += (rquery.test(url) ? '&' : '?') + jsonpKey + '=' + option.jsonpCallback
  urlSuffix && (url += (rquery.test(url) ? '&' : '?') + '_=' + nonce++)
  script.src = url
  script.setAttribute('async', true)
  script.charset = option.scriptCharset || SCRIPT_CHARSET
  domHead.appendChild(script)
  window[option.jsonpCallback] = function () {
    responseContainer = arguments
  }

  // 释放 无用的变量，清理script DOM节点
  let free = () => {
    responseContainer = undefined
    // Handle memory leak in IE
    script.onload = script.onreadystatechange = null
    domHead.removeChild(script)
    // Dereference the script
    script = undefined
  }

  script.onload = script.onreadystatechange = function () {
    if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') {
      callback && callback(responseContainer && responseContainer[0])
      free()
    }
  }

  script.onerror = () => {
    callback(null)
    free()
  }
}
