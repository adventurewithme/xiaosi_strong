<template>
  <div class="container main bg" :style="'height:'+screenHeight+'px'">
    <div class="shareOut"></div>
  <!-- <canvas id="cvs" width="640" :height="screenHeight"></canvas> -->
  <div id="code" class="code">
    <div class="userhead">
      <div class="userImg"><img :src="this.userInfo.avatar" alt=""></div>
      <div class="userright">
        <div class="userName"><i class="xianzhi">{{this.userInfo.name}}</i>  &nbsp;喊你来答题</div>
        <!-- <div class="userName">wh喊你来答题</div> -->
        <div class="userDes">答对瓜分万元奖金，立即提现</div>
      </div>
    </div>
    <div class="usermiddle">
      <div class="userIn">邀请码</div>
      <div class="userInvi">{{this.userInfo.inviteCode}}</div>
      <!-- <div class="userInvi">WH6666</div> -->
      <div class="middledes">使用邀请码各增加一次复活机会</div>
    </div>
      <!-- <div class="userDes">送你一次复活机会</div>
      <div class="userDes">快快加入赢取现金</div> -->
  <!-- <img src="../assets/img/code.jpg" class="lf"> -->
    
  </div>
  <div class="bottom">
        <p>下一场即将开始</p>
        <p>扫码立即加入</p>
    </div>
  <div class="twoCode"><img src="../assets/img/code1.png" alt=""></div>
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
      screenHeight: 0,
      userInfo: {
        avatar: "",
        name: "",
        inviteCode: "",
        
      },
      amount_money:""
    };
  },
  methods: {},
  mounted: function() {
    var that = this;
    var _this = this;
    this.screenHeight = screenHeight();
    /**
     * 获取openid
     * */
    function getUrlParam() {
      var reg = new RegExp("openid={1}.{28}"); //构造一个含有目标参数的正则表达式对象
      var r = window.location.href.match(reg);
      if (!!r && r.length) return r[0].slice(7);
      return null; //返回参数值
    }
    var openid = getUrlParam();
    //分享接口
    $.get({
      url: that.$store.state.url + "wenda/getsignpackage",
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
          link:"/answer/dist/#/userCanvas?openid=" + openid,
          appId: data.appId,
          nonceStr: data.nonceStr,
          timestamp: data.timestamp,
          signature: data.signature,
          amount_money:_this.$store.state.gameInfo.amount_money
        });
        // console.log(_this.$store.state.shareInfo);
      }
    });
    // // console.log(openid);
    // // alert(openid)
    // openid = "oKw4s0h52miDicoQpO2v3H0XETpQ";
    if (!openid) {
      // alert("openid");
      // window.location.href = _this.$store.state.url + "wenda/auth";
    } else {
      // console.log(openid)
      $.get({
        url: that.$store.state.url + "wenda/getuserinfo",
        // url:'http://www.wd.xiaositv.com/wenda/getuserinfo',
        data: { openid: openid },
        success(data) {
          // console.log(data);
          // alert(JSON.stringify(data))
          data = JSON.parse(data);
          if (!data.user_data) {
            window.location.href = _this.$store.state.url + "wenda/auth";
          }
          that.userInfo.avatar = data.user_data.image_url;
          that.userInfo.inviteCode = data.user_data.code;
          that.userInfo.name = data.user_data.nickname;
          
          that.amount_money = that.$store.state.gameInfo.amount_money
          // console.log(that.userInfo.avatar,that.userInfo.inviteCode,that.userInfo.name)
          // ====================================================这个图片的地址是根据服务器定的============
          // bg.src = "/../../static/img/cvs.png";
          // bg.src = _this.$store.state.url+"answer/dist/static/img/cvs.png";
          // avatar.src = that.userInfo.avatar;
          // bg.onload = function() {
          //   avatar.onload = doIt();
          // };
        },
        error(data) {
          console.log(data);
          // window.location.href = _this.$store.state.url+"wenda/auth";
        }
      });
    }
  }
};

</script>
<style scoped>
.bg {
  background: url("../assets/img/shareOut1.png") top left no-repeat;
  background-size: 100% 100%;
  position: relative;
  z-index: 100;
  overflow: hidden;
}
.code {
  position: relative;
  /* top: 32.5vh; */
  /* left: 28vw; */
  width: 100%;
}
.userImg {
  width: 56px;
  height: 56px;
  background: #ffffff;
  border-radius: 50%;
  /* display: inline-block; */
  /* margin: 0 auto; */
}
.userright{
  background: url("../assets/img/Rectangle.png") top left no-repeat;
  background-size: 100% 100%;
  /* display: inline-block; */
  padding: 10px 0 10px 28px;
  box-sizing: border-box;
  width: 79%;
  margin-left: 3px;
}
.userImg img {
  width: 52px;
  height: 52px;
  background: #333333;
  border-radius: 50%;
  display: block;
  margin: 4% auto;
}
.userInvi {
  height: 8vh;
  margin: 1.7vh auto 0;
  text-align: center;
  font-size: 50px;
  font-weight: 500;
  line-height: 8vh;
  color: #781dcf;
}
.userhead{
  display: flex;
  margin-top: 27vh;
}
.userName {
  width: 94%;
  height: 22px;
  font-size: 16px;
  font-weight: 500;
  line-height: 22px;
  color: #666;
}
.xianzhi{
  max-width: 40%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* display: inline-block; */
  color: #781dcf;
  font-style: normal;
  float: left;
}
.userDes{
  font-size: 16px;
  font-weight: 600;
  line-height: 1.24;
  color: #666;
  margin-top: 5px;
  /* color: #781dcf; */
}
.usermiddle{
  width: 100%;
  height: 29vh;
  background: url("../assets/img/invitation.png");
  background-size: 100% 100%;
  margin-top: 2vh;
}
.userIn {
  width: 94%;
  height: 20px;
  font-size: 20px;
  line-height: 1;
  color: #333;
  margin: 0 auto;
  /* margin-top: 297px; */
  text-align: center;
  padding-top: 25px;
}
.middledes{
  font-size: 16px;
  line-height: 1;
  color: #333333;
  margin-top: 4.5vh;
  text-align: center;
}
/* .userDes {
  width: 94%;
  height: 28px;
  font-size: 20px;
  line-height: 1.4;
  text-align: center;
  color: #333333;
  margin: 1vh auto;
} */
.bottom {
  width: 100%;
  text-align: center;
}
.bottom p {
  width: 232px;
  /* height: 44px; */
  font-size: 14px;
  color: #ffffff;
  margin: 0 auto;
}

.twoCode {
  width: 96px;
  height: 96px;
  background-color: #ffffff;
  margin: 2vh auto;
  /* position: absolute;
  top: 90vh;
  left: 50vw;
  margin-left: -48px; */
}
.twoCode img {
  height: 100%;
  width: 100%;
  display: block;
}
</style>


