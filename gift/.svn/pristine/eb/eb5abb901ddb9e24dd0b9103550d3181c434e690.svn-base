var app = getApp();
let index = {
  data: {
    showView: 0,    //1隐藏  0 显示
    // scrollTop:0,      //页面是否向上移动
    sentNum: 0,      //今天发送的人数
    askOrder:0,      ///请求订单是否已支付
    askBox:0,         ///请求订单支付完成弹窗是否显示
    picSrc: '',   ///商品图片
    filePath: "",
    tempFilePath: '',
    hasLoad: false,
    nickName: '',      //用户名(登录人)
    toOpenid: '',    //领取人的openid
    fromOpenid: '',    //付款人openID
    askId: '',       ///求礼物时的ID（临时用）
    giftId: 1,
    title: '生日蛋糕',       // 商品名
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
  sayFinish(e) {
    var _this = this;
    if(e.detail.value){
      // app.globalData.say = e.detail.value.replace(/↵/g, '\n');
      this.setData({
        say:e.detail.value.replace(/↵/g, '\n')
      })
    }
    wx.setStorageSync('letter',this.data);
    wx.navigateTo({
      url: '../letter/letter?say=letter'
    })
  },
  onTap(){
    return false;
  },
  onSaying(e) {  //用户输入的时候
    this.setData({
      say: e.detail.value.replace(/↵/g, '\n')
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    let letter = wx.getStorageSync('letter')
    // console.log(letter)
    this.setData(letter)
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.hideShareMenu({
      complete(res){
        console.log(res)
      }
    })
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
    wx.showShareMenu()
    console.log('say unload')
  }
}
Page(index);