document.onreadystatechange = () => {
  if (document.readyState === 'interactive') init()
}
const map = {'<': '&lt;', '>': '&gt;', '"': '&quot;', '&': '&amp;'}
const init = () => {
  const wrap = document.getElementById('wrap')
  const demoList = window.dlist = wrap.querySelectorAll('.demo')
  demoList.forEach(demoNode => {
    demoNode.previousElementSibling.children[0].firstElementChild.innerHTML = demoNode.innerHTML.replace(/[><"&]/g, match => map[match])
  })
  window.Prism.highlightAll() // code highlight
}