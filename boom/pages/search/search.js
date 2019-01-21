// pages/search/search.js
const app = getApp();
var http = require('../../service/http.js');
var config = require('../../service/config.js');
let wxParse = require("../../parse/index");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchValue: '',
    // 暴雷
    Thunderstorm: true,
    //良好
    better: true,
    have_con: true,
    focus:true,
    //搜索
    hidden:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
  },
  clear: function() {
    var that = this;
    that.setData({
      searchValue: ""
    })
  },
  searchValueInput: function(e) {
    var value = e.detail.value;
    this.setData({
      searchValue: value,
    });
  },
  search: function(e) {
    //加载中
    this.setData({ hidden:false})
    var that = this
    var input = that.data.searchValue;
    if (!input) {
      that.setData({ 
        hidden: true,
        better: true,
        Thunderstorm: true,
        have_con: true
      })
      wx.showToast({
        title: '没有输入搜索文字',
        icon: 'none'
      })
    } else {
      app.func.req('/boom/search', {
        title: that.data.searchValue
      }, function(res) {
        if (res.data.code == 0) {
          wx.showToast({
            title: '参数错误',
            icon: 'none'
          })
        } else if (res.data.code == 1) {
          that.setData({
            better: false,
            Thunderstorm: true,
            have_con: true
          })
        } else if (res.data.code == 2) {
          that.setData({
            Thunderstorm: false,
            better: true,
            have_con: true
          })
        } else if (res.data.code == 3) {
          that.setData({
            have_con: false,
            better: true,
            Thunderstorm: true,
          })
        }
        that.setData({
          comdata: res.data.data,
          hidden: true
        })
      })
    }
  },
  // 点击进入搜索出来的详情页
  detail: function(e) {
    wx.navigateTo({
      url: '../details/details?id=' + e.currentTarget.dataset.id + '&index=' + e.currentTarget.dataset.index + '&share_num=' + e.currentTarget.dataset.share + '&read=' + e.currentTarget.dataset.read,
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // 页面加载就调用手机软键盘适用更多机型
    let timer = setInterval(() => {
      wx.createSelectorQuery().select('#comment-section').boundingClientRect(rect => {
        if (rect !== null && timer !== null) {
          clearInterval(timer)
          timer = null
          this.setData({
            focus: true
          })
        }
      }).exec()
    }, 50)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})