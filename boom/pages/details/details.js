// pages/details/details.js
const app = getApp();
var http = require('../../service/http.js');
var config = require('../../service/config.js');
let wxParse = require("../../parse/index");
// var WxParse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    core: true,
    // 加载
    hidden: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      conoptions: options.id,
      item_index: options.index,
      share_num: options.share_num,
      read: options.read
    })
    this.detail(options);

    let pages = getCurrentPages(); //当前页面
    let prevPage = pages[pages.length - 2]; //上一页面
    var index = that.data.item_index;
    var read = "comdata[" + index + "].read_num";
    var readnumber = ++that.data.read
    prevPage.setData({
      [read]: readnumber
    })
    //跳转页面，阅读数加一
    app.func.req('/boom/addread_num', {
      xhid: options.id
    }, function (res) {
      console.log(res)
    })

  },
  detail: function (options){
  var that = this;
    app.func.req('/boom/detail', {
      xhid: options.id
    }, function (res) {
      that.setData({
        contentall: res.data.data,
        hidden: false
      })
      var arcitle = res.data.data.content;
      wxParse.parse({
        bind: 'des',
        html: arcitle,
        target: that,
        enablePreviewImage: true, // 禁用图片预览功能
      });
      if (!res.data.data.tips) {
        that.setData({
          core: true
        })
      } else {
        that.setData({
          core: false
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading();
    wx.stopPullDownRefresh();
    wx.hideNavigationBarLoading()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    //跳转页面，阅读数加一
    var title = this.data.contentall.title;
    var id = this.data.contentall.xhid;
    var that = this;
    return {
      title: title,
      path: '/pages/index/index?id=' + id,
      complete: function (event) {
        if (event.errMsg == 'shareAppMessage:ok') {
          let pages = getCurrentPages(); //当前页面
          let prevPage = pages[pages.length - 2]; //上一页面
          var index = that.data.item_index;
          var up = "comdata[" + index + "].share_num";
          var newp = ++that.data.share_num;
          prevPage.setData({ //直接给上移页面赋值
            [up]: newp,
          });
          app.func.req('/boom/addshare_num', {
            xhid: id
          }, function (res) {
            console.log(res)
          })
        }
      }
    }
  }
})