<template>
<div ref="preheat">
    <!-- 、、、、、、、、、、、、、、、、、提前10分钟自动进入场内预热页面  、、、、、、、、、、、、、、、、、、、、、 -->
    <div class="preheat" >
        <div class="preheat-bg" :style="'height:'+screenHeight+'px'">
			<div class="preheat-pad">
        <!-- 在线人数 -->
        <div class="results-header lf">
          <div class="icon_user">
            <!-- <img src="../assets/img/icon-user.png" alt=""> -->
          </div>
          <div class="layer">{{parseInt($store.state.gameInfo.people*1 + allUsers*1)}}人</div>
      </div>
      <div class="clear"></div>
				<!-- 上面活动马上开始部分开始 -->
				<div class="preheat-active">
					瓜分<strong>{{parseFloat($store.state.gameInfo.amount_money)}}</strong>元奖金 — 活动马上开始
				</div>
				<!-- 上面活动马上开始部分结束 -->
				<!-- 倒计时开始 -->
        <div>倒计时</div>
				<div class="preheat-down" ref="time" id="time" v-text="timeShower"></div>
				<!-- 倒计时结束 -->
				<!-- 变化的tip开始 -->
				<div class="preheat-tip" id="fontScroll">
					<!-- <span class="preheat-nosmoke" v-for="(item,key) in tips" :key="key">{{item.name}}</span> -->
					<carousel :tips="$store.state.gameInfo.activity_tips" :inv="invTime"></carousel>
				</div>
				<!-- 变化的tip结束 -->
				<!-- 邀请好友按钮开始 -->
				<div class="btn preheat-btn" @click="inviteFriends">邀请好友参加</div>
				<!-- 邀请好友按钮结束 -->
			</div>
      <img src="../assets/img/runoffbj@2x.png" class="sixthPic" v-if="sixthPic">
		</div>
	</div>
    <ws ref="wsp" @sayBoard="sayBoard" @listenFromChild="fn" :style="'height:'+wsH+'px'"></ws>
    <share v-if="showShare"></share> 
</div>
</template>
<script>
import { screenHeight } from "../assets/utils/sceenHeight";
import { shareToApp } from "../assets/utils/share";
import carousel from "./carousel.vue";
import ws from "./ws";
import share from "./share";

export default {
  name: "preheat",
  data() {
    return {
      sayBoard: false,
      invTime: 2000,
      showShare: false,
      interval: null,
      tips: [],
      screenHeight: 0,
      active: null, ///活动开始时间
      activity_time: null, //活动计时器
      now_time: null, //从后台获取的系统时间
      allUsers: 0, ///总人数
      scrollElem: 0,
      timeShower: null,
      chaTime: 0, ///本地和服务器的时间差
      sixthPic: false, ///最后一题的图片加载
      wsH:0
    };
  },
  components: {
    carousel,
    share,
    ws
  },
  methods: {
    sayboard(data) {
      this.sayboard = data.sayBoard;
    },
    inviteFriends() {
      this.showShare = true;
      this.$store.state.shareSwitch = true;
    },
    fn: function(data) {
      // console.log("ws人数是..." + data);
      this.allUsers = data;
    }
  },
  mounted: function() {
    var _this = this;
    var that = this;
    // _this.allUsers = data.evt.peopleNum
    this.screenHeight = screenHeight();
    this.$refs.preheat.style.height = this.screenHeight + "px";
    this.$refs.preheat.style.position = "relative";
    _this.allUsers = this.$refs.wsp.wsPeople;
    _this.wsH=this.screenHeight-$(".preheat-pad").height()-30;
    //分享接口
    $.get({
      url: _this.$store.state.url + "wenda/getsignpackage",
      data: { url: window.location.href.split("#")[0] },
      success(data) {
        data = JSON.parse(data);
        _this.sys = data.timestamp * 1000;
        _this.$store.state.shareInfo = {
          appId: data.appId,
          nonceStr: data.nonceStr,
          timestamp: data.timestamp,
          signature: data.signature
        };
        ///分享组件
        shareToApp({
          link:"/answer/dist/#/userCanvas?openid=" + _this.$store.state.userInfo.openid,
          appId: data.appId,
          nonceStr: data.nonceStr,
          timestamp: data.timestamp,
          signature: data.signature,
          amount_money: _this.$store.state.gameInfo.amount_money
        });
        // console.log(_this.$store.state.shareInfo);
      }
    });
    var cookie_state = sessionStorage.getItem("state");
    // openid检查
    if (!!!cookie_state){
      // alert(!_this.$store.state.userInfo.openid)
      window.location.href = _this.$store.state.url+"wenda/auth";
    }else{
      // alert(22)
      this.$store.state.userInfo = JSON.parse(cookie_state).userInfo;
      this.$store.state.gameInfo = JSON.parse(cookie_state).gameInfo;
      this.$store.state.beatNum = JSON.parse(cookie_state).beatNum;
      this.$store.state.hasShare =  JSON.parse(cookie_state).hasShare;
      this.$store.state.shareSwitch = JSON.parse(cookie_state).shareSwitch;
    }


    getTimeRound({
      url: _this.$store.state.url + "wendatwo/getquestion",
      data: { activity_id: _this.$store.state.gameInfo.activity_id }
    });
    ///获取时间差
    function getTimeRound(obj) {
      var sendTime = new Date() * 1;
      var timeRound = null;
      $.get({
        url: obj.url,
        data: obj.data,
        success: function(data) {
          // console.log('---------------') 
          // console.log(new Date()*1 - sendTime)
          timeRound = new Date() * 1 - sendTime; ///请求的时间差
          // console.log(timeRound)
          data = JSON.parse(data);
          // console.log(data)
          var serverTime = data.now_time + "000"; ///php 返回的时间到s
          // console.log(serverTime)  ///服务器时间
          time(serverTime);
          if (_this.$store.state.gameInfo.start_time - serverTime < 19000) {
            getQuestion();
          }
          // console.log(new Date()*1)
          // console.log(new Date()*1 - (data.now_time+'000'))
          sessionStorage.setItem("timeRound", "");
          _this.chaTime = new Date() * 1 - serverTime - timeRound; ///返回本地时间和服务器时间的差值
          sessionStorage.setItem("timeRound", _this.chaTime);
        }
      });
    }
    /// 获取问题
    function getQuestion() {
      $.get({
        url: that.$store.state.url + "wendatwo/getquestion",
        data: {
          activity_id: that.$store.state.gameInfo.activity_id,
          openid: that.$store.state.userInfo.openid
        },
        success: function(data) {
          // console.log(data);
          if (JSON.parse(data).state != 0) {
            
            sessionStorage.setItem("question", data);
          }
        }
      });
    }
    // 时间倒计时开始
    function time(serverTime) {
      clearInterval(that.interval);
      // 活动开始时间
      // 获取系统的时间
      // console.log(_this.sys, "sys1");
      // 活动开始的时间减去系统的时间
      // var ss = new Date(d);
      that.interval = setInterval(function() {
        var d = _this.$store.state.gameInfo.start_time - serverTime * 1 + _this.chaTime;
        if (_this.chaTime) {
          d = _this.$store.state.gameInfo.start_time - new Date() * 1 + _this.chaTime;
        }
        // console.log('-----------===')
        // console.log(_this.chaTime)
        // console.log(d)
        var m = Math.floor(d / 1000 / 60);
        if (m > 11) {
          _this.$router.push({ path: "/" });
        }
        var s = Math.floor(d / 1000) % 60;
        if (m <= 0 && s < 19 && !sessionStorage.getItem("question")) {
          _this.sixthPic = true;
          getQuestion();
        }
        if (m <= 0 && s <= 3) {
          _this.$refs.wsp.inputHide();
          _this.$refs.wsp.clearRobot();
        }
        if (m <= 0 && s <= 0) {
          clearInterval(that.interval);
          _this.$router.push({ path: "/answer" });
          return;
        }
        m = m < 10 ? "0" + m : m;
        s = s < 10 ? "0" + s : s;
        // console.log(m,'<br>',s)
        // document.getElementById("time").innerHTML = m + ":" + s;
        _this.timeShower = m + ":" + s;
        // console.log(_this.$refs.wsp);
      }, 1000);
    }
    // that.active = _this.$store.state.gameInfo.start_time;
    // that.activity_time = setInterval(() => {
    //   if ((server - _this.sys) / 1000 / 60 > 10) {
    //     // console.log("哈哈哈哈哈")
    //     // _this.isShowac = true;
    //     // clearInterval(that.activity_time);
    //     clearInterval(that.activity_time);
    //     that.$router.push({ path: "/" });
    //   } else if (server - _this.sys <= 0) {
    //     clearInterval(that.activity_time);
    //     _this.$router.push({ path: "/answer" });
    //   }
    // }, 1000);
    // 时间倒计时结束
  }
};
</script>
<style lang="css" scoped>
.preheat {
  /* position: relative; */
  z-index: 1;
  background: #8c0ce6;
  height: 100%;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
}
.preheat-bg {
  background: url("../assets/img/preheatbg.png") top left no-repeat;
  background-size: 100% 100%;
  height: 100%;
  position: absolute;
  width: 100%;
}
.preheat-pad {
  z-index: 300;
  padding: 20px;
  width: 100%;
  box-sizing: border-box;
}
.preheat-active {
  width: 100%;
  height: 20%;
  font-size: 16px;
  text-align: center;
  color: #ffffff;
  margin-top: 20px;
}
.preheat-active+div{
  width:100%;
  text-align: center;
  color:#fff;
  font-size: 16px;
  margin-top:5%;
}
.preheat-down {
  width: 100%;
  height: 40px;
  font-size: 30px;
  font-weight: 900;
  text-align: center;
  color: #ffffff;
}
.preheat-tip {
  width: 100%;
  text-align: center;
  height: 100px;
  margin-top: 3%;
  -webkit-tap-highlight-color: transparent;
}

.preheat-btn {
  text-align: center;
}
.say-board {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  overflow: hidden;
  z-index: 9;
}
strong {
  font-size: 20px;
}
/* 最后一题的图片 */
.sixthPic {
  height: 0;
  width: 0;
  visibility: hidden;
  position: absolute;
  right: -999999999999px;
  top: -99999999999999px;
}
</style>
