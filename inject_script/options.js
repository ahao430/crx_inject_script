// 从background获取配置项
var bg = chrome.extension.getBackgroundPage();
var opts = bg.opts;

var list = document.getElementById('script_list');
var resetBtn = document.getElementById('reset_btn');

init();
watch();

// 初始化
function init () {
  var arr = opts.scripts;
  var str = '';
  arr.map(function(item, index){
    str += '<li data-index="' + index + '"><span class="script_name">' + item.name + '</span><span class="switch' + (item.show ? ' active' : '') + '"></span></li>'
  })
  list.innerHTML = str;
}

function watch(){
  // 监听列表点击
  list.addEventListener('click', function (e) {
    var target = e.target
    var src = ''
    var name = target.innerText
    var index = target.parentNode.dataset.index
    if (target.tagName === 'SPAN'){
      if(target.className === 'switch active'){
        target.className = 'switch'
        opts.scripts[index].show = false
        bg.removeMenu(opts.scripts[index], save)
      }else if(target.className === 'switch'){
        target.className = 'switch active'
        opts.scripts[index].show = false
        bg.createMenu(opts.scripts[index], save)
      }
    }
  })
  // 监听按钮
  resetBtn.addEventListener('click', function(){
    reset();
  })
}

function save(){
  chrome.storage.sync.set(opts, function(){
  })
}

function reset(){
  opts = JSON.parse(JSON.stringify(bg.defaultOpts));
  save();
  init();
  bg.removeAllMenu(function(){
    opts.scripts.map(function(item){
      bg.createMenu(item)
    })
  });
}
