!function () {
  chrome.runtime.onMessage.addListener(function (request, sender, cb) {
    var result
    var msg = request.msg
    switch (msg.type) {
      case 'inject-script':
        result = addScript(msg.src, msg.test);
        break;
      case 'inject-code':
        result = addCode(msg.text);
        break;
    }
    cb(result);
  })

  function addScript(src, test) {
    // 需要在manifest引入资源
    var script = document.createElement('script')
    script.src = chrome.extension.getURL(src)
    document.body.appendChild(script)
    return true
  }
  function addCode(content) {
    var script = document.createElement('script')
    script.innerHTML = content
    document.body.appendChild(script)
    return true
  }
}()
