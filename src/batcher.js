// 批量执行watcher
class Batcher {
  constructor () {
    this.queue = []
    this.reset()
  }

  reset () {
    this.has = {}
    this.queue.length = 0
    this.waiting = false
  }

  // 加入执行队列，空闲时批量更新所有订阅实例
  push (job) {
    if (!this.has[job.id]) {
      this.queue.push(job)
      this.has[job.id] = 1
      if (!this.waiting) {
        this.waiting = true
        setTimeout(() => this.flush(), 1)
      }
    }
  }

  flush () {
    this.queue.forEach(job => {
      job.run() // 实际调用 Watcher 实例的 run方法
    })
    this.reset()
  }
}

export default Batcher