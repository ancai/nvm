# nvm
a mini front-end MVVM framework

## 简介
通过手动实现一个简单框架雏形，理解当前主流前端框架背后的原理。
1. 支持特性：数据源、过滤器、事件、多实例、局部刷新、无依赖
2. 参考Vue的原理，使用最新ES6/7 api，模板语法上 实现了vue指令的一个子集
3. 支持的指令：n-mode|n-show|n-hide|n-text|n-if|n-for|n-class等
4. 简洁、轻量、高效、小巧(打包后十几K)

![架构图](architecture.png "架构图")

本项目使用webpack构建，下载代码后，按照下面的步骤，可在本地运行示例
``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# visit http://localhost:8080/ in browser
```
## 示例

[用法说明](https://ancai.github.io/nvm/guide.html)
