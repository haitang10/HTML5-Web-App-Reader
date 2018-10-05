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

        // 通过jsonp请求数据并解码，方法见Utli,得到放数据用回调函数处理
        var getBSONP = function(url,callback){
            return $.jsonp({
                url: url,
                cache: true,
                callback: 'duokan_fiction_chapter',
                success: function(result){
                    //得到的数据要进行解码
                    var data = $.base64.decode(result);
                    var json = decodeURIComponent(escape(data))
                    callback(json)
                    // console.log('data and json',typeof(data),typeof(json),json)
                }
            })
        }

        return {
            getBSONP: getBSONP,
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
  var readerModel
  var readerUI
  var Win = $(window)
  var Doc = $(document)
  var RootContainer = $('#fiction_container')
  var catalog = $('#catalog')
  var cataButton = $('#button_catalog')
  //5.页面初始化时从localStorage中读取字体大小，如果没有设为14,//这里需要一个全局变量，并且在点击增大减小按钮时都要修改其值
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
  if(container_id){

        bk_container.dataset.active = container_id.slice(-1)
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
  //1.先通过ajax得到章节列表信息，2.通过回调函数根据id获得章节内容地址，地址有jsonp字段，值为地址，3.再通过jsonp获得章节内容
  function ReaderModel(){
      let Chapter_id
      let Chapter_total
      var init = function(UIcallback){
            getFictionInfo(function(){
                getCurChapterContent(Chapter_id, function(data){
                    // todo 得到章节内容数据后渲染页面
                    UIcallback && UIcallback(data)
                })

            })

        }


      // 1,，获得章节列表信息,通过ajax，回调函数就是下面的getCurChaptercontent
      var getFictionInfo = function(callback){
          $.get('data/chapter.json',function(data){
              console.log('data 10',typeof(data),data)
              //todo 获得章节列表信息之后的回调
              Chapter_id = Utli.StorageGetter('last_chapter_id')
              if(Chapter_id == null){
                  Chapter_id = data.chapters[1].chapter_id
              }

              Chapter_total = data.chapters.length
              callback &&callback() // 这个callback 就是下面的getCurChaptercontent
          },'json')

      }

      //2,发送ajax请求获得章节内容地址后，发送jsonp请求获取某个特定章节内容，得到的内容是base64格式需要解码
      var getCurChapterContent = function(chapter_id,callback){

          $.get('data/data'+chapter_id + '.json',function(data){
                console.log('data 1',data)
              if(data.result == 0){
                  var url = data.jsonp //地址有jsonp字段，值为地址
                  // 通过jsonp请求数据并解码，方法见Utli,得到数据用回调函数处理
                  // 这里的data是发送请求之后得到的响应数据也就是解码后的json数据
                  Utli.getBSONP(url,function(data){
                      // log('data 3',data)
                      // log('data 4',typeof(data),data,JSON.parse(data))
                      //回调函数渲染UI结构
                      callback && callback(data)
                  })
              }
          },'json')
      }

      //3.实现上下翻页,章节id存储localStorage
      var preChapter = function(UIcallback){
          Chapter_id = parseInt(Chapter_id, 10)
          if(Chapter_id == 1){
              return
          }
          Chapter_id -= 1
          getCurChapterContent(Chapter_id, UIcallback)
          Utli.StorageSetter('last_chapter_id', Chapter_id)
      }
      //4.下翻页
      var nextChapter = function(UIcallback){
          Chapter_id = parseInt(Chapter_id, 10)
          if(Chapter_id == parseInt(Chapter_total)){
              return
          }
           Chapter_id += 1
          getCurChapterContent(Chapter_id, UIcallback)
          Utli.StorageSetter('last_chapter_id', Chapter_id)
      }



      return {
            init: init,
            preChapter: preChapter,
            nextChapter: nextChapter,
            getChapterList: getChapterList,

        }
  }

  //3. todo 渲染基本的UI结构
  function ReaderBaserFrame(container){
      function parseChapterData(jsonData){
          // log('jsondata',jsonData)
          var jsonObj = JSON.parse(jsonData)
          log('UI 结构', jsonObj)
          var html = `<h4>${jsonObj.t}</h4>`
          for(var i = 0;i < jsonObj.p.length;i++){
              html = html + `<p>${jsonObj.p[i]}</p>`
          }
          return html
      }
      //解析完数据插入到container中
      return function(data){
          container.html(parseChapterData(data))
      }
  }

  function ReaderChapterList(container){
      function parseChapterData(jsonData){
          log('debug 目录列表 jsonData',typeof(jsonData),jsonData)
          var jsonObj = jsonData.chapters
          log('debug 目录列表 jsonObj', jsonObj)
          var html = ''
          for(var i = 0; i < jsonObj.length; i++){
              var html = html + `<p>${jsonObj[i].title}</p>`
              log(html)
          }
          return html
      }
      //解析完数据插入到container中
      return function(data){
          container.html(parseChapterData(data))
      }
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
            catalog.hide()
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
        catalog.scroll(function(){

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
          if(event.target.id) {

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
          }

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

        //8. 点击上一章下一章切换
        $('#pre_button').click(function(){
            //todo 获取上一章数据，进行渲染
            readerModel.preChapter(function(data){
                readerUI(data)
            })
        })
        $('#next_button').click(function(){
            readerModel.nextChapter(function(data){
                readerUI(data)
            })

        })

        //9. 点击目录唤出目录
        $('#button_catalog').click(function(){
            console.log('debug 1000')
            if(catalog.css('display') == 'none'){
              catalog.show()

            }
            else {
            }
        })



  }



  // 5.整个项目的入口
  function main(){
    EventBind()
    readerModel = ReaderModel()
    readerUI = ReaderBaserFrame(RootContainer)
    readerModel.init(function(data){
        // log('dubug 5', data)
        readerUI(data)

    })
    var ReaderListUI = ReaderChapterList(catalog)
    readerModel.getChapterList(function(data){
        //todo 渲染章节列表

        ReaderListUI(data)
    })
  }

  main()



}) ()


var a = 1
var f1 = function(ele){
    if(ele > 1){
        ele = 2
    }
    console.log(ele)
}
f1(a)
