//index.js
//获取应用实例 
const app = getApp()
var formatDate = require('../../utils/formatTime.js');
Page({
  data: {
    gift: [],
    noData:false,
    screenWidth: 0,
    screenHeight: 0,
    price: 0,
    page: 1,
    ad:{}, //推荐积分兑换礼物
    flag: false,//分页
    showShadow: false, //签到阴影
    touchAni:false, //点击动画
    x:0,
    y:0,
    signData:{},
    notMore:0,      //显示没有更多数据了
    opt:"",
    // 导航开始
    navData:{},
    showData:[],
    activeNav:0,
    touchX:null,
    touchY:null,
    touchTime:null,
    // 导航结束
  },
  giftGift: function (e) {
    var id = e.currentTarget.dataset.id,
      name = e.currentTarget.dataset.name,
      type = e.currentTarget.dataset.type,
      price = e.currentTarget.dataset.price,
      gift_pic = e.currentTarget.dataset.gift_pic,
      placeCon = e.currentTarget.dataset.desc,
      buy_num = e.currentTarget.dataset.num;
    wx.navigateTo({
      url: '../letter/letter?id='+ id +"&name=" + name + '&type=' + type + '&price=' + price + '&gift_pic=' + gift_pic + '&buy_num=' + buy_num + '&placeCon=' + placeCon
    })
  },
  formSubmit: function (e) {
    // console.log(e)
    var that = this;
    app.func.req('/sign/formid', { formid: e.detail.formId, openid: app.globalData.openid }, function (res) {
      // console.log(res)
    })
  },
  onShow:function(){
    var that=this;
    app.getOpenid(function (id) {
      app.func.req('/my/remind', { openid: app.globalData.openid}, function (res) {
        if (res.data.status==1) {
          wx.showTabBarRedDot({index:1})
        }
      })
      that.setData({
        ["signData.showShadow"]: false
      });
      app.func.req('/sign/recommend', { openid: app.globalData.openid }, function (res) {
        if (res.data.status == 1) {
          that.setData({ ['signData.ad']: res.data.gift });
        } else {
          that.setData({ noData: true });
          that.setData({ ['signData.noData']: true });
        }
      })
      app.func.req('/sign/showsign', { openid: app.globalData.openid }, function (res) {
        // console.log(res.data);
        var arr = [], date = [];
        var l = 0;
        for (var key in res.data.sign_data) {
          l++;
          date.push(key);
        }
        var len = date.length;
        var time = 0;
        if (len > 0) {
          var last = date[len - 1];
          time = res.data.sign_data[last].timestamp * 1000;
          for (var i = 0; i < len; i++) {
            date[i] = date[i].slice(4, 6) + "." + date[i].slice(6);
          }
        } else {
          time = res.data.timestamp * 1000 - 24 * 60 * 60 * 1000;
        }
        for (var i = len; i < 7; i++) {
          date[i] = formatDate.formatDate(
            new Date(time + 24 * 60 * 60 * 1000 * (i - len + 1)).getMonth() + 1,
            new Date(time + 24 * 60 * 60 * 1000 * (i - len + 1)).getDate()
          )
        }
        if (res.data.is_sign) {
          date[len - 1] = "今天";
        } else {
          date[len] = "今天";
        }
        // console.log(date);
        for (var i = 0; i < 7; i++) {
          arr[i] = new Object;
          arr[i].score = (i + 1) * 5;
          if (i < l) arr[i].signIn = 1;
          else arr[i].signIn = 0;
        }
        for (var i = 0; i < arr.length; i++) {
          arr[i].date = date[i];
          if (arr[i].date == "今天") {
            var yesterday = arr[i - 1] ? arr[i - 1].score : 0;
            that.setData({
              ["signData.yesterday"]: yesterday
            });
          }
        }
        that.setData({
          ["signData.sigined"]: res.data.is_sign,
          ["signData.showShadow"]: false,
          ["signData.userScore"]: res.data.score,
          ["signData.arr"]: arr,
        });
        app.globalData.signData = that.data.signData;
        // console.log(app.globalData.signData);
      })
    })
  },
  onLoad: function (options) {
      var that = this;
      wx.showLoading({
        title: '加载中...',
      })
    app.getOpenid(function (id) {
        app.func.req('/index/index', {}, function (res) {
          if (res) {
            // console.log(res)
            that.setData({
              gift: res.data.gifts_list,
              navData:res.data.category_list,
            })
          wx.hideLoading()
          }
        })
    })
  },
  onUnload: function () {
    wx.removeStorage('letter')
  },
  onReachBottom: function () {
    var that = this;
    var page = that.data.page;
    // 页数+1  
    
    if (!that.data.flag) {
      that.setData({
        page: ++page
      })
    }
    wx.showLoading({
      title: '加载中...'
    })
    this.loadNavMsg(page)
  },
  onShareAppMessage: function () {
    return {
      title: "@所有人，快来领取你的专属礼物！",
      path: '/pages/index/index',
      imageUrl: app.globalData.sharePic 
    }
  },
  showSign: function () {
    this.setData({
      ["signData.showShadow"]: true,
      hasClick:true
    });
  },
  signIn: function () {
    var that = this;
    var dayIdx = -1;
    for (var i = 0; i < that.data.signData.arr.length; i++) {
      if (that.data.signData.arr[i].date == "今天")
        dayIdx = i;
    }
    app.func.req('/sign/sign', { openid: app.globalData.openid }, function (res) {
      if (res) {
        that.setData({
          ["signData.sigined"]: true,
          ['signData.arr[' + dayIdx + '].signIn']: 1,
          ["signData.userScore"]: (that.data.signData.userScore-0) + (that.data.signData.arr[dayIdx].score-0)
        })
        app.globalData.signData = that.data.signData;
      }
    })
  },
  goScore: function () {
    wx.navigateTo({
      url: '../score/score'
    })
  },
  close: function () {
    this.setData({ ["signData.showShadow"]: false });
  },
  changeNav(e){   //鼠标点击时更换栏目  导航开始
    // console.log(e.currentTarget.id.replace('nav',''))
    this.setData({
      activeNav:e.currentTarget.id.replace('nav','')*1
    })
    // console.log(this.data.activeNav)
    // var clientX = e.touches[0].clientX;
    this.loadNavMsg()
  },
  navTouchSt(e){ //触摸开始
    var _this = this;
    // var x = e.touches[0].clientX,
    //     y = e.touches[0].clientY;
    this.setData({
      // touchAni:true,
      // x:x,
      // y:y,
      touchX:e.touches[0].clientX,
      touchY:e.touches[0].clientY,
      touchTime:new Date().getTime()
    })
    setTimeout(()=>{
      _this.setData({
        touchAni:false
      })
    },300)
  },
  navTouchEnd(e){  //滑动时更换栏目
    let _this = this;
    let offsetNum = 60; //滑动偏移量
    let navLen = _this.data.navData.length;
    if(new Date().getTime() - this.data.touchTime < 1000 && (Math.abs(e.changedTouches[0].clientX - _this.data.touchX) > Math.abs(e.changedTouches[0].clientY - _this.data.touchY)) ){
      if(e.changedTouches[0].clientX - _this.data.touchX < -offsetNum){
        _this.setData({
          activeNav:(_this.data.activeNav+1)>=navLen?0:this.data.activeNav+1
        })
        _this.loadNavMsg && _this.loadNavMsg()
      }else if(e.changedTouches[0].clientX - _this.data.touchX > offsetNum){
        _this.setData({
          activeNav:(_this.data.activeNav-1)<0?navLen-1:_this.data.activeNav-1
        })
        _this.loadNavMsg && _this.loadNavMsg()
      }
    }
  },
  loadNavMsg(page){
    var that = this;
    let c_id = null;
    wx.showLoading({
      title: '加载中 ...',
      mask:true
    })
    var query = wx.createSelectorQuery()
    query.select('#nav'+this.data.activeNav).boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function(res){
      // console.log(res)
      c_id=res[0].dataset.key
      // res[0].top       // #the-id节点的上边界坐标
      // res[1].scrollTop // 显示区域的竖直滚动位置
      app.getOpenid(function (id) {
        app.func.req('/index/index', {c_id,page:page?page:1}, function (res) {
          if (res) {
            // console.log(res)
            wx.hideLoading()
            if(!page){
              that.setData({
                gift: res.data.gifts_list,
                // navData:res.data.category_list,
                page:1
              })
            }else{
              if (!res.data.gifts_list.length) {
                that.setData({
                  flag:true,
                  notMore:1,
                })
                setTimeout(()=>{
                  that.setData({
                    opc:"fadeOut",
                  })
                  setTimeout(() => {
                    that.setData({
                      notMore: 0,
                      opc:""
                    })
                  }, 500);
                },2000);
                return;
              }
              that.setData({
                gift:that.data.gift.concat(res.data.gifts_list)
              })
            }
          }
        })
      })
    })
  },
  navTap(e){
    return false;
  }
})
