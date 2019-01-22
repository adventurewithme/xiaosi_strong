const app = getApp();
var tool = require('../../utils/util')
var pay = require('../../service/pay');
var md5 = require('../../utils/md5').hexMD5;

/**
 *  本页面编译时需要注释的东西
 *  showView
 *  showLoading   onload中
 * 
*/
let index = {
  data: {   ////本业数据要和say.js 页面的数据相同 
    showView: 1,    //1隐藏  0 显示
    // scrollTop:0,      //页面是否向上移动
    sentNum: 0,      //今天发送的人数
    askOrder: 0,      ///请求订单是否已支付
    askBox: 0,         ///请求订单支付完成弹窗是否显示
    picSrc: '',   ///商品图片
    filePath: "",
    tempFilePath: '',
    hasLoad: false,
    nickName: '',      //用户名(登录人)
    toOpenid: '',    //领取人的openid
    fromOpenid: '',    //付款人openID
    askId: '',       ///求礼物时的ID（临时用）
    giftId: 1,
    title: '',       // 商品名
    price: 0,        //单价
    totalPrice: 0,     //总价
    counter: 1,         //购买数量
    giftState: 1,        //商品状态1 编辑礼物 2 已购买送出 3 领取礼物 4 已打开礼物我也要送礼物 5 已送出（不是送出人）  6 已过期  7 待支付  8已送出（是送出人） 9 已送出
    saledTime: '',        //物品出售的时间
    orderId: null,       ///订单ID   // 请求时用record_id  // 返回的结果中为id
    // say: '礼物虽小，情义千斤！', //用户留言
    say: '',  //用户留言
    uname: '',            //用户名 （from）       
    authorizeBoard: 0,       //是否显示授权提示弹窗
    textareaState: false,    //是否禁止输入文字
    textareaPlaceholder: 0,     //默认提示的文字
    placeCon: '我想对你说：礼物虽小，情义千金！',
    textareaShow: 0,       //文字域是否显示
    aniShow: 0,         ///动画是否显示
    aniActive: 'ani-active',     ///动画类名
    varAni: null,        ///动画变量
    screenWidth: 0,
    screenHeight: 0,
    minNum: 1,           ///最小购买数量
    seekCode: null,      ///请求礼物码
    goAni: 1, ///点击动画标识
    goaniActive: 0,
    hasClick: false,
    showCvs: false
  },
  onGetUserInfo(res) {
    var _this = this;
    let userInfo = res.detail.userInfo;
    wx.setStorage({
      key: 'userInfo',
      data: userInfo
    })
    if (userInfo) {
      app.globalData.userInfo = userInfo;
      _this.setData({
        nickName: userInfo.nickName
      })
      app.func.req('/index/user', {
        avatarUrl: res.detail.userInfo.avatarUrl,
        city: res.detail.userInfo.city,
        country: res.detail.userInfo.country,
        gender: res.detail.userInfo.gender,
        language: res.detail.userInfo.language,
        nickname: res.detail.userInfo.nickName,
        province: res.detail.userInfo.province,
        openid: app.globalData.openid
      },
        function (res) {
          // console.log(res, 111)
        })
    }
  },
  // 点击动画
  hideAni() {
    this.setData({
      goaniActive: 1
    })
    setTimeout(() => {
      this.setData({
        goAni: 0
      })
      // console.log(11)
    }, 1400)
  },
  //跳到首页
  toHome() {
    wx.reLaunch({
      url: '../index/index'
    })
  },
  // 礼物数量更改
  numUp(e) {
    this.setData({
      seekCode: tool.randomString(6)
    })
    let num = e.currentTarget.dataset.counter;
    clearTimeout(this.data.varAni)
    // ++num
    if (++num >= 99) num = 99;
    this.setData({
      counter: num,
      totalPrice: (this.data.price * num).toFixed(2),
      aniShow: 1
    })
    this.data.varAni = setTimeout(() => {
      this.setData({
        aniShow: 0
      })
    }, 550)
  },
  numDn(e) {
    let _this = this;
    this.setData({
      seekCode: tool.randomString(6)
    })
    let num = e.currentTarget.dataset.counter;
    if (--num <= this.data.minNum) num = this.data.minNum;
    this.setData({
      counter: num,
      totalPrice: (this.data.price * num).toFixed(2),
    })
  },
  payList() {  /// 为请求礼物的人付款
    var _this = this;
    app.func.req('/gifts/seekpay', {
      openid: _this.data.fromOpenid ? _this.data.fromOpenid : app.globalData.openid,
      order_id: _this.data.askId,
      total_price: _this.data.totalPrice,
      pay_price: _this.formatNum(_this.data.totalPrice * 1.01)
    }, res => {
      console.log(res)
      if (res.data.status == 1) {
        // 发起支付
        wx.requestPayment({
          'timeStamp': res.data.timeStamp,
          'nonceStr': res.data.nonce_str,
          'package': 'prepay_id=' + res.data.prepay_id,
          'signType': 'MD5',
          'paySign': res.data.sign,
          'complete'(res){
            // console.log(res)
            if (res.errMsg === "requestPayment:ok") {
              app.func.req('/gifts/seeksuccess', {
                order_id: _this.data.askId,
                from_openid: app.globalData.openid,
                to_openid: _this.data.toOpenid,
                gift_id: _this.data.giftId,
                gift_name: _this.data.title,
                gift_img: _this.data.picSrc,
                gift_sum: _this.data.counter,
                gift_price: _this.data.price,
                total_price: _this.data.totalPrice,
                pay_price: (_this.data.totalPrice * 1.01).toFixed(2),
                remark: _this.data.say
              }, res => {
                // console.log(res)
                // console.log(_this.data.picSrc, app.globalData.openid, res.data.record_id)
                _this.setData({
                  fromOpenid: app.globalData.openid,
                  orderId: res.data.record_id
                })
                _this.setData({
                  askBox: 1,
                  askOrder: 1,
                })
              })
            }
          }
        })
      }
    })
  },
  hideAskBox() {  ///隐藏支付完成弹窗
    var _this = this;
    this.setData({
      askBox: !_this.data.askBox
    })
  },
  toAsk() {   ///要礼物
    var _this = this;
    // console.log(tool.randomString(6))
    app.getOpenid(() => {
      if (!app.globalData.userInfo) {
        _this.setData({
          authorizeBoard: 1,
          // textareaShow:0
        })
        app.globalData.authorizeBoard = 1;
      }
    })
  },
  toReceive() {  //领取礼物
    var _this = this;
    if (!this.data.hasClick) {
      app.getOpenid(() => {
        if (app.globalData.userInfo) {
          // console.log(app.globalData.userInfo.nickName)
          _this.setData({ hasClick: true });
          app.func.req('/gifts/receive', {
            record_id: _this.data.orderId,
            openid: app.globalData.openid,
            user: app.globalData.userInfo.nickName
          }, function (res) {
            _this.setData({ hasClick: false });
            // console.log(res)
            if (res.data.status === 'success') {
              wx.showToast({
                title: '领取成功',
                icon: 'success',
                success(res) {
                  console.log(res)
                  _this.setData({
                    giftState: 4
                  })
                }
              })
            } else if (res.data.mch == 1) {
              wx.showModal({
                title: '领取失败',
                content: '请检查您是否通过微信实名认证。',
                showCancel: false
              })
            } else {
              _this.setData({
                giftState: 5
              })
            }
          })
        } else {
          _this.setData({
            authorizeBoard: 1
          })
          app.globalData.authorizeBoard = 1;
        }
      })
    }
  },
  onSaying(e) {  //用户输入的时候
    this.setData({
      // scrollTop:1,
      say: e.detail.value.replace(/↵/g, '\n')
    })
  },
  toSay(e) { ///光标聚集的时候
    // console.log(this.data)
    wx.setStorageSync('letter', this.data)
    wx.navigateTo({
      url: '../say/say'
    })
  },
  toPay() {  ///购买商品
    var _this = this;
    this.payFunc({
      data: {
        openid: app.globalData.openid,
        money: _this.data.totalPrice,
        total_money: _this.formatNum(_this.data.price * 1.01 * _this.data.counter),
        id: _this.data.giftId,
        price: _this.data.price,
        num: _this.data.counter,
        remark: _this.data.say ? _this.data.say : _this.data.placeCon
      },
      cb: (response) => {
        app.func.req('/index/success', {
          openid: app.globalData.openid,
          money: _this.formatNum(_this.data.price * _this.data.counter),
          total_money: _this.formatNum(_this.data.price * 1.01 * _this.data.counter),
          id: _this.data.giftId,
          price: _this.data.price,
          order_id: response.data.order_id,
          num: _this.data.counter,
          remark: _this.data.say ? _this.data.say : _this.data.placeCon
        }, function (res) {
          // console.log(res)
          _this.setData({
            orderId: res.data.record_id
          })
          _this.setData({
            giftState: 2,
            saledTime: tool.formatTime(new Date())
          })
        })
      }
    })
  },
  payFunc(obj) {   ///购买接口用
    let _this = this;
    // if (!app.globalData.userInfo) {
    //   this.setData({
    //     textareaShow: 0
    //   })
    // }
    obj.url = obj.url ? obj.url : app.func.config.GETUNIFIEDORDER;
    if (app.globalData.openid && app.globalData.userInfo) {
      app.func.req(obj.url, obj.data, function (response) {
        // console.log('下单返回信息＝＝＝＝＝＝＝')
        // console.log(response.data);
        if (response.data.pay_param.status == 1) {
          // 发起支付
          wx.requestPayment({
            'timeStamp': response.data.pay_param.timeStamp,
            'nonceStr': response.data.pay_param.nonce_str,
            'package': 'prepay_id=' + response.data.pay_param.prepay_id,
            'signType': 'MD5',
            'paySign': response.data.pay_param.sign,
            'complete'(res){
              console.log(res)
              if (res.errMsg === "requestPayment:ok") {
                obj.cb(response)
              }else{
                return;
              }
            }
          })
        }
      }
      )
    } else {
      this.setData({
        authorizeBoard: 1
      })
    }
  },
  toShare() {  //免费的发送后
    var _this = this;
    // setTimeout(() => {
    //   wx.showModal({
    //     title: '',
    //     content: '用心礼物已送出？',
    //     cancelText: '重新送',
    //     confirmText: "确定",
    //     complete(e) {
    //       if (e.confirm) {
    //         app.func.req('/gifts/updatereceive', {
    //           openid: app.globalData.openid,
    //           record_id: _this.data.orderId
    //         }, res => {
    //           console.log(res)
    //         })
    //         wx.reLaunch({ url: '../index/index' })
    //       }
    //     }
    //   })
    // }, 1000)
    if (_this.data.price == 0) {
      app.func.req('/gifts/update-free-order', {
        record_id: _this.data.orderId,
        openid: app.globalData.openid,
        remark: _this.data.say ? _this.data.say : _this.data.placeCon
      }, function (res) {
        // console.log(res)
      }, 'POST', {
          "Content-Type": "application/x-www-form-urlencoded"
        })
    }
  },
  // 隐藏授权弹窗
  hideAuthorize() {
    this.setData({
      authorizeBoard: false,
      // textareaShow: 1
    })
    app.globalData.authorizeBoard = false;
  },
  formatNum: function (num) {
    var front = num.toString().split(".")[0];
    var back = num.toString().split(".")[1];
    if (back.length > 2) {
      back = back.slice(0, 2);
      if (back - 0 > 9) back = back - 0 + 1;
      else back = '0' + (back - 0 + 1);
      return Number(front + "." + back);
    } else {
      return num;
    }
  },
  showPic: function () {
    this.setData({ showCvs: true });
  },
  hideCvs: function () {
    this.setData({ showCvs: false });
  },
  downPic: function (e) {
    var that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              wx.saveImageToPhotosAlbum({
                filePath: that.data.tempFilePath,
                success: function (res) {
                  console.log(res)
                  wx.showToast({
                    title: '保存成功',
                    icon: 'success',
                    duration: 2000
                  })
                },
                fail: function (res) {
                  console.log(res)
                  console.log('fail')
                }
              })
            }
          })
        } else {
          console.log(that.data.tempFilePath);
          wx.saveImageToPhotosAlbum({
            filePath: that.data.tempFilePath,
            success: function (res) {
              console.log(res)
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 2000
              })
            },
            fail: function (res) {
              console.log(res)
              console.log('fail')
            }
          })
        }
      }
    })
  },
  onLoad(opt) {  ///进入页面的时候
    // console.log(opt,111)
    wx.showLoading({
      mask: 1,
      title: '加载中...'
    })
    this.setData({
      seekCode: tool.randomString(6),
      nickName: app.globalData.userInfo ? app.globalData.userInfo.nickName : '',
      authorizeBoard: app.globalData.authorizeBoard
    })
    var _this = this;
    //首页直接进入的
    if (opt.gift_pic && opt.id && opt.name && opt.price && opt.type) {  ///首页进入的
      // console.log(opt)
      this.setData({
        picSrc: opt.gift_pic,
        title: opt.name,       // 商品名
        price: opt.price,
        giftId: opt.id,
        uname: '',
        placeCon: opt.placeCon,
        sentNum: opt.buy_num ? opt.buy_num > 0 ? opt.buy_num : 0 : 0,
        totalPrice: (opt.price * _this.data.counter).toFixed(2),
        giftState: 1,
        saledTime: opt.time ? opt.time : tool.formatTime(new Date())
      })
      _this.showView(0)
    } else if (opt.id) {  ///只有商品ID的情况
      app.func.req('/gifts/info', {
        id: opt.id
      }, function (res) {
        // console.log(res)
        if (res.data.status === 'success') {
          _this.setData({
            picSrc: res.data.data.gift_pic,
            title: res.data.data.name,       // 商品名
            price: res.data.data.price,
            uname: '',
            placeCon: res.data.data.description ? res.data.data.description : _this.data.placeCon,
            sentNum: res.data.data.buy_num ? res.data.data.buy_num > 0 ? res.data.data.buy_num : 0 : 0,
            totalPrice: (opt.price * _this.data.counter).toFixed(2),
            giftId: res.data.data.id,
            giftState: 1,
            saledTime: tool.formatTime(new Date())
          })
          _this.showView(0)
        }
      })
    } else if (opt.share) {  ///已结算订单分享进入的
      console.log(opt)
      app.func.req('/gifts/get-share', {
        record_id: opt.share,
        openid: opt.openid
      }, function (res) {
        console.log(res)
        var newGift = res.data.data.is_expire == 1 ?
          6 : (res.data.data.is_receive == 2 ?
            (res.data.data.to_openid == app.globalData.openid ? 4 :
              (res.data.data.from_openid == app.globalData.openid ? 8 : 5)) : (res.data.data.from_openid == app.globalData.openid ? 9 : 3))
        // console.log(newGift)
        _this.setData({
          orderId: opt.share,      //订单号
          picSrc: res.data.data.gift_img,       //对应图片
          title: res.data.data.gift_name,       // 商品名
          totalPrice: res.data.data.total_price,  //总价
          price: res.data.data.gift_price,      //单价
          giftId: null,                      //礼物id
          placeCon: res.data.data.description ? res.data.data.description : _this.data.placeCon,
          giftState: newGift,                  //状态页
          sentNum: res.data.data.buy_num ? res.data.data.buy_num > 0 ? res.data.data.buy_num : 0 : 0,
          say: res.data.data.remark,            //说的话
          uname: res.data.data.from_nickname,   //发红包的人
          fromOpenid: opt.openid,
          counter: res.data.data.total_price / res.data.data.gift_price,
          saledTime: tool.formatTime(new Date((res.data.data.create_time + '000') * 1))  //发出时间
        })
        var timer = setInterval(function () {
          if (_this.data.hasLoad) {
            _this.drawCvs();
            clearInterval(timer);
          }
        }, 100);
        _this.showView(0)
      })
    } else if (opt.item) {  ///收到的礼物
      // console.log(opt.item)
      let item = JSON.parse(opt.item);
      console.log(item)
      if (item.from == 'receive') {   ///其他人送的礼物
        // console.log("sdfsdgsdgfs")
        app.func.req('/gifts/get-receive-info', {
          record_id: item.id,
          openid: app.globalData.openid
        }, function (res) {
          console.log(res)
          _this.setData({
            title: res.data.data.gift_name,       // 商品名
            price: res.data.data.gift_price,
            picSrc: res.data.data.gift_img,
            totalPrice: res.data.data.total_price,
            placeCon: res.data.data.description ? res.data.data.description : _this.data.placeCon,
            giftId: item.id,
            giftState: res.data.data.is_receive == 2 ? 4 : (res.data.data.is_expire == 1 ? 6 : 2),
            goAni: 0,
            fromOpenid: res.data.data.from_openid,
            orderId: item.id,
            sentNum: res.data.data.buy_num ? res.data.data.buy_num > 0 ? res.data.data.buy_num : 0 : 0,
            say: res.data.data.remark,
            uname: res.data.data.from_nickname,
            counter: res.data.data.total_price / res.data.data.gift_price,
            saledTime: tool.formatTime(new Date((res.data.data.create_time + '000') * 1))
          })
          var timer = setInterval(function () {
            if (_this.data.hasLoad) {
              _this.drawCvs();
              clearInterval(timer);
            }
          }, 100);
          _this.showView(0)
        })
      } else if (item.from == 'give') { //送出的
        app.func.req('/gifts/get-send-info', {
          record_id: item.id,
          openid: app.globalData.openid
        }, function (res) {
          // console.log(res)
          _this.setData({
            orderId: res.data.data.id,      //订单号
            picSrc: res.data.data.gift_img,       //对应图片
            title: res.data.data.gift_name,       // 商品名
            price: res.data.data.gift_price,      //单价
            giftId: item.id,                      //礼物id
            sentNum: res.data.data.buy_num ? res.data.data.buy_num > 0 ? res.data.data.buy_num : 0 : 0,
            totalPrice: res.data.data.total_price,
            giftState: res.data.data.is_receive == 2 ? 8 : res.data.data.is_expire ? 6 : (res.data.data.is_receive == 3 ? 2 : 9),
            say: res.data.data.remark,            //说的话
            uname: res.data.data.from_nickname,   //发红包的人
            //   // counter: res.data.data.gift_sum,
            saledTime: tool.formatTime(new Date((res.data.data.create_time + '000') * 1))  //发出时间
          })
          _this.showView(0)
        })
      } else {
        wx.redirectTo({
          url: '../index/index'
        })
        console.error("商品信息不正确！ ~ qiphon")
      }
    } else if (opt.record_id) {   ///积分兑换后进入的
      app.func.req('/gifts/get-receive-info', {
        record_id: opt.record_id,
        openid: app.globalData.openid
      }, function (res) {
        console.log(res)
        _this.setData({
          title: res.data.data.gift_name,       // 商品名
          price: res.data.data.gift_price,
          totalPrice: res.data.data.total_price,
          giftId: res.data.data.gift_id,
          picSrc: res.data.data.gift_img,
          giftState: 2,
          placeCon: res.data.data.description ? res.data.data.description : _this.data.placeCon,
          fromOpenid: app.globalData.openid,
          orderId: opt.record_id,
          sentNum: res.data.data.buy_num ? res.data.data.buy_num > 0 ? res.data.data.buy_num : 0 : 0,
          say: res.data.data.remark,
          uname: res.data.data.from_nickname,
          counter: res.data.data.total_price / res.data.data.gift_price,
          saledTime: tool.formatTime(new Date((res.data.data.create_time + '000') * 1))
        })
        _this.showView(0)
      })
    } else if (opt.ask) {   ///  求礼物的 
      console.log(opt)
      app.func.req("/gifts/getorder", {
        openid: opt.openid,
        seek_code: opt.ask
      }, res => {
        console.log(res)
        if (res.data.status == 0) {
          wx.reLaunch({
            url: "../index/index"
          })
        } else {
          _this.setData({
            title:res.data.order_info.gift_name,
            giftId: res.data.order_info.gift_id,
            counter: res.data.order_info.gift_sum,
            price: res.data.order_info.gift_price,
            placeCon: res.data.order_info.description ? res.data.order_info.description : _this.data.placeCon,
            sentNum: res.data.order_info.buy_num ? res.data.order_info.buy_num > 0 ? res.data.order_info.buy_num : 0 : 0,
            totalPrice: res.data.order_info.total_price,
            toOpenid: res.data.order_info.to_openid,
            askId: res.data.order_info.order_id,
            picSrc: res.data.order_info.gift_pic,
            giftState: 7,
            seekCode: opt.ask
          })
          _this.showView(0)
        }
      })
    } else if (wx.getStorageSync('letter')) {
      let letter = wx.getStorageSync('letter')
      _this.setData(letter)
      _this.showView(0)
    } else {
      wx.redirectTo({
        url: '../index/index'
      })
      console.error("商品信息不正确！ ~ qiphon")
    }
  },
  showView(val) {  ///显示页面 val  0  -->  显示   1 ---> 隐藏
    if (!val) {
      this.setData({
        showView: 0
      })
      wx.hideLoading();
    }
  },
  imgLoad: function () {
    this.setData({
      hasLoad: true
    });
  },
  drawCvs: function () {
    var that = this;
    this.setData({
      screenWidth: app.globalData.systemInfo.windowWidth - 56,
      screenHeight: app.globalData.systemInfo.screenHeight * 0.9 - 133
    });
    console.log(this.data.screenHeight);
    var ctx = wx.createCanvasContext('pic');
    wx.downloadFile({
      url: that.data.picSrc,
      success: function (res) {
        console.log(res);
        if (res.statusCode === 200) {
          that.setData({
            filePath: res.tempFilePath
          })
          console.log("filePath:" + that.data.filePath);
          ctx.setFillStyle('#FFFDF5');
          ctx.beginPath();
          ctx.moveTo(10, 0);
          ctx.lineTo(that.data.screenWidth * 2 - 10, 0);
          ctx.arc(that.data.screenWidth * 2 - 10, 10, 10, 1.5 * Math.PI, 0);
          ctx.lineTo(that.data.screenWidth * 2, that.data.screenHeight * 2 - 10);
          ctx.arc(that.data.screenWidth * 2 - 10, that.data.screenHeight * 2 - 10, 10, 0, 0.5 * Math.PI);
          ctx.lineTo(10, that.data.screenHeight * 2);
          ctx.arc(10, that.data.screenHeight * 2 - 10, 10, 0.5 * Math.PI, Math.PI);
          ctx.lineTo(0, 10);
          ctx.arc(10, 10, 10, Math.PI, 1.5 * Math.PI);
          ctx.closePath();
          ctx.fill();
          ctx.drawImage(that.data.filePath, 0, 140, that.data.screenWidth * 2, that.data.screenHeight * 2 * 0.5);
          ctx.drawImage("../../images/note_bj@3x.png", 52, that.data.screenHeight * 2 * 0.74, that.data.screenWidth * 2 - 104, 222);
          ctx.drawImage("../../images/code.jpg", that.data.screenWidth * 2 - 154, 20, 108, 108);

          ctx.textBaseline = "top";
          ctx.textAlign = "left";
          ctx.fillStyle = "#333333";
          ctx.font = "34px Microsoft Yahei";
          ctx.fillText("我收到一个礼物", 52, 48);
          ctx.fillStyle = "#D0021B";
          ctx.font = "40px Microsoft Yahei";
          if (that.data.price != 0)
            ctx.fillText("￥" + that.data.price * that.data.counter, 52, that.data.screenHeight * 2 * 0.66);
          ctx.textAlign = "left";
          ctx.fillStyle = "#FF5200";
          ctx.font = "28px Microsoft Yahei";
          var words = that.data.say;
          var line = words.split("\n");
          var arr = [];
          for (var i = 0; i < line.length; i++) {
            var linel = 0, t = 0;
            for (var j = 0; j < line[i].length; j++) {
              if (/[a-zA-Z\d]/.test(line[i][j])) {
                linel += 0.51;
              } else {
                linel++;
              }
              if (linel <= 16) t++;
            }
            if (linel > 16) {
              var arrL = Math.ceil(linel / 16);
              var arr1 = [];
              for (var k = 0; k < arrL; k++) {
                arr1[k] = line[i].slice(k * t, (k + 1) * t);
              }
              arr = arr.concat(arr1);
            } else {
              arr.push(line[i]);
            }
          }
          arr = arr.slice(0, 2);
          for (var i = 0; i < arr.length; i++) {
            ctx.fillText(arr[i], 90, that.data.screenHeight * 2 * 0.75 + 24 + i * 62);
          }
          ctx.textBaseline = "bottom";
          ctx.textAlign = "right";
          ctx.font = "24px Microsoft Yahei";
          ctx.fillText(that.data.uname, that.data.screenWidth * 2 - 92, that.data.screenHeight * 2 * 0.74 + 170);
          // that.data.saledTime
          ctx.font = "20px Microsoft Yahei";
          ctx.fillText("2018年6月27日", that.data.screenWidth * 2 - 92, that.data.screenHeight * 2 * 0.74 + 200);
          ctx.draw(true, function () {
            wx.canvasToTempFilePath({
              x: 0,
              y: 0,
              width: that.data.screenWidth * 2,
              height: that.data.screenHeight * 2,
              canvasId: 'pic',
              success: function (res) {
                that.setData({
                  tempFilePath: res.tempFilePath
                });
                console.log(that.data.tempFilePath);
              },
              fail: function (res) {
                console.log(res);
              },
              complete: function (res) {
                console.log(res);
              }
            })
          })
          var ctx2 = wx.createCanvasContext('cvs');
          ctx2.setFillStyle('#FFFDF5');
          ctx2.beginPath();
          ctx2.moveTo(5, 0);
          ctx2.lineTo(that.data.screenWidth - 5, 0);
          ctx2.arc(that.data.screenWidth - 5, 5, 5, 1.5 * Math.PI, 0);
          ctx2.lineTo(that.data.screenWidth, that.data.screenHeight - 5);
          ctx2.arc(that.data.screenWidth - 5, that.data.screenHeight - 5, 5, 0, 0.5 * Math.PI);
          ctx2.lineTo(5, that.data.screenHeight);
          ctx2.arc(5, that.data.screenHeight - 5, 5, 0.5 * Math.PI, Math.PI);
          ctx2.lineTo(0, 5);
          ctx2.arc(5, 5, 5, Math.PI, 1.5 * Math.PI);
          ctx2.closePath();
          ctx2.fill();
          ctx2.drawImage(that.data.filePath, 0, 70, that.data.screenWidth, that.data.screenHeight * 0.5);
          ctx2.drawImage("../../images/note_bj@3x.png", 26, that.data.screenHeight * 0.74, that.data.screenWidth - 52, 111);
          ctx2.drawImage("../../images/code.jpg", that.data.screenWidth - 77, 10, 54, 54);

          ctx2.textBaseline = "top";
          ctx2.textAlign = "left";
          ctx2.fillStyle = "#333333";
          ctx2.font = "17px Microsoft Yahei";
          ctx2.fillText("我收到一个礼物", 26, 24);
          ctx2.fillStyle = "#D0021B";
          ctx2.font = "20px Microsoft Yahei";
          if (that.data.price != 0)
            ctx2.fillText("￥" + that.data.price * that.data.counter, 26, that.data.screenHeight * 0.66);
          ctx2.textAlign = "left";
          ctx2.fillStyle = "#FF5200";
          ctx2.font = "14px Microsoft Yahei";
          for (var i = 0; i < arr.length; i++) {
            ctx2.fillText(arr[i], 45, that.data.screenHeight * 0.75 + 12 + i * 31);
          }
          ctx2.textBaseline = "bottom";
          ctx2.textAlign = "right";
          ctx2.font = "12px Microsoft Yahei";
          ctx2.fillText(that.data.uname, that.data.screenWidth - 46, that.data.screenHeight * 0.74 + 85);
          // that.data.saledTime
          ctx2.font = "10px Microsoft Yahei";
          ctx2.fillText("2018年6月27日", that.data.screenWidth - 46, that.data.screenHeight * 0.74 + 100);
          ctx2.draw(true);
        }
      },
      fail: function (res) {
        console.log(res);
      }
    })
  },
  onShareAppMessage: function (res) {
    var _this = this;
    // console.log(this.data.orderId,this.data.fromOpenid)
    if (this.data.giftId && this.data.giftState === 1) {
      // console.log(tool.randomString(6))
      if (wx.getStorageSync('seekCode') != _this.data.seekCode) {
        app.getOpenid(() => {
          app.func.req('/gifts/seekgift', {
            gift_id: _this.data.giftId,
            gift_sum: _this.data.counter,
            gift_price: _this.data.price,
            total_price: _this.data.totalPrice,
            pay_price: _this.formatNum(_this.data.totalPrice * 1.01),
            openid: app.globalData.openid,
            seek_code: _this.data.seekCode
          }, function (res) {
            console.log(res)
            wx.setStorage({
              key: 'seekCode',
              value: _this.data.seekCode
            })
          })
        })
      }
      return {
        title: "我喜欢这个礼物，你愿意送给我吗？",
        path: '/pages/letter/letter?ask=' + this.data.seekCode + '&openid=' + (_this.data.toOpenid ? _this.data.toOpenid : app.globalData.openid),
        imageUrl: app.globalData.sharePic
      }
    } else if (this.data.giftState === 2 && app.globalData.openid && this.data.orderId) {
      wx.showShareMenu({
        withShareTicket: true
      })
      return {
        title: "你有一个礼物待领取！",
        path: '/pages/letter/letter?share=' + this.data.orderId + '&openid=' + app.globalData.openid,
        imageUrl: app.globalData.sharePic,
        success: res => {
          console.log("shareMsg=>",res)
          app.func.req('/gifts/updatereceive', {
            openid: app.globalData.openid,
            record_id: _this.data.orderId
          }, res => {
            console.log(res)
          })
          wx.reLaunch({ url: '../index/index' })
        },
        fail:res=>{return false;}
      }
    } else if (this.data.giftState === 7 && this.data.orderId && this.data.fromOpenid) {
      return {
        title: "你有一个礼物待领取！",
        imageUrl: app.globalData.sharePic,
        path: '/pages/letter/letter?share=' + this.data.orderId + '&openid=' + _this.data.fromOpenid,
      }
    } else if (this.data.giftState === 7) {
      return {
        title: "我喜欢这个礼物，你愿意送给我吗？",
        path: '/pages/letter/letter?ask=' + this.data.seekCode + '&openid=' + (_this.data.toOpenid ? _this.data.toOpenid : app.globalData.openid),
        imageUrl: app.globalData.sharePic
      }
    } else if (_this.data.giftState === 4) {
      return {
        title: "你有一个礼物待领取！",
        imageUrl: this.data.tempFilePath,
        path: '/pages/letter/letter?share=' + this.data.orderId + '&openid=' + (_this.data.fromOpenid ? _this.data.fromOpenid : app.globalData.openid),
      }
    } else {
      return {
        title: "你有一个礼物待领取！",
        imageUrl: app.globalData.sharePic,
        path: '/pages/letter/letter?share=' + this.data.orderId + '&openid=' + (_this.data.fromOpenid ? _this.data.fromOpenid : app.globalData.openid),
      }
    }
  }
};
Page(index);