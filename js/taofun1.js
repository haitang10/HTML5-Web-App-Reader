

var log = function() {
  console.log.apply(console, arguments)
}
// 选择元素和绑定事件分开
// 用w 代替  其中selector 是元素的id或标签名或class
var w = function(selector) {
  return document.querySelector(selector)
}
// wAll 函数返回一个元素集合
var wAll = function(selecter) {
  return document.querySelectorAll(selecter)
}

// find 函数可以查找element元素的子节点
var find = function(element, selector) {
  return element.querySelector(selector)
}
var bindEvent = function(element, event, callback) {
  element.addEventListener(event, callback)
}

// 给所有按钮绑定事件
//先选择所有gua-menu-toggle
var bindAll = function(elements, event, callback) {
  for (var i = 0; i < elements.length; i++) {
    var a = elements[i]
    a.addEventListener(event, callback)
  }
}

// 删除添加某个属性可以直接用element.classList.add() remove()
// 有几种情况1，直接删除，2，检查是否已经删除，3，删除所有符合条件的
var deleteClass = function(element, className) {
  //检查元素是否有某个class,if exist delete
  if (element.classList.contains(className)) {
    element.classList.remove(className)
  }
}
// 检查元素是否存在某个元素，如果不存在就添加
var addClass = function(element, className) {
  if (element.classList.contains(className)) {

  } else {
    // if not exist then add
    element.classList.add(className)
  }
}


// toggleClass 这个函数用来给元素开关某一个class
var toggleClass = function(element, className) {
  //检查元素是否有某个class,if exist delete
  if (element.classList.contains(className)) {
    element.classList.remove(className)
  } else {
    // if not exist then add
    element.classList.add(className)
  }
}


// removeClassAll 可以删除所有指定的class,接受class参数，不加.
// 要注意一点，querySelectorAll() 接受参数是.gua-slide-active
// 而element.classList.remove() 接受'gua-slide-active' 没有.
var removeClassAll = function(selector) {
  var new_selector = '.' +selector
  var elements = document.querySelectorAll(new_selector)
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i]
    element.classList.remove(selector)
  }

}

// addClassAll 函数通过查找id，添加指定class,
//selector 为完整选择器，#gua-slide, new_class 为字符串
var addClassAll = function(selector, new_class) {
  log('addClassAll')
  var elements = document.querySelectorAll(selector)
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i]
    element.classList.add(new_class)
  }
}


// 构建函数 插入todo-cell 到 container中,
//todoValue 是标签中文本内容，doneStatus为done的状态
var insertodos = function(todoValue, doneStatus) {
    log('内容', todoValue, doneStatus)
    var todoContainer = w('#id-div-container')
    var t = templateTodo(todoValue, doneStatus)
    appendHtml(todoContainer,t)
}


// 构建函数用来创建含有文本输入值的div-todo-cell
var templateTodo = function(todoValue, doneStatus) {
  // 如果doneStatus为 true，则给todo-cell，加上done这个class
  var status = 'false'
  if(doneStatus) {
    status = 'done'
    log('status',status)
  }
  // 构建含有 todoValue 的div
  var t = `
  <div class='todo-cell ${status}'>
      <button class='todo-done'>完成</button>
      <button class='todo-delete'>删除</button>
      <span class='todo-content' contenteditable='true'>${todoValue}</span>
  </div>
  `
  return t
}

var appendHtml = function(element, html) {
  element.insertAdjacentHTML('beforeend', html)
}


// 定义一个函数，把数组写入localStorage.todos
var write = function(array) {
  var s = JSON.stringify(array)
  localStorage.todos = s
  log('localStorage.todos', typeof s, s)

}

// 定义一个函数，读取localStorage的数据并解析返回
var read = function() {
  var s = localStorage.todos
  return JSON.parse(s)
}

// 定义writeTodos函数，在add 和delete 时把页面上所有的todo写入localStorage
// 在点击完成时把done 这个class也存入localStorage
// 在之前的writetodos中不仅要保存文本还要保存done 这个class

// 1,选出所有的content 标签，
// 2,取出todo，即输入框中的内容
// 3,添加到数组中
// 4,写入数组到本地存储
// contents 是一个含有很多标签的数组

var writeTodos = function() {
  log('writeTodos')
  var contents = document.querySelectorAll('.todo-content')
  var todoArray = []
  for (var i = 0; i < contents.length; i++) {
    var addContent = contents[i]
    // addContent 是含有输入文本的标签
    // doneStatus 用来判断addContent的父级元素（div-todo-cell）有没有done 这个class,即有没有被点击完成按钮
    // 如果被点击完成按钮就会有done 这个class，则 doneStatus 为TRUE，否则为false
    // 取出span标签中文本,和done 状态存入todo
    var doneStatus = addContent.parentElement.classList.contains('done')
    var todo = {
      status: doneStatus ,
      content: addContent.innerHTML
    }
    todoArray.push(todo)
  }
  log(todoArray)
  // 写入数组到本地存储
  write(todoArray)
}

// 读取localStorage存入的信息并添加到页面中
// todos 是一个包含输入文本的数组
var readTodos = function() {
  var todos = read()
  log('readTodos',todos)
  //现在只是读取localStorage，还没有添加到页面中，
  //所以要从todos 提取文本,构成元素，添加到页面中
  // 不仅添加todo content 还要添加 done的状态，看看是否点击了完成按钮
  // 即父元素是否含有 done 这个class ，有为true，没有 false
  for (var i = 0; i < todos.length; i++) {
    var todo = todos[i]
    log('todo含有哪些东西', todo)

    insertodos(todo.content, todo.status)
  }
}

// 在页面中展示todolist
var show_todoList = function() {
  var todos = read()
  var todoList = w('#id-div-todoList')
  for (var i = 0; i < todos.length; i++) {
    var todo = todos[i]
    var task = todo.content
    var t = `<div>${task}</div>`
    appendHtml(todoList, t)
  }

}
// 点击add 时，更新todolist内容
var insertodoList = function(todoValue) {
  var todoList = w('#id-div-todoList')
  var t = `<div>${todoValue}</div>`
  appendHtml(todoList, t)
}

// 点击delete时删除对应的内容，可以通过id 实现，
//这里采用取巧的方式 , 点击删除按钮的时候先删除所有子元素
// 再从localStorage中读取的内容

var coverTodoList = function() {
  log('debug 20, coverTodoList')
  var todoList = w('#id-div-todoList')
  while( todoList.hasChildNodes() ) {
    log('debug 21', todoList.firstChild)
    todoList.removeChild(todoList.firstChild)
    var x = todoList
  }

  log('debug 22', x)
  var todos = read()
  for (var i = 0; i < todos.length; i++) {
    var todo = todos[i]
    var task = todo.content
    var t = `<div>${task}</div>`
    log('debug 23', t)
    appendHtml(todoList, t)
  }
  log('debug 24',todoList)

}
