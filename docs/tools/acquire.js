export default {
  get (url, params = {}) {
    url += (/\?/.test(url) ? '&' : '?') + Object.keys(params)
      .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
      .join('&')
    return fetch(url, {
      method: 'GET',
      credentials: 'include',
      mode: 'cors'
    })
      .then(response => response.json())
  },

  post (url, data) {
    return fetch(url, {  
      method: 'POST',
      credentials: 'include',
      mode: 'cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
  }
}