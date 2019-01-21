<template>
  <div class="container main bg" :style="'height:'+screenHeight+'px'">
    <div class="shareOut"></div>
  <!-- <canvas id="cvs" width="640" :height="screenHeight"></canvas> -->
  <div id="code" class="code">
      <div class="userImg"><img :src="$store.state.userInfo.image_url" alt=""></div>
      <div class="userName">{{$store.state.userInfo.nickname}}</div>
      <div class="userInvi">{{$store.state.userInfo.code}}</div>
      <div class="userIn">邀请码</div>
      <!-- <div class="code"><img src="../assets/img/code.jpg" alt=""></div> -->
      <div class="userDes">送你一次复活机会</div>
      <div class="userDes">快快加入赢取现金</div>
  <!-- <img src="../assets/img/code.jpg" class="lf"> -->
    
  </div>
  <div class="bottom">
        <p>理财超人是一款全民知识型互动游戏</p>
        <p>答题就能赢奖金，扫码马上开始</p>
    </div>
</div>
</template>
<script>
import { screenHeight } from "../assets/utils/sceenHeight";
import { shareToApp } from "../assets/utils/share";
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
import "jquery";

Vue.use(VueClipboard);
export default {
  name: "mythumb",
  data() {
    return {
      screenHeight: 0
    };
  },
  methods: {},
  mounted: function() {
    var that = this;
    var _this = this;
    this.screenHeight = screenHeight();
    // /**
    //  * 获取openid
    //  * */
    function getUrlParam(openid) {
      var reg = new RegExp("openid={1}.{28}"); //构造一个含有目标参数的正则表达式对象
      var r = window.location.href.match(reg);
      if (r != null) return r;
      return null; //返回参数值
    }
    var openid = getUrlParam("openid");
    //分享接口
    $.get({
     url: that.$store.state.url+"wenda/getsignpackage",
      data: { url: window.location.href.split("#")[0] },
      success(data) {
        data = JSON.parse(data);
        // console.log(data);
        _this.$store.state.shareInfo = {
          appId: data.appId,
          nonceStr: data.nonceStr,
          timestamp: data.timestamp,
          signature: data.signature
        };
        ///分享组件
        shareToApp({
          link:'/answer/dist/#/userCanvas?openid='+openid,
          appId: data.appId,
          nonceStr: data.nonceStr,
          timestamp: data.timestamp,
          signature: data.signature,
          amount_money:_this.$store.state.gameInfo.amount_money
        });
        // console.log(_this.$store.state.shareInfo);
      }
    });
    // var cvs = document.querySelector("#cvs");
    // var ctx = cvs.getContext("2d");
    // var bg = new Image();
    // var w = document.documentElement.clientWidth;
    // var h = this.screenHeight;
    // var avatar = new Image();
    // // console.log(openid);
    // // alert(openid)
    // openid = "oKw4s0h52miDicoQpO2v3H0XETpQ";
    if (!openid) {
      // alert("openid");
      window.location.href = _this.$store.state.url+"wenda/auth";
    } else {
      openid= openid[0].substr(7)
      // console.log(openid)
      $.get({
       url: that.$store.state.url+"wenda/getuserinfo",
        // url:'http://www.wd.xiaositv.com/wenda/getuserinfo',
        data: { openid: openid },
        success(data) {
          // console.log(data);
          // alert(JSON.stringify(data))
          data = JSON.parse(data);
          if(!data.user_data){
            window.location.href = _this.$store.state.url+"wenda/auth";
          }
          // console.log(data);
          that.userInfo.avatar = data.user_data.image_url;
          that.userInfo.inviteCode = data.user_data.code;
          that.userInfo.name = data.user_data.nickname;
          // console.log(that.userInfo.avatar,that.userInfo.inviteCode,that.userInfo.name)
          // ====================================================这个图片的地址是根据服务器定的============
          // bg.src = "/../../static/img/cvs.png";
          bg.src = _this.$store.state.url+"answer/dist/static/img/cvs.png";
          avatar.src = that.userInfo.avatar;
          bg.onload = function() {
            avatar.onload = doIt();
          };
        },
        error(data) {
          // console.log(data);
          // window.location.href = _this.$store.state.url+"wenda/auth";
        }
      });
    }
  }
};
</script>
<style scoped>
.bg{
  background: url("../assets/img/shareOut.png") top left no-repeat;
  background-size: 100% 100%;
  position: relative;
  z-index: 100;
  overflow: hidden;
}
.code{
  position: absolute;
  top: 35vh;
  left: 28vw;
}
.userImg {
  width: 60px;
  height: 60px;
  margin: 0 auto;
}
.userImg img{
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.userInvi {
  
  height: 40px;
  font-size: 40px;
  line-height: 1;
  color: #820bf2;
  margin: 3vh auto 0;
}
.userName {
  width: 64px;
  height: 22px;
  font-size: 16px;
  font-weight: 500;
  color: #333333;
  margin: 0 auto;
}
.userIn{
  width: 42px;
  height: 20px;
  font-size: 14px;
  color: #666666;
  margin: 0 auto;
}
.userDes{
  width: 160px;
  height: 28px;
  font-size: 20px;
  line-height: 1.4;
  text-align: center;
  color: #333333;
  margin: 1vh auto;
}
.bottom p{
  width: 232px;
  /* height: 44px; */
  font-size: 14px;
  line-height: 1.57;
  color: #ffffff;
  margin: 0 auto;
}
.bottom{
  position: absolute;
  top: 85vh;
  left: 30vw;
}
/* .container {
  padding: 0 30px;
  width: 100%;
  overflow: hidden;
  text-align: center;
} */
/* #code {
  position: fixed;
  left: 0;
  bottom: 0;
}
#code > img {
  margin: 0 0 30px 30px;
  width: 75px;
  height: 75px;
} */
/* #code > div {
  width: 270px;
  font-size: 14px;
  padding-top: 10px;
  margin-left: -10px;
  color: #fff;
  line-height: 25px;
} */
</style>


