var bg = chrome.extension.getBackgroundPage();
var arr = bg.opts.scripts;
var list = document.getElementById('inject_srcipt_list');
var code = document.getElementById('inject_code');
var btn = document.getElementById('inject_code_btn');

init();
watch();
// 初始化列表
function init () {
  var str = '';
  arr.map(function(item){
    if(item.show){
      str += '<li data-src="' + item.src + '" data-test="' + item.test + '">' + item.name + '</li>'
    }
  })
  list.innerHTML = str
}
// 监听点击事件
function watch () {
  // 监听列表点击
  list.addEventListener('click', function (e) {
    var target = e.target
    var src = ''
    var name = target.innerText
    if (target.tagName === 'LI' && target.className === '') {
      src = target.dataset.src
      test = target.dataset.test
      target.className = 'active'
      bg.injectScript(src, test, name)
    }
  })
  // 监听代码注入
  btn.addEventListener('click', function () {
    text = code.value;
    bg.injectCode(text)
  })
}
