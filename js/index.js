// 模仿块级作用域，用匿名函数构建闭包，不影响全局

(function(){

  //1. 存储and获取数据,又是一个闭包，把变量隐藏起来，只暴露两个方法
  // StorageGetter and StorageSetter
  var Utli = (function(){
    // 因为localStorage 是浏览器公用的，为避免导致错误，所以加上html5_Reader 表明是这个demo的数据
    var prefix = 'html5_reader_'
    var StorageGetter = function(key) {
      return localStorage.getItem(prefix + key)
    }
    var StorageSetter = function(key, value) {
      return localStorage.setItem(prefix + key, value)
    }
    return {
      StorageGetter: StorageGetter,
      StorageSetter: StorageSetter
    }
  })()
  var Dom = {
      top_nav: $('.top_nav'),
      bottom_nav: $('.bottom_nav'),
      action_mid: $('.artical_action_mid'),
      night_day_switch_button: $('#night_day'),
      setting_nav: $('.setting_nav'),
      nav_pannel_bk: $('.nav-pannel-bk'),
      content_size: $('.content')

      // top_nav: w('.top_nav'),
      // bottom_nav: w('.bottom_nav'),

  }
  // 设置一些常亮
  var Win = $(window)
  var Doc = $(document)

  // 5.页面初始化时从localStorage中读取字体大小，如果没有设为14,
  //这里需要一个全局变量，并且在点击增大减小按钮时都要修改其值
  var initFonSize = Utli.StorageGetter('font_size')
  if(!initFonSize){
    initFonSize = 14
  }
  initFonSize = parseInt(initFonSize)
  //设置字体大小
  log('字体大小', Utli.StorageGetter('font_size'))
  Dom.content_size.css('font-size', initFonSize)

  // 6.页面初始化时要从localStorage中读取背景颜色信息
  var container_id = Utli.StorageGetter('bk_id')
  var bk_container = w('.background')
  log(container_id)
  if(container_id){
    var id = container_id.slice(-1)
    bk_container.dataset.active = id
    var click_bk = $(`#${container_id}`).css('background')
    $('.fiction.content').css('background', click_bk)

    //q切换背景时，给当前背景加小圆圈，并清除之前的小圆圈
    removeClassAll('bk_container_current')
    var selector = `#${container_id}`+'>div'
    log(selector)
    var div = w(selector)
    div.classList.add('bk_container_current')
  }
    contaienr_id = 'bk_container_0'
  //2.实现和阅读器相关的数据交互的方法
  function ReaderModel(){

  }
  //3. todo 渲染基本的UI结构
  function ReaderBaserFrame(){

  }
  // 4.todo 交互事件绑定
  function EventBind(){
    // 1.轻触屏幕唤出边栏，增加结构,如果边栏被隐藏就显示，显示就隐藏
    // 两种方式，用zepto 库和原生js 原理一样，就是写法不同而已。
    //注意jquery库无法添加addEventListener
    // var touchMid = function() {
    //   log('debug 1, 轻触屏幕中央唤出边栏')
    //   w('#action_mid').addEventListener('click', function(){
    //     if(Dom.top_nav.css('display') == 'none'){
    //       Dom.top_nav.show()
    //       Dom.bottom_nav.show()
    //     }
    //     else {
    //       Dom.top_nav.hide()
    //       Dom.bottom_nav.hide()
    //     }
    //   })
    // }
    // touchMid()
    $('#action_mid').click(function(){
        console.log('debug1 轻触屏幕中央唤出边栏')
        if(Dom.top_nav.css('display') == 'none'){
          Dom.top_nav.show()
          Dom.bottom_nav.show()
        }
        else {
          Dom.top_nav.hide()
          Dom.bottom_nav.hide()
          Dom.setting_nav.hide()
          Dom.nav_pannel_bk.hide()
        }

      })

    //2. 唤出设置字体大小和背景
    $('.setting').click(function(){
      console.log('debug2 轻触设置按钮唤出设置页面')
      if(Dom.setting_nav.css('display') == 'none'){
        Dom.setting_nav.show()
        Dom.nav_pannel_bk.show()
      }
      else {
        Dom.setting_nav.hide()
        Dom.nav_pannel_bk.hide()
      }
    })

    //3. 唤出目录
    $('.catalog').click(function(){

    })

    // 4.屏幕滚动
    Win.scroll(function(){
      Dom.top_nav.hide()
      Dom.bottom_nav.hide()
      Dom.setting_nav.hide()
      Dom.nav_pannel_bk.hide()
    })

    //5.切换字体和字号，保存信息到localStorage,这里需要一个全局变量，时刻对其时刻进行更改
    $('.font_size .large').click(function(){
      log('debug 6,增大字体')
      log('debug 6 ', initFonSize)
      if(initFonSize >=  20){
        return
      }
      initFonSize += 1
      Dom.content_size.css('font-size', initFonSize)
      // 保存字号信息
      Utli.StorageSetter('font_size', initFonSize)
    })

    $('.font_size .small').click(function(){
      if(initFonSize <= 12){
        return
      }
      initFonSize -= 1
      Dom.content_size.css('font-size', initFonSize)
      Utli.StorageSetter('font_size', initFonSize)
    })

    //6. 切换背景，就是一个轮播图
    var bk_container = w('.background')
    bk_container.addEventListener('click', function(event){
      var container_id = event.target.id
      var id = container_id.slice(-1)
      // 更改data-active 值
      bk_container.dataset.active = id

      // 切换背景
      var click_bk = $(`#${container_id}`).css('background')
      $('.fiction.content').css('background', click_bk)

      //q切换背景时，给当前背景加小圆圈，并清除之前的小圆圈
      removeClassAll('bk_container_current')
      var selector = `#${container_id}`+'>div'
      log(selector)
      var div = w(selector)
      div.classList.add('bk_container_current')
      // 存储到localStorage 里面
      Utli.StorageSetter('bk_id', container_id)


    })

    //7.切换夜间模式
    $('#night_day').click(function(){
      // todo 触发背景切换
      var container_id = 'bk_container_5'
      var id = container_id.slice(-1)
      // 更改data-active 值
      bk_container.dataset.active = id

      // 切换背景
      var click_bk = $(`#${container_id}`).css('background')
      $('.fiction.content').css('background', click_bk)

      //q切换背景时，给当前背景加小圆圈，并清除之前的小圆圈
      removeClassAll('bk_container_current')
      var div = w(`#${container_id}  div`)
      div.classList.add('bk_container_current')
      // 存储到localStorage 里面
      Utli.StorageSetter('bk_id', container_id)
      })

  }


    //7.切换日间模式

  // 5.整个项目的入口
  function main(){
    EventBind()
  }

  main()
}) ()
