   # utilsJS-JavaScript
[![Learn-JavaScript](https://img.shields.io/badge/License-MIT-green)](https://github.com/LinkSofuny/Learn-JavaScript) [![Learn-JavaScript](https://img.shields.io/badge/free.css-v1.0-green)](https://github.com/LinkSofuny/Learn-JavaScript) [![Learn-JavaScript](https://img.shields.io/badge/utils.js-v1.1-green)](https://github.com/LinkSofuny/Learn-JavaScript) [![Learn-JavaScript](https://img.shields.io/badge/promise.js-v1.0-green)](https://github.com/LinkSofuny/Learn-JavaScript)

  
**这是个人搭建的一个工具库:**  
  
  这是我个人工具库, 实现方式效仿 JQuery 源码, 欢迎使用. 目前用于个人的小程序.

**本项目内容:**
  1. promise
  2. utils.js
  3. fress.css

## 背景
   为了日后能够极大地提高个人的开发效率, 以及满足我对优雅, 高复用, 高性能代码的追求, 我将把日常工作中的思考, 平时看源码找到的一些很好又有用的代码,抽离到个人库中.抽离一个单独的样式库,因为我意识到, 似乎工具类样式的预编译器(SCSS), 会影响性能, 这种做法, 可能会更好.

**本项目目的:**
  1. 抽离个人库
  2. 提高日后开发效率
  3. 完善个人开发思想, 提高编程能力.

## 展望
   1. 让utilsJS库能够上升到工作开发中.
   2. 提高free.css样式库的复用性(目前仅适用于uniapp)
   3. 重构free.css,基于AMCSS开发模式(类似于Bootstrap的做法)

## 使用
```
下载下来, 直接引入到html文件就可以了.
```
####


## 目录
### utils
#### 类型检测

1. **toType :** <br />
   数据类型检测, 在原生的基础上做了优化 可以检测所有类型,包括细分对象类型(正则,日期...),函数类型(构造函数...)
2. **isFunction:** <br />
   是否为一个函数
3. **isWindow:** <br />
   是否为一个 window 对象
4. **isArrayLike:** <br />
   是否为一个数组或类数组
5. **isPlainObject:** <br />
   是否为一个纯粹对象
6. **isEmptyObject:** <br />
   是否为一个空对象
7. **isNum:** <br />
   是否为一个数字

#### 实用函数

1. **debounce** <br />
   防抖:防止别人拼命触发函数
   ( 识别第一次, 或最后一次 )
2. **throttle** <br />
   节流: 被高频触发, 但是只按一定的频率响应
   ( 减少响应频次, 谷歌频次 5~7ms, IE10~17ms, 滚动事件或者输入事件)
3. **each** <br />
   遍历数组/类数组/对象(支持回调函数返回值处理: 返回 false 则结束循环)
   做了优化, 弃用 JQ 的 for..in 循环,
   对于对象,增加了对 Symbol 属性的处理
4. **clone** <br />
   深浅克隆全兼容, 兼容处理 symbol,bigInt, 日期对象, 构造函数的类型.

### free.css

> 看看库内的样式名就可以直接使用了, 十分简单

### 代码重构
1. Promise:
   由于promise是ES6以后的语法, 兼容性并不好, 所以遵循promiseA+规范,对Promise做了基本的重写, 完成了80%+以上的重构.
   promise.min.js: 压缩版本
   promise.js 非压缩


## 欢迎关注:
[掘金: 前端Link](https://juejin.cn/user/2005929448188567)  
## 微信公众号:
<img src="https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/de68be4aa82e414195f43b21144f1f9d~tplv-k3u1fbpfcp-watermark.image" width="300px"/>
### License
[MIT](www.baidu.com) © 2020 [Link]()