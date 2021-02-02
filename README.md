# utilsJS-JavaScript

这是我个人常用的工具库, 实现方式效仿 JQuery 源码, 欢迎使用.

### 使用:

引入 untils.js \_.API 即可

### 类型检测

1. toType :
   数据类型检测, 在原生的基础上做了优化 可以检测所有类型,包括细分对象类型(正则,日期...),函数类型(构造函数...)
2. isFunction
   是否为一个函数
3. isWindow
   是否为一个 window 对象
4. isArrayLike
   是否为一个数组或类数组
5. isPlainObject
   是否为一个纯粹对象
6. isEmptyObject
   是否为一个空对象
7. isNum
   是否为一个数字

### 实用函数

1. debounce
   防抖:防止别人拼命触发函数
   ( 识别第一次, 或最后一次 )
2. throttle
   节流: 被高频触发, 但是只按一定的频率响应
   ( 减少响应频次, 谷歌频次 5~7ms, IE10~17ms, 滚动事件或者输入事件)
3. each
   遍历数组/类数组/对象(支持回调函数返回值处理: 返回 false 则结束循环)
   做了优化, 弃用 JQ 的 for..in 循环,
   对于对象,增加了对 Symbol 属性的处理
4. clone
   深浅克隆全兼容, 兼容处理 symbol,bigInt, 日期对象, 构造函数的类型.
