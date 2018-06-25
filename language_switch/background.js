var langs = [
  {lang: '', icon: 'unknown.png'},
  {lang: 'zh_cn', icon: 'zh_cn.png'},
  {lang: 'en_us', icon: 'en_us.png'},
];
var index = 0;
var id = 0;

watchTabs();

function watchTabs(){
  watchClick();
  // 创建tab
  chrome.tabs.onCreated.addListener(function(tab){
  })
  // 切换tab
  chrome.tabs.onSelectionChanged.addListener(function(tabId, info){
    id = tabId
    detect(tabId)
  })
  // url变化
  chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){
    if(changeInfo.status === 'complete' && id === tabId){
      detect(tabId)
    }
  })
}

// 点击图标
function watchClick(){
  chrome.browserAction.onClicked.addListener(function(tab){
    switch(index){
      case 0:
        index = 2;
        break;
      case 1:
        index = 2;
        break;
      case 2:
        index = 1;
        break;
    }
    switchLanguage(tab.id, function(){
      switchIcon()
    })
  })
}

// 检测语言
function detect(tabId){
  chrome.tabs.detectLanguage(tabId, function(language){
    console.log(language);
    switch(language){
      case 'en':
      case 'en-US':
      case 'en-us':
      case 'en_us':
      index = 2;
      break;
      case 'zh':
      case 'zh-CN':
      case 'zh-cn':
      case 'zh_cn':
      index = 1;
      break;
      case 'und':
      default:
      index = 0;
    }
    if(index === 0){
      // und通过cookie进一步检测
      getPageCookie(tabId, function(cookie){
        console.log(cookie)
        var z = cookie.indexOf('locale=zh');
        var e = cookie.indexOf('locale=en');
        if(z === -1 && e === -1){
        }else if(z === -1 && e !== -1){
          index = 2;
        }else if(z !== -1 && e === -1){
          index = 1;
        }else if(z < e){
          index = 1;
        }else{
          index = 2;
        }
        switchIcon();
      })
    }else{
      switchIcon();
    }
  })
}

// 切换图标
function switchIcon() {
  chrome.browserAction.setIcon({path: langs[index].icon})  
}
// 切换语言
function switchLanguage(tabId, cb) {
  chrome.tabs.sendMessage(tabId, {
    msg: {
      type: 'switch-language',
      lang: langs[index].lang,
      tabId: tabId,
    },
    result: 0
  }, function (response) {
    if (response) {
      cb && cb();
      chrome.notifications.create(null, {
        type: 'basic',
        iconUrl: langs[index].icon,
        title: '切换成功，刷新页面',
        message: text
      });
    }
  })
}

function getPageCookie (tabId, cb) {
  chrome.tabs.sendMessage(tabId, {
    msg: {
      type: 'get-cookie',
      tabId: tabId,
    },
    result: 0
  }, function (response) {
    if (response) {
      cb && cb(response);
    }
  })
}
