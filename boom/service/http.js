// var rootDocment = 'https://test-baolei-api.xiaositv.com/v1';//你的域名
var rootDocment = 'https://baolei-api.xiaositv.com/v1';
function req(url, data, cb, md,header) {
  var md=md || 'GET'
  var header = header || { 'Content-Type': 'application/json'}
  wx.request({ 
    url: rootDocment + url,
    data: data,
    method:md,
    header: header, 
    success: function (res) {
      return typeof cb == "function" && cb(res)
    },
    fail: function () {
      return typeof cb == "function" && cb(false)
    }
  })
}

module.exports = {
  req: req
}  
