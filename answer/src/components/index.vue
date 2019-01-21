<template>
  <div :class="{nopreheat:nopre,preheatback:prebj}" :style="'height:'+screenHeight+'px'">
  <!--   头部小问号以及汉字规则说明开始  -->
      <header>
          <div class="index-head" @click="infoShow = 0">
              <!-- <span class="index-icon"></span> -->
              <!-- <span class="index-explain">规则说明</span> -->
          </div>


      </header>
  <!--  头部小问号以及汉字规则说明结束  -->
  <!-- 如果时间小于十分钟 要进入预热页面 显示即将开始 开始 -->
  <div class="preheat-bj" v-show="isPreheat">
    <div class="preheat-liji">即将开始</div>
    <div class="lijiadd" @click="toPreheat">立即加入</div>
  </div>
  <!-- 如果时间小雨十分钟 要进入预热页面 显示即将开始 结束 -->
  <!-- 如果活动已经开始了 显示的提示开始 -->
  <div class="preheat-bj" v-show="isLater">
    <div class="preheat-liji">你来晚啦</div>
    <div class="lijiadd" @click="toAnswer">继续观看比赛</div>
  </div>
  <!-- 如果活动已经开始了 显示的提示结束 -->
    <!-- 中间白色背景部分 用户名字开场时间开始 -->
    <div :class="{indexcontent:juli,indexcontents:julis}" id="index-content">
        <div class="index-content-top">
            <div class="index-user">
              <img :src="$store.state.userInfo.image_url" alt="" @click="toMine">
              <p class="index-username">{{$store.state.userInfo.nickname}}</p>
              <div class="index-charts" @click="toCharts">排行榜</div>
            </div>
        </div>
		<div class="index-content-middle">
			<div class="index-left">
				<p class="index-today">{{($store.state.gameInfo.activity_exists && showStartTime*1)?
          
          (((new Date(showStartTime*1)).getDate()-(new Date()).getDate()) >=3 ?
          (new Date(showStartTime*1)).getMonth()-0+1 + '月' + ((new Date(showStartTime*1)).getDate()-0) + '日':
          ((new Date(showStartTime*1)).getDate()-(new Date()).getDate()) >=2 ?
          '后天' :
          ((new Date(showStartTime*1)).getDate()-(new Date()).getDate()) >=1 ?
          '明天':'今天'
          ):'下一场'}}</p>
				<p class="index-time">{{($store.state.gameInfo.activity_exists && showStartTime*1)?
          (((new Date(showStartTime*1).getHours())<10?'0'+(new Date(showStartTime*1).getHours()):(new Date(showStartTime*1).getHours()))+":"+((new Date(showStartTime*1).getMinutes())<10?"0"+(new Date(showStartTime*1).getMinutes()):(new Date(showStartTime*1).getMinutes())))
          :'即将到来'}}</p>
			</div>
			<div class="index-right">
				<p class="index-today">奖金池</p>
				<p class="index-money">{{$store.state.gameInfo.activity_exists? ((($store.state.gameInfo.amount_money)/10000) + '万') : '准备中'}}</p>
			</div>
		</div>
		<div class="index-content-bottom">
			<div class="index-revive">复活机会</div>
			<div class="index-heart">
        <div class="heart-bj">
          <p class="index-count">{{$store.state.userInfo.card_num}}</p>
        </div>
      </div>
			<div class="index-more" @click="toMorechance"><div>更多机会</div></div>
		</div>
    </div>
    <!-- 中间白色背景部分 用户名字开场时间结束 -->
    <!-- 邀请好友按钮开始 -->
    <div class="index-request btn" @click="toMorechance">邀请好友</div>
    <!-- 邀请好友按钮结束 -->
    <!-- 底部提现与填写邀请码开始 -->
    <div class="index-bottom" id="index-bottom">
        <span class="index-cash" @click="toMine">提现&nbsp;> </span>
        <span class="index-invite" v-if="!$store.state.userInfo.is_use_code" @click="invite">填写邀请码&nbsp; > </span>
    </div>
    <!-- 底部提现与填写邀请码结束 -->
    <!--  点击填写邀请码弹出来填写邀请码的框开始 -->
    <div class="index-zhezhao" v-if="inviteShow" @click="invites">
        <div class="index-invites" @click="userClick=false">
            <div class="index-intop">
                <div class="index-intitle">输入邀请码<br/>您和您的好友各获得一次复活机会</div>
                <input type="text" v-model="inviteValue" class="index-input" id="invite" placeholder="请输入正确的邀请码" oninput="if(value.length>6)value=value.slice(0,6)" @click.stop="userClick=!userClick" >
            </div>
            <div class="index-sure" @click="sure">确定</div>
        </div>

    </div>
    <!--  点击填写邀请码弹出来填写邀请码的框结束 -->
    <leaveModule ref="leave" :leaveMsg="leave" @stay="stay" @closeWindow="closeWindow"></leaveModule>
    <!-- <activeStart ref="startshow" :activeStart="activeStart" v-show="startshow" @stays="toAnswer" @closeWindows="closeWindows"></activeStart> -->
    <!-- 点击规则说明时弹窗开始 -->
    <div class="index-info" v-show="infoShow == 0" @click="infoShow = 1">
		<div class="info-list">
			<div class="info-title">活动规则</div>
			<ul class="infos">
				<li>
					<div class="info-l">1</div>
					<div class="info-cont">登录后即可参与答题活动，每期共{{$store.state.questionCount}}题，每题3个答案选项，12秒答题时间，答对可继续，答错或超过答题时间则被淘汰。</div>
				</li>
				<li>
					<div class="info-l">2</div>
					<div class="info-cont">答对{{$store.state.questionCount}}道题可平分奖金池奖金，若无人获得奖金，则奖金累计到下一期活动。奖金将在2-3个工作日发送到微信-零钱中。</div>
				</li>
				<li>
					<div class="info-l">3</div>
					<div class="info-cont">通过邀请朋友参与活动，可以获得复活机会。用户仅可填写一次邀请码，当其他用户填写你的邀请码时，两人都将获得一次复活机会。</div>
				</li>
				<li>
					<div class="info-l">4</div>
					<div class="info-cont">一次活动中，仅可使用一次复活机会，用户回答超时不可使用复活机会，决胜题不可使用。</div>
				</li>
			</ul>
			<div class="info-bottom">最终解释权归北京小司文化有限公司所有</div>
		</div>

    </div>
    <!-- 点击规则说明时弹窗结束 -->
    <!-- 分享遮罩 -->
    <share v-if="showShare"></share>
    <!-- canvas -->
    <div class="container" :style="'height:'+screenHeight+'px'">
      <canvas id="cvs" width="640" :height="screenHeight"></canvas>
    </div>
    <!-- 引入gif图片开始 -->
    <div class="gif" v-show="loadshow">
      <img src="../assets/img/load2.svg" alt="" >
    </div>
    <!-- 引入gif图片结束 -->
  </div>
</template>
<script>
import leaveModule from "./leave";
import share from "./share";
// import activeStart from "./activeStart";
import { screenHeight } from "../assets/utils/sceenHeight";
import { shareToApp } from "../assets/utils/share";
import Vue from "vue";
import VueClipboard from "vue-clipboard2";
import "jquery";

Vue.use(VueClipboard);

export default {
  name: "index",
  components: {
    share,
    leaveModule
  },
  data() {
    return {
      screenHeight: 0, //获取屏幕高度
      showShare: false, //分享遮罩
      leave: {
        // 退出弹框组件
        isShowed: false,
        money: "10万",
        h1: "",
        p1: "",
        p2: "确定离开？",
        p3: "确定不要了么？",
        stay: "留下",
        leave: "离开"
      },
      infoShow: 1, //是否显示规则说明
      inviteShow: false, //是否显示填写邀请码页面
      inviteValue: "", //邀请码输入框内的值
      isShowac: false, // 活动开始弹出提示框开始
      // active: null, ///活动开始时间
      now_time: null, //从后台获取的系统时间
      activity_time: null, //活动计时器
      startshow: false, //活动开始弹出的提示框
      card_num: "", //复活卡数量
      loadshow: false, //页面加载的时候出现的动画
      nopre:true, //没进入倒计时的样式
      prebj: false, //进入倒计时的样式
      isPreheat: false, //是否显示进入预热
      juli: true, //没进入倒计时距离上面的距离
      julis: false, // 进入倒计时距离上面的距离
      isLater: false, //来晚了的提示
      showStartTime:0   ///给用户展示的开始时间
    };
  },
  methods: {
    //   点击提现进入提现页面
    toMine: function() {
      this.$router.push({ path: "/mine" });
    },
    // 点击填写邀请码弹出填写邀请码的页面
    invite: function() {
      this.inviteShow = true;
    },
    invites: function() {
      this.inviteShow = false;
    },
    toPreheat: function() {
      this.$router.push({ path: "preheat" });
    },
    // 点击填写邀请码页面的确定
    sure: function() {
      var _this = this;

      // var openid = "oKw4s0h52miDicoQpO2v3H0XETpQ";
      // var newpwd=$("#invite").val();
      if (_this.inviteValue.length < 6) {
        alert("请输入正确的邀请码");
        // _this.inviteShow = false;
      } else {
        _this.inviteShow = false;
        var obj = {
          code: this.inviteValue,
          openid: _this.$store.state.userInfo.openid
        };
        //  var obj1 = JSON.stringify(obj)
        if (this.inviteValue.trim()) {
          $.get({
            url: _this.$store.state.url + "wenda/exchangecode",
            // url:'https://api.xiaositv.com/wenda/exchangecode',
            data: obj,
            success(data) {
              data = JSON.parse(data);
              if (data.state) {
                _this.$store.state.userInfo.card_num = data.card_num;
                _this.$store.state.userInfo.is_use_code = data.state;
              } else {
                data = JSON.parse(data);
                alert(unescape(data.msg));
              }
            }
          });
        }
      }

      this.inviteValue = "";
    },
    // 子组件传来的数据
    stay(data) {
      // console.log(data)
      this.leave.isShowed = data.isShowed;
      window.history.pushState(
        { page: 1 },
        "title",
        "#" + this.$route.path + "?page=answer"
      );
    },
    closeWindow(data) {
      if (data.close) {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/MicroMessenger/i) == "micromessenger") {
          WeixinJSBridge.call("closeWindow"); //微信
        } else if (ua.indexOf("alipay") != -1) {
          AlipayJSBridge.call("closeWebview"); //支付宝
        } else if (ua.indexOf("baidu") != -1) {
          BLightApp.closeWindow(); //百度
        } else {
          window.close(); //普通浏览器
        }
      }
    },
    //子组件如果活动开始弹出框开始
    toAnswer() {
      this.$router.push({ path: "/answer" });
    },
    // 点击进入排行榜页面
    toCharts: function() {
      this.$router.push({ path: "./ranking" });
    },
    // 点击出现分享
    toMorechance() {
      this.showShare = true;
      this.$store.state.shareSwitch = true;
    }
  },
  mounted: function() {
    var _this = this;
    ////清除问题，清除时间差
    sessionStorage.setItem('timeRound','');
    sessionStorage.setItem('question','');
    document.onreadystatechange = subSomething; //当页面加载状态改变的时候执行这个方法.
    function subSomething() {
      if (document.readyState == "complete") {
        //当页面加载状态
        _this.loadshow = false; //表单提交
      } else {
        _this.loadshow = true;
      }
    }

    ///获取用户信息
    $.get({
      url: _this.$store.state.url + "wenda/index",
      success: function(data) {
        // console.log(data)
        data = JSON.parse(data);
        if (data.state == 0) {
          window.location.href = _this.$store.state.url + "wenda/auth";
        }
        _this.$store.state.userInfo = {
          // id: data.user_data.id, //用户ID
          openid: data.user_data.openid,
          nickname: data.user_data.nickname, //用户名
          image_url: data.user_data.image_url, //用户头像
          card_num: data.user_data.card_num, // 复活卡次数
          code: data.user_data.code, //邀请码
          // status: data.user_data.status, //用户状态 1：正常 2：黑名单
          // share_img: data.user_data.share_img,
          is_use_code: data.user_data.is_use_code, //是否使用过邀请码 1：使用过 0：未使用
          amount: data.user_data.amount //用户可提现金额
        };
        if (data.activity_data.activity_exists) {
          _this.$store.state.gameInfo = {
            activity_exists: data.activity_data.activity_exists, //是否有活动 1：有 0：无 (若无则不返回下面字段)
            activity_id: data.activity_data.activity_id, //活动id
            activity_title: data.activity_data.activity_title, //活动标题
            start_time: data.activity_data.start_time + "000", //活动开始时间
            now_time: data.activity_data.now_time + "000", //从后台获取的当前时间
            amount_money: data.activity_data.amount_money, //活动金额
            ad_title: data.activity_data.ad_title, //导流标题
            people: data.activity_data.people / 2 * 3,
            ad_url: data.activity_data.ad_url, //导流url
            activity_tips: data.activity_data.activity_tips //活动tips
          };
          _this.showStartTime = (data.activity_data.start_time + "000")*1 - 10*60*1000;
          if(data.activity_data.now_time*1 >=data.activity_data.start_time*1+24*6){
            // console.log(data.activity_data.now_time*1)
            // console.log(data.activity_data.start_time*1 + 24*6)
            // console.log(data.activity_data.start_time)
            _this.$store.state.gameInfo.activity_exists = 0;
          }
        } else {
          _this.$store.state.gameInfo = {
            activity_exists: data.activity_data.activity_exists, //是否有活动 1：有 0：无 (若无则不返回下面字段)
            activity_id: 0, //活动id
            start_time: 0, //活动开始时间
            amount_money: 0, //活动金额
            activity_title: data.activity_data.activity_title
              ? data.activity_data.activity_title
              : "小司文化",
            ad_title: data.activity_data.ad_title, //导流标题
            ad_url: data.activity_data.ad_url, //导流url
            activity_tips: data.activity_data.activity_tips //活动tips
          };
        }
        _this.leave.h1 = "本场奖金" + _this.$store.state.gameInfo.amount_money / 10000 + "万元";
        _this.leave.p1 = "本场奖金" + _this.$store.state.gameInfo.amount_money / 10000 + "万元";
        ///
        sessionStorage.setItem("state", JSON.stringify(_this.$store.state));
        // 定义一个活动开始时间
        // _this.active = data.activity_data.start_time + "000";   
          _this.sysTime = data.activity_data.now_time + "000";
          clearInterval(_this.activity_time);     
          // console.log(sysTime);
          if ((data.activity_data.start_time + "000")*1 - _this.sysTime <= 0 && _this.$store.state.gameInfo.activity_exists != 0) {
            //如果活动开始时间减去系统时间小于0，代表活动已经开始了，提示你来晚了，继续观看比赛
            _this.nopre = false; //没有进入预热也没有开始的带智者荣耀四个字的背景图片
            _this.prebj = true; //预热已经开始或者活动已经开始显示的不带字的背景图片
            _this.isLater = true; //显示你来晚了，继续观看比赛的提示
            
            _this.isPreheat = false; //让即将开始进入预热面的样式隐藏
            _this.juli = false; //没有进入倒计时和活动开始的距离上面的距离
            _this.julis = true; //进入倒计时和活动开始距离上面的距离
          } else if (_this.showStartTime - _this.sysTime <= 0 && _this.$store.state.gameInfo.activity_exists != 0) {
            //如果活动开始时间减去系统时间小于等于十分钟，代表要进入预热页面，提示即将开始，立即进入
            _this.nopre = false; //没有进入预热也没有开始的带智者荣耀四个字的背景图片false
            _this.prebj = true; //预热已经开始或者活动已经开始显示的不带字的背景图片
            _this.isLater = false; //显示你来晚了，继续观看比赛的提示
            _this.isPreheat = true; //让即将开始进入预热面的样式显示
            _this.juli = false; //没有进入倒计时和活动开始的距离上面的距离
            _this.julis = true; //进入倒计时和活动开始距离上面的距离
          }else if(_this.showStartTime - _this.sysTime > 0 && _this.$store.state.gameInfo.activity_exists != 0){
            var systemT = (data.activity_data.now_time + '000')*1;
            _this.activity_time = setInterval(() => {
              systemT +=5000;
              if(_this.showStartTime - systemT < 0){
                // console.log(systemT)
                //如果活动开始时间减去系统时间小于等于十分钟，代表要进入预热页面，提示即将开始，立即进入
                _this.nopre = false; //没有进入预热也没有开始的带智者荣耀四个字的背景图片false
                _this.prebj = true; //预热已经开始或者活动已经开始显示的不带字的背景图片
                _this.isLater = false; //显示你来晚了，继续观看比赛的提示
                _this.isPreheat = true; //让即将开始进入预热面的样式显示
                _this.juli = false; //没有进入倒计时和活动开始的距离上面的距离
                _this.julis = true; //进入倒计时和活动开始距离上面的距离
              }
            }, 5000);
          }
        //分享接口
        // console.log(_this.$store.state.userInfo.openid)
        $.get({
          url: _this.$store.state.url + "wenda/getsignpackage",
          data: { url: window.location.href.split("#")[0] },
          success(data) {
            data = JSON.parse(data);
            console.log(data);
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
              amount_money:_this.$store.state.gameInfo.amount_money
            });
          }
        });
      },
      error(data) {
        // data = JSON.parse(data);
        console.log(data);
        // console.log(JSON.stringify(data));
      }
    });
    // }

    this.screenHeight = screenHeight();
    window.history.pushState(
      { page: 1 },
      "title",
      "#" + this.$route.path + "?page=" + this.$route.name
    );
  }
};
</script>
<style lang="css" scoped>
header {
  margin-bottom: 15px;
  height: 20px;
}
.index-head {
  text-align: right;
  width: 90px;
  float: right;
  background: url("../assets/img/home-rule.png") top left no-repeat;
  background-size: 100% 100%;
  height: 19px;
}
.index-icon {
  width: 16px;
  height: 16px;
  line-height: 16px;
  background-color: #ffffff;
  color: #b411b4;
  text-align: center;
  display: inline-block;
  border-radius: 50%;
}
.index-explain {
  width: 1.12rem;
  height: 0.4rem;
  font-size: 14px;
  text-align: left;
  color: #ffffff;
}
.index-title {
  width: 100%;
  height: 50px;
  font-size: 48px;
  text-align: center;
  color: #ffffff;
  text-shadow: 0 4px 7px #7f0090;
  margin-bottom: 40px;
  background: url("../assets/img/logo.png") top left no-repeat;
  background-size: 100% 100%;
}
/* <!-- 中间白色背景部分 用户名字开场时间开始 --> */
.indexcontent {
  width: 100%;
  height: 50%;
  border-radius: 10px;
  background-color: #ffffff;
  margin-top: 20vh;
}
.indexcontents {
  width: 100%;
  height: 50%;
  border-radius: 10px;
  background-color: #ffffff;
  margin-top: 3vh;
}
.index-content-top {
  height: 19vh;
  border-bottom: 1px solid #d8d8d8;
}
.index-user {
  text-align: center;
  padding: 17px 0 0px 0;
  box-sizing: border-box;
  position: relative;
}
.index-user img {
  width: 60px;
  height: 60px;
  display: block;
  margin: 0 auto;
  border-radius: 50%;
  margin-bottom: 10px;
}
.index-username {
  font-size: 14px;
  color: #333333;
}
.index-charts {
  width: 73px;
  height: 30px;
  border-radius: 15px;
  background-image: linear-gradient(122deg, #bb12ad, #820bf2);
  position: absolute;
  top: 18px;
  right: 14px;
  line-height: 30px;
}
.index-content-middle {
  height: 35%;
  border-bottom: 1px solid #d8d8d8;
}
.index-left,
.index-right {
  width: 50%;
  height: 100%;
  float: left;
  text-align: center;
  box-sizing: border-box;
}
.index-left {
  border-right: 1px solid #d8d8d8;
}
.index-today {
  font-size: 16px;
  font-weight: 500;
  color: #666666;
  margin-top: 20px;
  margin-bottom: 10px;
}
.index-time {
  font-size: 24px;
  font-weight: bold;
  color: #333333;
}
.index-money {
  font-size: 24px;
  font-weight: bold;
  color: #d23823;
}
.index-content-bottom {
  height: 15%;
  line-height: 70px;
}
.index-revive,
.index-heart,
.index-more {
  width: 33%;
  float: left;
  text-align: center;
}
.index-revive {
  font-size: 16px;
  font-weight: 900;
  color: #333333;
  text-align: right;
}
.index-heart {
  line-height: 40px;
  font-size: 14px;
  box-sizing: border-box;
}
.index-more div {
  height: 35px;
  border-radius: 17.5px;
  border: solid 1px #cccccc;
  line-height: 35px;
  text-align: center;
  font-size: 14px;
  color: #333333;
  margin-top: 17.5px;
  width: 80%;
}
.index-count {
  font-weight: 900;
  font-size: 18px;
}
/*  中间白色背景部分 用户名字、开场时间结束  */
/*  底部分享按钮开始  */
.index-request {
  text-align: center;
  margin-top: 10%;
}
/*  底部分享按钮结束  */
/*  最底部提现与填写邀请码开始 */
.index-bottom {
  width: 100%;
  height: 18px;
  font-size: 14px;
  line-height: 18px;
  text-align: center;
  color: #ffffff;
  margin: 10px auto 0;
  /* position: absolute;
  bottom: 20px;
  left: 0; */
}
/*  最底部提现与填写邀请码结束 */

/* 点击填写邀请码弹出来填写框开始 */
.index-zhezhao {
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
  width: 100%;
  height: 100%;
  z-index: 1000;
  padding: 20px;
  box-sizing: border-box;
}
.index-intitle {
  width: 100%;
  height: 48px;
  font-size: 16px;
  font-weight: 500;
  line-height: 1.5;
  text-align: center;
  color: #333333;
}
.index-input {
  width: 100%;
  height: 48px;
  border-radius: 4px;
  background-color: #f8f8f8;
  border: 1px solid #d8d8d8;
  outline: 0;
  text-align: center;
  margin-top: 10px;
  font-size: 18px;
  line-height: 18px;
  -webkit-appearance: none;
  padding: 10px 0;
  box-sizing: border-box;
}
.index-invite {
  border-left: 2px solid #d8d8d8;
  padding-left: 5px;
}
.index-invites {
  background: #fff;
  margin-top: 150px;
  border-radius: 8px;
}
.index-intop {
  padding: 20px;
}
.index-sure {
  border-top: 1px solid #d8d8d8;
  width: 100%;
  height: 7vh;
  font-size: 16px;
  font-weight: 500;
  text-align: center;
  line-height: 7vh;
  color: #820bf2;
}
input::-webkit-input-placeholder {
  color: #9b9b9b;
}
input::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  color: #9b9b9b;
}
input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  color: #9b9b9b;
}
input:-ms-input-placeholder {
  /* Internet Explorer 10-11 */
  color: #9b9b9b;
}
/* 点击填写邀请码单出来填写框结束 */
/* 点击首页的规则说明弹出规则说明开始 */
.index-info {
  background: rgba(0, 0, 0, 0.6);
  position: absolute;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 22px;
  box-sizing: border-box;
  /* display: none; */
}
.info-list {
  background: #fff;
  color: #000;
  padding: 22px;
  border-radius: 8px;
  position: relative;
  top: 70px;
  /* box-sizing: border-box */
}
.info-title {
  width: 100%;
  text-align: center;
  font-weight: 900;
}
.infos {
  margin-top: 20px;
}
.infos li {
  margin-bottom: 20px;
}
.info-l {
  height: 16px;
  width: 16px;
  background: #7f26f2;
  color: #fff;
  text-align: center;
  border-radius: 2px;
  line-height: 16px;
  float: left;
  /* margin-top: 3px; */
}
.info-cont {
  margin-left: 20px;
  /* line-height: 20px; */
}
.info-bottom {
  color: #969696;
  text-align: center;
  font-size: 12px;
}

/* 点击规则说明的弹出框结束 */
/* 活动开始弹出提示框开始 */
#leaveM {
  width: 100vw;
  height: 100vh;
  position: absolute;
  overflow: hidden;
  top: 0;
  left: 0;
  z-index: 9999;
  text-align: center;
  background: rgba(0, 0, 0, 0.6);
}
#leaveM .content {
  width: 375px;
  height: 394px;
  margin: 123px auto 0;
  border: 1px solid transparent;
  background: url("../assets/img/popup-bj.png") center top no-repeat;
  background-size: 100% 100%;
}
#leaveM .content p {
  width: 100%;
  font-family: PingFangSC;
  font-size: 16px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.63;
  letter-spacing: normal;
  color: #ffffff;
  margin-top: 150px;
}

#leaveM .stay {
  width: 194px;
  height: 44px;
  line-height: 44px;
  margin: 0 auto;
  border-radius: 27px;
  background-color: #ffffff;
  color: #d23823;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  margin-top: 28px;
}
/* 活动开始弹出提示框结束 */
.heart-bj {
  width: 40px;
  height: 40px;
  background: url("../assets/img/home-icon-heart.png") left top no-repeat;
  background-size: 100% 100%;
  margin:15px auto;
}
.gif {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: #ffffff;
}
.gif img {
  width: 50%;
  height: 50%;
  margin: 40% auto;
  display: block;
}
.preheat-liji {
  width: 100%;
  height: 25px;
  font-size: 18px;
  font-weight: 500;
  letter-spacing: -0.4px;
  text-align: center;
  color: #f8e71c;
}
.lijiadd {
  text-align: center;
  margin: 2vh auto 0;
  width: 67%;
  height: 46px;
  line-height: 46px;
  border-radius: 30px;
  color: #fff;
  border: 1px solid #fff;
  background: none;
  font-size: 22px;
}
.nopreheat {
  background-image: url("../assets/img/home_bj.jpg");
  background-size: 100% 100%;
  position: relative;
  z-index: 100;
  overflow: hidden;
  max-width: 17.066667rem;
  padding: 0.533333rem;
  margin: 0;
  color: #fff;
  font-family: Microsoft YaHei;
  font-size: 0.373333rem;
  box-sizing: border-box;
}
.preheatback {
  background-image: url("../../static/img/preheatbj.png");
  background-size: 100% 100%;
  position: relative;
  z-index: 100;
  overflow: hidden;
  max-width: 17.066667rem;
  padding: 0.533333rem;
  margin: 0;
  color: #fff;
  font-family: Microsoft YaHei;
  font-size: 0.373333rem;
  box-sizing: border-box;
}
#cvs{
  display: none;
}
</style>