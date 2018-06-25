// 监听事件，插入cookie
!function () {
  chrome.runtime.onMessage.addListener(function (request, sender, cb) {
    var result
    var msg = request.msg;
    switch (msg.type) {
      case 'switch-language':
        document.cookie=`locale=${msg.lang}; path=/`;
        document.cookie=`locale=${msg.lang}`;
        setTimeout(function(){
          location.reload()
        }, 100);
        break;
      case 'get-cookie':
        cb && cb(document.cookie);
        break;
    }
  })

  function addCode(content) {
    var script = document.createElement('script')
    script.innerHTML = content
    document.body.appendChild(script)
    return true
  }
}()
