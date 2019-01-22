// pages/mine/mine.js
var formatTime = require('../../utils/formatTime.js');
var util = require('../../utils/util.js');
const app = getApp();

let index = {
  onGetUserInfo:app.onGetUserInfo,
  data: {
    android:false,
    hasDel:false,
    lock:false,
    authorizeBoard:0,    ////授权弹窗
    user: {
      receive: [],
      give: []
    },
    signData:{
      arr:[
        // { date: "06.25", signIn:1,score:5},
        // { date: "06.26", signIn:1,score:10},
        // { date: "06.27", signIn:1,score:15},
        // { date: "今天", signIn:0,score:20},
        // { date: "06.28", signIn:0,score:25},
        // { date: "06.29", signIn:0,score:30},
        // { date: "06.30", signIn:0,score:35}
      ],
      sigined:false,
      showShadow:false,
      userScore:0
    }, 
    screenWidth: 0,
    currentIndex: 0,
    left: 0,
    startX: 0, 
    startY: 0,
    broadwise: false,  //是否是横向滑动
    showNotice1: false,  //底部提示
    showNotice2: false,
    pno1: 1,
    pno2: 1,
    dateShow:false,
    opc1:"",
    opc2:""
  },
  onReady:function(){
    this.setData({    ///调用授权
      authorizeBoard: app.globalData.authorizeBoard,
      android: /^Android/ig.test(app.globalData.systemInfo.system)
    })
  },
  onShow:function(){
    var that = this;
    wx.hideTabBarRedDot({ index: 1 });
    app.getOpenid(function (id) {
      that.setData({
        ["signData.showShadow"]: false,
        signData: app.globalData.signData
      });
      that.reqReceive();
      that.reqGive(); 
    })
  },
  onLoad: function (options) {
      this.setData({
        screenWidth: app.globalData.systemInfo.windowWidth
      }) 
  },
  reqReceive:function(){
    var that=this;
    wx.showLoading({ title: '加载中...' });
    app.func.req('/my/demand', { openid: app.globalData.openid, pages: 1 }, function (res) {
      if (typeof (res.data) == 'object') {
        var arr = res.data;
        for (var i = 0; i < arr.length; i++) {
          if (that.data.android) arr[i]['num'] =1;
          else{
            arr[i]['num'] = 1.2;
            arr[i]['confirm'] = false;
          }
          arr[i]['create_time'] = util.formatTime(new Date(arr[i]['create_time'] * 1000));
          if ((arr[i]['status'] == "3" ) && (arr[i]['is_receive'] == 1) && (new Date().toLocaleDateString() != new Date(arr[i]["create_time"]).toLocaleDateString())){
            arr[i]['status'] = "已过期";
          }else{
            if (arr[i]['is_receive'] == 1) arr[i]['status'] = "可送出";
            else arr[i]['status'] = "";
          }          
        }
        that.setData({["user.receive"]: arr,pno1:1});
      }
    })
        wx.hideLoading();
  },
  reqGive:function(){
    var that = this;
    wx.showLoading({ title: '加载中...' });    
    app.func.req('/my/send', { openid: app.globalData.openid, pages: 1 }, function (res) {
      if (typeof (res.data) == 'object') {
        var arr = res.data;
        for (var i = 0; i < arr.length; i++) {
          if (that.data.android){
            arr[i]['num'] = 1;
            arr[i]['showDel']=false;
          }else {
            arr[i]['num'] = 1.2;
            arr[i]['confirm'] = false;
          }
          if (arr[i]['status'] == "3") {
            if ((arr[i]['is_receive'] != 2) && (new Date().toLocaleDateString() != new Date(arr[i]["create_time"]*1000).toLocaleDateString())){
              arr[i]['status'] = "已过期";
            } 
            else arr[i]['status'] = "";
          } else {
            if (arr[i]['is_receive'] == 2) arr[i]['status'] = "";
            else arr[i]['status'] = util.outTime(arr[i]['create_time'] * 1000);
          }
          arr[i]['create_time'] = util.formatTime(new Date(arr[i]['create_time'] * 1000));
        }
        that.setData({["user.give"]: arr,pno2:1});
      }
    })
        wx.hideLoading();        
  },
  showSign:function(){
      this.setData({
        ["signData.showShadow"]: true
      });
  },
  signIn: function () { 
    var that = this;
    var dayIdx=-1;
    for (var i = 0; i < that.data.signData.arr.length;i++){
      if (that.data.signData.arr[i].date=="今天")
        dayIdx=i;
    }
    app.func.req('/sign/sign', { openid: app.globalData.openid }, function (res) {
      if (res) {
        that.setData({
          ["signData.sigined"]: true,
          ['signData.arr[' + dayIdx + '].signIn']:1,
          ["signData.userScore"]: (that.data.signData.userScore -0)+ (that.data.signData.arr[dayIdx].score-0)
        })
        app.globalData.signData = that.data.signData;
        that.reqReceive();
      }
    })
  },
  goScore:function(){
    this.setData({
      ["signData.showShadow"]: false
    });
    wx.navigateTo({
      url: '../score/score'
    })
  },
  close: function () {
    this.setData({ ["signData.showShadow"]: false });
  },
  changeView: function (e) {
    this.setData({currentIndex: e.target.dataset.idx});
  },
  touchstart: function (e) {
    this.setData({
      broadwise: false,
      startX: e.touches[0].pageX,
      startY: e.touches[0].pageY
    });
  },
  touchmove: function (e) {
    if(!this.data.android){
      var currentX = e.touches[0].pageX;
      var currentY = e.touches[0].pageY;
      var tx = currentX - this.data.startX;
      var ty = currentY - this.data.startY;
      var elemFrom = e.currentTarget.dataset.from;
      var idx = e.currentTarget.dataset.index;
      var distance = 0 - (this.data.user[elemFrom][idx].num - 1) * this.data.screenWidth;
      var key1 = 'user.' + elemFrom + '[' + idx + '].left';
      var key2 = 'user.' + elemFrom + '[' + idx + '].num';
      var key3 = 'user.' + elemFrom + '[' + idx + '].confirm';
      if (Math.abs(tx) > Math.abs(ty)) {
        this.setData({broadwise: true});
        if (tx < 0) {
          this.setData({
            [key1]: distance
          });
        } else if (tx > 0) {
          this.setData({
            [key1]: 0,
            [key2]: 1.2,
            [key3]: false
          });
        }
      }
      this.setData({
        startX: currentX,
        startY: currentY
      });
    }
  },
  longtapEvent:function(e){
    if (this.data.hasDel) this.cancelDel();
    else{
      var elemFrom = e.currentTarget.dataset.from;
      var idx = e.currentTarget.dataset.index;
      var key = 'user.' + elemFrom + '[' + idx + '].showDel';
      wx.setStorage({
        key: 'which',
        data: key,
      })
      this.setData({
        [key]:true,
        hasDel:true,
        lock:true
      });
    }
  },
  formSubmit:function(e){
    // console.log(this.data.hasDel, this.data.lock);
    if ((!this.data.hasDel) && (!this.data.lock)){
      var that=this;
      app.func.req('/sign/formid', { formid: e.detail.formId,openid: app.globalData.openid }, function (res) {
        var elemFrom = e.currentTarget.dataset.from;
        var idx = e.currentTarget.dataset.index;
        var item = new Object();
        item.id = that.data.user[elemFrom][idx]['id'];
        item.gift_id = that.data.user[elemFrom][idx]['gift_id'];
        item.is_receive = that.data.user[elemFrom][idx]['is_receive'];
        item.gift_price = that.data.user[elemFrom][idx]['gift_price'];
        item.gift_img = that.data.user[elemFrom][idx]['gift_img'];
        item.gift_name = that.data.user[elemFrom][idx]['gift_name'];
        item["from"] = elemFrom;
        if(item.from=='receive' && !app.globalData.userInfo && item.gift_price==0){
          that.setData({authorizeBoard:1})
          wx.setStorage({
            key: "item",
            data: item
          })
        }else{
          wx.navigateTo({
            url: '../letter/letter?item=' + JSON.stringify(item)
          })
        }
      })
    }else this.setData({
      hasDel:false,
      lock:false
      });
  },
  confirmEvent: function (e) {
    var elemFrom = e.currentTarget.dataset.from;
    var idx = e.currentTarget.dataset.index;
    var key1 = 'user.' + elemFrom + '[' + idx + '].left';
    var key2 = 'user.' + elemFrom + '[' + idx + '].num';
    var key3 = 'user.' + elemFrom + '[' + idx + '].confirm';
    this.setData({ [key2]: 1.2 });
    this.setData({[key2]: 1.3});
    var distance = 0 - (this.data.user[elemFrom][idx].num - 1) * this.data.screenWidth;
    this.setData({
      [key1]: distance,
      [key3]: true
    });
  },
  cancelDel:function(e){
    var that=this;
    wx.getStorage({
      key: 'which',
      success: function(res) {
        that.setData({
          [res.data]:false,
          hasDel:false
          });
      }
    })
  },
  deleteEvent: function (e) {
    var that=this;
    var elemFrom = e.currentTarget.dataset.from;
    var idx = e.currentTarget.dataset.index;
    var url="";
    if (elemFrom=="give") url ='/my/fordel';
    else url = '/my/del'
    app.func.req(url, { openid: app.globalData.openid, id: that.data.user[elemFrom][idx].id }, function (res) {
      console.log(res.data)
    })
    var key1 = 'user.' + elemFrom;
    var key2 = 'user.' + elemFrom + '[' + idx + '].left';
    var key3 = 'user.' + elemFrom + '[' + idx + '].num';
    var key4 = 'user.' + elemFrom + '[' + idx + '].confirm';
    var arr = this.data.user[elemFrom];
    arr.splice(idx, 1);
    this.setData({
      [key1]: arr,
      [key2]: 0,
      [key4]: false
    });
    if(!that.data.android) this.setData({[key3]:1.2});
    if (this.data.user[elemFrom].length == 1 && (!this.data.user[elemFrom][0].id)) {
      this.setData({[key1]: []});
    }
  },
  lastPage: function (e) {
    var that = this;
    if (!this.data.broadwise) {
      wx.showLoading({title: '刷新中...'})
      if (e.target.id == 'receive') {
        that.setData({pno1:1});
        that.reqReceive();
      } else {
        that.setData({pno2:1});        
        that.reqGive();
      }
      setTimeout(function () {
        wx.hideLoading();
      }, 1000)
    }
  },
  nextPage: function (e) {
    var that = this;
    if (e.target.id == 'receive') {
      // if(!that.data.opc1){
        var page1 = this.data.pno1 + 1;
        // console.log(page1,this.data.pno1)
        app.func.req('/my/demand', { openid: app.globalData.openid, pages: page1 }, function (res) {
          if (typeof (res.data) == 'object') {
            wx.showLoading({title: '加载中...'})
            var arr = res.data;
            for (var i = 0; i < arr.length; i++) {
              arr[i]['num'] = 1.2;
              arr[i]['confirm'] = false;
              arr[i]['create_time'] = util.formatTime(new Date(arr[i]['create_time'] * 1000));
              if ((arr[i]['status'] == "3") && (arr[i]['is_receive'] == 1) && (new Date().toLocaleDateString() != new Date(arr[i]["create_time"]).toLocaleDateString())) {
                arr[i]['status'] = "已过期";
              } else {
                if (arr[i]['is_receive'] == 1) arr[i]['status'] = "可送出";
                else arr[i]['status'] = "";
              }   
            }
            var arr1 = that.data.user.receive.concat(arr);
            that.setData({
              ["user.receive"]: arr1,
              pno1: page1
            })
          } else {
            that.setData({
              showNotice1: true
            })
            setTimeout(() => {
              that.setData({
                opc1: "fadeOut",
              })
              setTimeout(() => {
                that.setData({
                  showNotice1: false,
                  opc1:""
                })
              }, 500);
            }, 2000);
          }
        })
      // }
    } else {
      // if (!that.data.opc2) {
        var page2 = this.data.pno2 + 1;
        app.func.req('/my/send', { openid: app.globalData.openid, pages: page2 }, function (res) {
          if (typeof (res.data) == 'object') {
            wx.showLoading({ title: '加载中...'})
            var arr = res.data;
            for (var i = 0; i < arr.length; i++) {
              arr[i]['num'] = 1.2;
              arr[i]['confirm'] = false;
              if (arr[i]['status'] == "3"){
                if ((arr[i]['is_receive'] !=2 ) && (new Date().toLocaleDateString() != new Date(arr[i]["create_time"]*1000).toLocaleDateString())) arr[i]['status'] = "已过期";
                else arr[i]['status']="";
              } else{
                if (arr[i]['is_receive'] == 2) arr[i]['status'] = "";
                else arr[i]['status'] = util.outTime(arr[i]['create_time'] * 1000);
              }
              arr[i]['create_time'] = util.formatTime(new Date(arr[i]['create_time'] * 1000));
            }
            var arr1 = that.data.user.give.concat(arr);
            that.setData({
              ["user.give"]: arr1,
              pno2: page2
            })
          } else {
            that.setData({
              showNotice2: true
            })
            setTimeout(() => {
              that.setData({
                opc2: "fadeOut",
              })
              setTimeout(() => {
                that.setData({
                  showNotice2: false,
                  opc2:""
                })
              }, 500);
            }, 2000);
          }
        })
      // }
    }
    setTimeout(function () {
      wx.hideLoading();
    }, 1000)
  },
  toLetter:function(){
    var item = new Object();
    item["from"] ="receive";
    item.id=this.data.signData.gift['id'];
    item.gift_id = this.data.signData.gift['gift_id'];
    item.is_receive = this.data.signData.gift['is_receive'];
    item.gift_price = this.data.signData.gift['gift_price'];
    item.gift_img = this.data.signData.gift['gift_img'];
    item.gift_name = this.data.signData.gift['gift_name'];
    this.setData({["signData.showShadow"]:false});
    if(app.globalData.userInfo){
      wx.navigateTo({
        url: '../letter/letter?item=' + JSON.stringify(item)
      })
    }else{
      this.setData({authorizeBoard:1})
    }
  },
  onShareAppMessage: function () {
    return {
      title: "@所有人，快来领取你的专属礼物！",
      path: '/pages/index/index',
      imageUrl: app.globalData.sharePic
    }
  },
  // 隐藏授权弹窗
  hideAuthorize(e) {
    this.setData({authorizeBoard: false})
    app.globalData.authorizeBoard = false;  
  }
}
Page(index); 