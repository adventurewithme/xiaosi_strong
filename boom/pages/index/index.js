//index.js
var app=getApp()
//获取应用实例
Page({
  data: {
    ye:1,
    hidden:false
  },
  onLoad: function (options) {
    this.list();
    this.inviation(options);
  },
  list:function(){
    var that = this
    app.func.req('/boom/articlelist', {}, function (res) {
      // console.log(res.data.data)
      that.setData({
        comdata: res.data.data,
        hidden:true
      })
    })
  },
  //点击事件跳转search页面
  search:function(){
    wx.navigateTo({
      url:'../search/search'
    })
  },
  // 跳转详情
  detail:function (e) {
    wx.navigateTo({
      url: '../details/details?id=' + e.currentTarget.dataset.id + '&index=' + e.currentTarget.dataset.index + '&share_num=' + e.currentTarget.dataset.share + '&read=' + e.currentTarget.dataset.read
    })
  },
  //上拉刷新事件
  onPullDownRefresh: function () {
    this.list()
    wx.showNavigationBarLoading(),
    wx.stopPullDownRefresh()
    wx.hideNavigationBarLoading()
  },
  //触底事件
  onReachBottom: function () {
    var that=this
    that.setData({
      ye: ++that.data.ye
    })
    // 返回下半部分的奖励列表
    app.func.req('/boom/articlelist', { page: that.data.ye}, function (res){
      if (res.data.data!= 0) {
        that.setData({
          comdata: that.data.comdata.concat(res.data.data),
        })
      } else {
        that.setData({
          ye: --that.data.ye,
        })
      }
    })
  },
  // 分享页面
  inviation:function(options){
    var that = this;
    if(options.id){
      wx.navigateTo({
        url: '/pages/details/details?id=' + options.id,
      })
    }
  }
})
