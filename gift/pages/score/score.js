// pages/score/score.js
const app = getApp();
let index = {
  onGetUserInfo: app.onGetUserInfo,
  // 隐藏授权弹窗
  hideAuthorize(e) {
    this.setData({ authorizeBoard: false })
    app.globalData.authorizeBoard = false;
  },
  /**
   * 页面的初始数据
   */
  data: {
    user:{
      avatar:"../../images/pic1@2x.png",
      uname:"chloe"
    },
    authorizeBoard: 0,    ////授权弹窗
    giftList:[ 
      // { id: 12, gift_img: "../../images/card.png", gift_name: "狗粮", detail: "送你一把狗粮自己吃", getNum: 458, score: 20, status:"12小时后过期", hasBuy:1},
      // { id: 12, gift_img: "../../images/card.png", gift_name: "狗粮", detail: "送你一把狗粮自己吃", getNum: 458, score: 20, status: "12小时后过期", hasBuy:0},
      // { id: 12, gift_img: "../../images/card.png", gift_name: "狗粮", detail: "送你一把狗粮自己吃", getNum: 458, score: 20, status: "12小时后过期", hasBuy:0}
    ],
    showNotice:false,
    pno:1,
    showRule:false,
    signData: {},
    opc:""
  },
  toMine(){
    wx.switchTab({
      url: '../mine/mine',
    })
  },
  onLoad: function (options) {
    var that=this;
    app.func.req('/gifts/freegift', {},function (res) {
      console.log(res)
      that.setData({
        giftList:res.data
      })
      // console.log(that.data.giftList);
    })
    this.setData({
      signData: app.globalData.signData
    })
    this.setData({
      ["signData.showShadow"]: false
    });
    // console.log(this.data.signData);
  },
  formSubmit: function (e) {
    var that = this;
    app.func.req('/sign/formid', { formid: e.detail.formId, openid: app.globalData.openid }, function (res) {
      // console.log(res)
    })
  },
  payEvent:function(e){
    var that=this;
    // console.log(e.target.dataset.index)
    let index = e.target.dataset.index;
    let arrK = 'giftList[' + index + '].record_id' ;
    app.func.req('/gifts/exchange',
    { openid: app.globalData.openid, 
      gift_id: e.target.id
    }, 
    function (res) {
      if(res.data.status==1){
        that.setData({ 
          [arrK]:res.data.record_id,
          ["signData.userScore"]: that.data.signData.userScore-e.currentTarget.dataset.score
        });
        app.globalData.signData.userScore = that.data.signData.userScore;
        wx.showToast({
          title:'兑换成功',
          icon:"success"
        })
      }else{
        wx.showToast({
          title:res.data.msg,
          icon:"none"
        })
      }
    })  
  },
  toLetter(e){
    var _this = this;
    // console.log(_this.data.giftList[e.target.dataset.index])
    // return;
    wx.navigateTo({
      url:'../letter/letter?record_id='+ _this.data.giftList[e.target.dataset.index].record_id 
    })
  },
  showSign: function () {
    this.setData({
      ["signData.showShadow"]: true
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
  rule:function(){
    this.setData({showRule:true});
  },
  closeRule:function(){
    this.setData({ showRule:false});
  },
  lastPage: function (e) {
    var that = this;
      wx.showLoading({ title: '刷新中...' })
      app.func.req('/my/send', { openid: app.globalData.openid, pages: 1 }, function (res) {
        if (typeof (res.data) == 'object') {
          var arr = res.data;
          that.setData({ giftList: arr })
        }
      })
      setTimeout(function () {
        wx.hideLoading();
      }, 1000)
  },
  nextPage: function (e) {
    var that = this;
      if (!this.data.showNotice) {
        var pno= this.data.pno + 1;
        app.func.req('/my/demand', { openid: app.globalData.openid, pages: page1 }, function (res) {
          if (typeof (res.data) == 'object') {
            wx.showLoading({ title: '加载中...' })
            var arr = res.data;
            var arr1 = that.data.giftList.concat(arr);
            that.setData({
              giftList: arr1,
              pno: pno
            })
          } else {
            that.setData({
              showNotice: true
            })
            setTimeout(() => {
              that.setData({
                opc: "fadeOut",
              })
              setTimeout(() => {
                that.setData({
                  showNotice: false
                })
              }, 500);
            }, 2000);
          }
        })
      }
    setTimeout(function () {
      wx.hideLoading();
    }, 1000)
  },
  onShareAppMessage: function () {
    return {
      title: "@所有人，快来领取你的专属礼物！",
      path: '/pages/index/index',
      imageUrl: app.globalData.sharePic
    }
  }
};
Page(index)