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

// var initFonSize = 14
  // 页面初始化时从localStorage中读取字体大小，如果没有设为14


  var setFont = function(){
    let initFonSize = Utli.StorageGetter('font_size')
    if(!initFonSize){
      let  initFonSize = 14
    }
    log('字体大小', initFonSize)
    let initFonSize = parseInt(initFonSize)
    log('字体大小', typeof(initFonSize),initFonSize)

    //设置字体大小
    Dom.content_size.css('font-size', initFonSize)
    return initFonSize
  }
    setFont()
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

    //3.切换夜间模式
    $('#night_day').click(function(){
      // todo 触发背景切换
    })
    //4. 唤出目录
    $('.catalog').click(function(){

    })
    // 5.屏幕滚动
    Win.scroll(function(){
      Dom.top_nav.hide()
      Dom.bottom_nav.hide()
      Dom.setting_nav.hide()
      Dom.nav_pannel_bk.hide()
    })

    //6.切换字体和字号，保存信息到localStorage
    $('.font_size .large').click(function(){

      log('debug 6 增大字体 ', initFonSize)
      if(initFonSize >=  20){
        return
      }
      let initFonSize = initFonSize+1
      Dom.content_size.css('font-size', initFonSize)
      // 保存字号信息
      Utli.StorageSetter('font_size', initFonSize)
    })

    $('.font_size .small').click(function(){
      if(initFonSize <= 12){
        return
      }
      let initFonSize = initFonSize - 1
      log('debug 6 ', initFonSize)
      Dom.content_size.css('font-size', initFonSize)
      Utli.StorageSetter('font_size', initFonSize)
    })



  }


  // 5.整个项目的入口
  function main(){

    EventBind()
  }

  main()
}) ()
var a =1
var w  =function(element){
  var a = String(elem)
  console.log(a,typeof(a))
}
w()

_xsrf=xl64fTm3roa40r6HsgpGP5pFCwBG9WQI; _zap=645278fa-617b-46b1-a776-e3f7b74e232e; d_c0="AFAkoLZFKw6PTvjggo2fc-75Ajgo_gnr5J4=|1536202124"; capsion_ticket="2|1:0|10:1536203383|14:capsion_ticket|44:NGJmOWY3YzIwOTdkNDMyM2FhYzI2YzJjNTEwODVkOGE=|d015769ad3fb1d5428a49ae03b537c5a6e463a587efe94e0bd56a7eaf9e6cef7"; z_c0="2|1:0|10:1536203416|4:z_c0|92:Mi4xTWt4Y0FBQUFBQUFBVUNTZ3RrVXJEaWNBQUFDRUFsVk5tQ2U0V3dDT0tuazNGNHR0TVlNWVVEdzFNYXNWOXNqUHN3|fff0672029582a7e92f262a384e23d9ce2345cc4af4a4fad53ed52269b2d37f9"; q_c1=662d031b03174b6896b7a202439f2b62|1536203416000|1536203416000; tgw_l7_route=69f52e0ac392bb43ffb22fc18a173ee6; __utma=51854390.812466593.1538387213.1538387213.1538387213.1; __utmb=51854390.0.10.1538387213; __utmc=51854390; __utmz=51854390.1538387213.1.1.utmcsr=zhihu.com|utmccn=(referral)|utmcmd=referral|utmcct=/question/62884618/answer/251369014; __utmv=51854390.110-1|2=registration_date=20140520=1^3=entry_date=20140520=1
