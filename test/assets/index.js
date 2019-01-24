console.time('start')
console.log('start:', Date.now())
document.addEventListener('readystatechange', () => {
  if (document.readyState === 'interactive') init()
})
const map = {'<': '&lt;', '>': '&gt;', '"': '&quot;', '&': '&amp;'}
const init = () => {
  console.timeEnd('start')
  const wrap = document.getElementById('wrap')
  const demoList = window.dlist = wrap.querySelectorAll('.demo')
  demoList.forEach(demoNode => {
    demoNode.previousElementSibling.children[1].firstElementChild.innerHTML = demoNode.children[1].innerHTML.replace(/'#_/g, '\'#')
  })
  const markupList = wrap.querySelectorAll('code.language-markup')
  for (const markupNode of markupList) {
    markupNode.innerHTML = markupNode.innerHTML.replace(/[><"&]/g, match => map[match])
  }

  const scriptEle = document.createElement('script')
  scriptEle.setAttribute('src', 'assets/prism.js')
  document.body.appendChild(scriptEle)
}