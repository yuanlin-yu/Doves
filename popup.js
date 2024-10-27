var base64String = ''

document.getElementById('fileInput').addEventListener('change', function(event) {
    var files = event.target.files;
    if (files.length > 0) {
        var file = files[0];
        var reader = new FileReader();
        reader.onload = function(e) {
        var arrayBuffer = e.target.result;
        base64String = btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)));
        };
        reader.readAsArrayBuffer(file);
    }
  });

  document.getElementById('ok').addEventListener('click', () => {
    if(base64String.length > 0) {
        // 发送文件数据到 content script
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {
                action: "fromPopup",
                data: base64String
            }, function(response) {
                // 可以在这里处理 content script 的响应
                console.log('Received response from content script:', response);
            });
        });
    }
  })
