//app.js
var http = require('service/http');
var share = require('service/share');
var img = require('service/img');
var info = require('service/shebei');
var pay = require('service/pay');
var config = require('service/config');
var upload_file = require('service/upload_file')
var objz = {};
var loginStatus = true;
App({
  onLaunch: function () {
    // //调用API从本地缓存中获取数据
    // var find = wx.getStorageSync('find') || []
    // find.unshift(Date.now())
    // wx.setStorageSync('find', find)
    // // console.log(find)
    // // 获取用户信息
    // this.getUserInfo();
    // this.bindNetworkChange();//监听网络变化事件
    // // this.getPromission();
    // let openid = wx.getStorageSync('openid')
    // let userInfo = wx.getStorageSync('userInfo')
    // // console.log(userInfo)
    // if (!openid) {
    //   this.userinfo();
    // } else {
    //   this.globalData.openid = openid;
    // }
    // if (userInfo) {
    //   this.globalData.userInfo = userInfo;
    // } else {
    //   this.getUserInfo()
    // }
    // // 新版本检查
    // this.update();
  },
  // userinfo: function () {  //////获取用户的openid
  //   var _this = this;
  //   wx.login({
  //     success: function (res) {
  //       // console.log(res);
  //       if (res.code) {
  //         http.req(config.GETOPENIDURL, { appid: config.APPID, secret: config.SECRET, js_code: res.code }, function (res) {
  //           // console.log(res,'aaaa');
  //           if (res.data.openid) {
  //             // console.log(res)
  //             _this.globalData.openid = res.data.openid;
  //             wx.setStorageSync('openid', res.data.openid);//存储openid
  //             http.req('/user/setopenid',
  //               {
  //                 openid:res.data.openid
  //               },
  //               res => {/* console.log(res) */}
  //             )
  //           }
  //         });
  //       }
  //     }
  //   })
  // },
  // getUserInfo: function (cb) {
  //   wx.getSetting({
  //     success(res) {
  //       // console.log(res,222)
  //       if (res.authSetting['scope.userInfo']) {
  //         wx.getUserInfo({
  //           success(res) {
  //             // console.log(res ,11111)
  //             wx.setStorageSync('userInfo',res.userInfo);//存储userInfo  
  //             that.globalData.userInfo = res.userInfo
  //             // console.log(that.globalData.userInfo)
  //             typeof cb == "function" && cb(res.userInfo)
  //           }
  //         })
  //       }
  //     }
  //   })
  // },
  // getOpenid: function (cb) {
  //   //调用登录接口
  //   var that = this;
  //   if (this.globalData.openid) {
  //     typeof cb == "function" && cb(this.globalData.openid)
  //   } else {
  //     wx.login({
  //       success: function (res) {
  //         // console.log(res.code);
  //         if (res.code) {
  //           http.req(config.GETOPENIDURL, { appid: config.APPID, secret: config.SECRET, js_code: res.code },
  //             function (res) {
  //               // console.log(res);
  //               that.globalData.openid = res.data.openid;
  //               typeof cb == "function" && cb(res.data.openid)
  //             });
  //         } else {
  //           console.log('获取用户登录态失败！' + res.errMsg)
  //         }
  //       }
  //     })
  //   }
  // },
  // update() { // 新版本检查
  //   var upManager = wx.getUpdateManager()
  //   upManager.onCheckForUpdate(res=>{
  //     // console.log(res)
  //     res.hasUpdate && upManager.onUpdateReady(res=>{
  //       wx.showModal({
  //         title: '更新提示',
  //         content: '新版本已经准备好，是否重启应用？',
  //         success: function (res) {
  //           if (res.confirm) {
  //             // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
  //             updateManager.applyUpdate()
  //           }
  //         }
  //       })
  //     })
  //   })
  // },
  //设备信息
  // getSystemInfo: function () {
  //   var that = this
  //   wx.getSystemInfo({
  //     success: function (res) {
  //       that.globalData.systemInfo = res
  //     }
  //   })
  // },
  // dealNetworkData: function (res) {
  //   this.globalData.networkType = res.networkType;
  //   if (res.networkType == 'none') {
  //     wx.showModal({
  //       title: "提示",
  //       content: "当前网略异常，请检查网略并重新刷新",
  //       showCancel: false,
  //       confirmText: "知道了",
  //     });
  //   }
  // },
  // bindNetworkChange: function () {
  //   var that = this;
  //   wx.onNetworkStatusChange(function (res) {
  //     that.dealNetworkData(res);
  //   });
  // },
  // getNetworkType: function (cb) {
  //   var that = this;
  //   wx.getNetworkType({
  //     success: function (res) {
  //       typeof cb == "function" ? cb(that.globalData.networkType) : that.dealNetworkData(res)
  //     }
  //   });
  //   return that.globalData.networkType;
  // },
  onGetUserInfo(res) {
    // console.log(res)
    var _this = this;
    let userInfo = res.detail.userInfo;
    wx.setStorage({
      key: 'userInfo',
      data: userInfo
    })
    this.globalData.userInfo = userInfo;
  },
  onShow(e){
    wx.showShareMenu({
      withShareTicket: true
    })
    // console.log(e)
  },
  globalData: {
    userInfo: null,
    networkType:null,
    systemInfo:null,
    openid:null,
    sharePic:"../../img/share.png"
  },
  
  func: {
    req: http.req,
    share: share.share,
    imageUtil: img.imageUtil,
    info: info.equipment.windowWidth,
    pay: pay.pay,
    config: config,
    upload_file: upload_file.upload_file
  },
})