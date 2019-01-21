<template>
<div class="main" :style="'height:'+screenHeight+'px'">
  <div class="userInfo">
    <img :src="$store.state.userInfo.image_url" class="avatar lf">
    <p>{{$store.state.userInfo.nickname}}</p>
    <h1><span>￥</span>{{$store.state.userInfo.amount}}</h1>
  </div>
  <button class="btn active" v-if="$store.state.userInfo.amount>=10" @click="cashModal">立即提现</button>
  <button class="btn default" v-if="$store.state.userInfo.amount<10">立即提现</button>
  <transition name="fade">
      <p v-if="showMsg" class="tusi">{{msg}}</p>
    </transition>
  <p class="notice"><i></i><span>提现金额在2-3个工作日打入你登录的微信中，账户中大于10元才可以发起提现。</span></p>
  <p class="notice">小司聊理财·理财超人</p>

  <div class="shadow" v-if="showModal">
    <div class="modal">
      <div>
      <img src="../assets/img/close.png" class="close" @click="close">
      <p>提现将在2-3个工作日内审核完毕后转入您的微信-零钱</p>
      <input type="number" placeholder="输入金额" v-model="cashNum">
      </div>
      <button @click="cashEvent">提现</button>
    </div>
      
  </div>
  
    
  
</div>
</template>

<script>
import { screenHeight } from "../assets/utils/sceenHeight";
import { shareToApp } from "../assets/utils/share";
export default {
  name: "mine",
  data() {
    return {
      showModal: false,
      cashNum: "",
      showMsg: true,
      msg: "",
      screenHeight: 0
    };
  },
  methods: {
    cashModal() {
      this.showModal = true;
      this.cashNum = " ";
    },
    close() {
      this.showModal = false;
    },
    cashEvent() {
      var that = this;
      that.showModal = false;
      function alertMsg(str) {
        that.msg = str;
        that.showMsg = true;
        setTimeout(() => {
          that.showMsg = false;
        }, 1500);
      }

      if (this.cashNum === "" || /^\s+$/.test(this.cashNum))
        alertMsg("提现金额不能为空");
      else {
        // 输入框内输入的值
        var val = Number(this.cashNum.replace(/(^\s+)|(\s+$)/g, ""));
        console.log(val);
        if (val) {
          if (/^\d+(\.{1}\d{1})?$/.test(val)) {
            if (val > this.$store.state.userInfo.amount) alertMsg("余额不足");
            else if (val < 10) alertMsg("提现的金额不能小于10元");
            else {
              alertMsg("发起提现成功");
              $.get({
                url: that.$store.state.url + "wenda/applycash",
                data: {
                  // openid:openid,
                  openid: that.$store.state.userInfo.openid,
                  amount: that.cashNum
                },
                success(data) {
                  // console.log(data);
                  data = JSON.parse(data);
                  that.$store.state.userInfo.amount = data.data.amount;
                }
              });
            }
          } else alertMsg("请输入最多一位小数的数字");
        } else alertMsg("提现金额不正确");
      }
    }
  },
  mounted: function() {
    var _this = this;
    this.screenHeight = screenHeight();

    ////sessionStorage
    var cookie_state = sessionStorage.getItem("state");
    //openid检查
    // alert(!!cookie_state)
    if (!!!cookie_state) {
      // alert(!!!cookie_state)
      // alert(!_this.$store.state.userInfo.openid)
      window.location.href = _this.$store.state.url + "wenda/auth";
    } else {
      // alert(22)
      this.$store.state.userInfo = JSON.parse(cookie_state).userInfo;
      this.$store.state.gameInfo = JSON.parse(cookie_state).gameInfo;
      this.$store.state.beatNum = JSON.parse(cookie_state).beatNum;
      this.$store.state.hasShare = JSON.parse(cookie_state).hasShare;
      this.$store.state.shareSwitch = JSON.parse(cookie_state).shareSwitch;
    }

    //分享接口
    $.get({
      url: _this.$store.state.url + "wenda/getsignpackage",
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
          link:"/answer/dist/#/userCanvas?openid=" +
            _this.$store.state.userInfo.openid,
          appId: data.appId,
          nonceStr: data.nonceStr,
          timestamp: data.timestamp,
          signature: data.signature,
          amount_money: _this.$store.state.gameInfo.amount_money
        });
        // console.log(_this.$store.state.shareInfo);
      }
    });
  }
};
</script>

<style lang="css" scoped>
.main {
  background: url("../assets/img/minebg.jpg") no-repeat;
  background-size: 100% 314px;
}
.btn {
  color: #fff;
  font-size: 20px;
  font-weight: bold;
  margin: 160px 10% 30px 10%;
}
.active {
  background: linear-gradient(left, #bb12ad, #820bf2);
  background: -0-linear-gradient(left, #bb12ad, #820bf2);
  background: -moz-linear-gradient(left, #bb12ad, #820bf2);
  background: -webkit-linear-gradient(left, #bb12ad, #820bf2);
}
.default {
  background: #999999 !important;
}
.avatar + p {
  font-size: 16px;
  font-weight: bold;
  padding-top: 20px;
  margin-left: 75px;
}
h1 {
  margin-top: 80px;
  text-align: center;
}
h1 > span {
  font-size: 24px;
}
.notice {
  color: #848484;
}
.notice i {
  display: inline-block;
  width: 18px;
  height: 18px;
  background: url("../assets/img/icon-tips.png") no-repeat;
  background-size: 90% 90%;
}
.notice span {
  display: inline-block;
  padding-left: 25px;
  position: relative;
  bottom: 22px;
  line-height: 1.5;
}
.notice:not(:last-child) {
  width: 77%;
  margin-left: 15%;
  font-size: 12px;
}
.notice:last-child {
  font-size: 16px;
  position: absolute;
  bottom: 20px;
  left: 50%;
  margin-left: -75px;
}
.modal {
  color: #000;
  text-align: center;
  font-size: 16px;
  height: 220px;
  padding: 0;
}
.modal > div {
  padding: 12px 30px;
}
.modal > div > p {
  padding: 10px;
}
.modal > div > input {
  width: 100%;
  height: 48px;
  border-radius: 5px;
  outline: 0;
  margin-top: 15px;
  border: 1px solid #e2e2e2;
  font-size: 16px;
  text-indent: 16px;
  background: #f8f8f8;
}
input::-webkit-input-placeholder {
  color: #9b9b9b;
  font-size: 16px;
}
.modal > button {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  background: #fff;
  height: 40px;
  border: none;
  border-top: 1px solid #f2f2f2;
  border-radius: 0 0 5px 5px;
  color: #820bf2;
  font-size: 16px;
  outline: 0;
}
.tusi {
  color: #333;
  height: 20px;
  width: 90%;
  margin: 0 auto;
  position: absolute;
  top: 40vh;
  text-align: center;
  /* left: 34vw; */
}
</style>