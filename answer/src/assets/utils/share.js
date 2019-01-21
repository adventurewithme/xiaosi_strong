/**
 *      param   obj  Object
 *                      link    //分享连接
 *                      appId   //appId
 *                      timestamp  //timestamp
 *                      nonceStr    
 *                      signature  
 * */
import store from '../../vuex/store';

function cb() {
  store.state.hasShare = true;
  store.state.shareSwitch = false;
}

//获取域名
function hostName(){
  var reg = /^https?:\/\/(www.)?(\w+(\.)?)+/gi;
  var result = window.location.href.match(reg);
  if(result && result.length){
    return result[0];
  }else{
    return '';
  }
}

function shareToApp(obj) {
  // console.log(obj)
  wx.config({
    debug: false,
    appId: obj.appId,
    timestamp: obj.timestamp,
    nonceStr: obj.nonceStr,
    signature: obj.signature,
    jsApiList: [ // 所有要调用的 API 都要加到这个列表中
      'checkJsApi',
      'onMenuShareTimeline',
      'onMenuShareAppMessage',
      'onMenuShareQQ',
      'onMenuShareWeibo',
      'hideMenuItems',
      'showMenuItems',
      'hideAllNonBaseMenuItem',
      'showAllNonBaseMenuItem',
      'translateVoice',
      'startRecord',
      'stopRecord',
      'onRecordEnd',
      'playVoice',
      'pauseVoice',
      'stopVoice',
      'uploadVoice',
      'downloadVoice',
      'chooseImage',
      'previewImage',
      'uploadImage',
      'downloadImage',
      'getNetworkType',
      'openLocation',
      'getLocation',
      'hideOptionMenu',
      'showOptionMenu',
      'closeWindow',
      'scanQRCode',
      'chooseWXPay',
      'openProductSpecificView',
      'addCard',
      'chooseCard',
      'openCard'
    ],
  });
  // console.log('--------------------------------------')
  // console.log(wx.config)
  wx.ready(function () { //必须写在wx.ready里面
    var link = hostName() + obj.link;
    var imgPath = hostName()+ '/answer/static/img/dati.png';
    // console.log(link,imgPath)
    wx.onMenuShareTimeline({
      title: '我在参与答题分' + (obj.amount_money?obj.amount_money:10000) + '元现金活动，邀请你一起来', // 分享标题
      link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: imgPath, // 分享图标
      success: function () {
        // 用户确认分享后执行的回调函数
        cb();
        if (obj.callback) {
          obj.callback();
        }
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    });
    wx.onMenuShareAppMessage({
      title:'我在参与答题分' + (obj.amount_money?obj.amount_money:10000) + '元现金活动，邀请你一起来' , // 分享标题
      desc: '理财超人·瓜分奖金池，不了解一下？', // 分享描述
      link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
      imgUrl: imgPath, // 分享图标
      type: 'link', // 分享类型,music、video或link，不填默认为link
      dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
      success: function () {
        // 用户确认分享后执行的回调函数
        cb();
        if (obj.callback) {
          obj.callback();
        }
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    });
    wx.onMenuShareQQ({
      title: '我在参与答题分' + (obj.amount_money?obj.amount_money:10000) + '元现金活动，邀请你一起来', // 分享标题
      desc: '理财超人·瓜分奖金池，不了解一下？', // 分享描述   
      link: link, // 分享链接
      imgUrl: imgPath, // 分享图标
      success: function () {
        // 用户确认分享后执行的回调函数
        cb();
        if (obj.callback) {
          obj.callback();
        }
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    });
    wx.onMenuShareWeibo({
      title: '我在参与答题分' + (obj.amount_money?obj.amount_money:10000) + '元现金活动，邀请你一起来', // 分享标题
      desc:'理财超人·瓜分奖金池，不了解一下？', // 分享描述
      link: link, // 分享链接
      imgUrl: imgPath, // 分享图标
      success: function () {
        // 用户确认分享后执行的回调函数
        cb();
        if (obj.callback) {
          obj.callback();
        }
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    });
    wx.onMenuShareQZone({
      title:'我在参与答题分' + (obj.amount_money?obj.amount_money:10000) + '元现金活动，邀请你一起来', // 分享标题
      desc: '理财超人·瓜分奖金池，不了解一下？', // 分享描述
      link: link, // 分享链接
      imgUrl: imgPath, // 分享图标
      success: function () {
        // 用户确认分享后执行的回调函数
        cb();
        if (obj.callback) {
          obj.callback();
        }
      },
      cancel: function () {
        // 用户取消分享后执行的回调函数
      }
    });
  });
}
export {
  shareToApp
}
