# HTML5-Web-App-Reader
# 基于HTML5 的移动端web 阅读器 #

基本功能类似于一些网站的小说页面  

技术 localStorage base 64 图片 icon  touch 事件

## 使用base64 格式的图片制作ICON ##
优势：

- 可以减少请求 把图片信息放到css里面，直接加载
- 加快首屏数据的显示速度

缺点：

- 维护不方便

HTML5 新增API
DOM 操作 querySelector
本地数据缓存
获取位置，事件等API

性能优化:
  减少repaint, reflow
  尽量缓存所有可以缓存的数据 cookie localStorage
  使用css3 transform 代替DOM 节点操作  animate.使用css
  不要给非static 元素加 动画transform
  适当使用硬件加速
移动端：
 轻量化 高性能 维护简单 高性能
原生 js 框架

开发过程：
1. 页面结构搭建, 主体结构，边栏，导航栏（目录，设置，夜间）
2. 交互 返回操作 翻页操作 设置字号和背景，同时记忆设置好的内容
  1. 触屏唤出上下边栏，上下边栏display：none




注意事项：
  1. 		 行内元素沿基线对齐，所以让图片居中用vertical-align 垂直对齐
          .bk_container{
  				position:relative;
  				width: 30px;
  				height: 30px;
  				border-radius: 15px;
  				background: #fff;
  				display: inline-block;
  				vertical-align: -14px;
