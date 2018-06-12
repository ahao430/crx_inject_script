var defaultOpts = {
  scripts: [
    {name: 'jQuery', src: 'vendor/jQuery.min.js', test: 'jQuery', show: true, id: null},
    {name: 'axios', src: 'vendor/axios.min.js', test: 'axios', show: true, id: null},
    {name: 'lodash', src: 'vendor/lodash.min.js', test: 'lodash', show: true, id: null},
    {name: 'Vue', src: 'vendor/vue.min.js', test: 'Vue', show: true, id: null},
    {name: 'AngularJs', src: 'vendor/angular.min.js', test: 'angular', show: true, id: null},
  ],
}
// 同步获取配置项
var opts = {}
chrome.storage.sync.get(defaultOpts, function(data){
  opts = data
  
  // 初始化右键菜单
  opts.scripts.map(function(item){
    createMenu(item)
  })

  // 更新配置项菜单id
  chrome.storage.sync.set(opts, function(){})
})

// 创建菜单
function createMenu(item, cb){
  item.id = chrome.contextMenus.create({
    title: item.name,
    contexts:["page","selection","editable"],
    onclick: function(){
      injectScript(item.src, item.test, item.name)
      cb && cb();
    }
  })
}
// 删除指定id菜单
function removeMenu(item, cb){
  chrome.contextMenus.remove(item.id, function(){
    item.id = null
    cb && cb()
  })
}
// 删除全部菜单
function removeAllMenu(cb){
  chrome.contextMenus.removeAll(cb)
}
// 发起注入js
function injectScript(src, test, name){
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      msg: {
        type: 'inject-script',
        src: src,
        test: test,
      },
      result: 0
    }, function (response) {
      if (response) {
        chrome.notifications.create(null, {
          type: 'basic',
          iconUrl: 'img/icon.png',
          title: '脚本插入成功',
          message: name
        });
      }
    })
  })
}
// 发起注入code
function injectCode(text){
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {
      msg: {
        type: 'inject-code',
        text: text,
      },
      result: 0
    }, function (response) {
      if (response) {
        chrome.notifications.create(null, {
          type: 'basic',
          iconUrl: 'img/icon.png',
          title: '代码插入成功',
          message: text
        });
      }
    })
  })
}
