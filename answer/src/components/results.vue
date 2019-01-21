<template>
<div class="results bg" :style="'height:'+screenHeight+'px'">
  <!--              全部答题结束后 公布结果页面              -->
  
  <!-- 中间用户排名部分开始 -->
  <div class="result-main" >
    <img src="../assets/img/pic-share@3x.png" class="rt">
    <div style="clear:both"></div>
	  <div class="result-content">
		<div class="result-header">
			<img src="../assets/img/resulticon.png" class="resulticon">
			<p class="content-head">本期获奖者</p>
		</div>
      	<div class="ranking-main" id="haha" ref="haha">
			<ul>
				<li v-for="(users,key) in user" :key="key" v-if="key < 3">
					<img :src="users.image_url">
					<span class="content-name">{{users.nickname}}</span>
					<span class="contetnt-money"> ¥ {{users.money}}</span>
				</li>
			</ul>
      	</div>
		<div class="content-bottom">
			<div class="content-all">
				<p class="bottom-title">总奖金</p>
				<p class="bottom-money" v-text="amountMoney"></p>
			</div>
			<div class="content-count">
				<p class="bottom-title">获奖人数</p>
				<p class="bottom-num" ref="userNum"></p>
			</div>
		</div>
	  </div>
  <div class="result-more" @click="toRanking">更多中奖用户请查看排行榜</div>
  </div>
  <WebSocket></WebSocket>
</div>
</template>
<script>
import { screenHeight } from "../assets/utils/sceenHeight";
import { shareToApp } from "../assets/utils/share";
import WebSocket from "./ws";
export default {
  components: {
    WebSocket
  },
  name: "results",
  data() {
    return {
      screenHeight: 0,
      showShare: false,
      user: [],
      amountMoney:0,
      people: 0
    };
  },
  methods: {
    toRanking() {
      this.$router.push({ path: "/ranking" });
    }
  },
  mounted: function() {
    this.screenHeight = screenHeight();
    var _this = this;
    this.people = sessionStorage.getItem("people") * 1;
    this.$store.state.gameInfo.activity_exists=0;
    //sessionStorage
    var cookie_state = sessionStorage.getItem("state");
    // openid检查
    if (!!cookie_state) {
      this.$store.state.userInfo = JSON.parse(cookie_state).userInfo;
      this.$store.state.gameInfo = JSON.parse(cookie_state).gameInfo;
      this.$store.state.beatNum = JSON.parse(cookie_state).beatNum;
      this.$store.state.hasShare = JSON.parse(cookie_state).hasShare;
      this.$store.state.totalUsers = JSON.parse(cookie_state).totalUsers;
      this.$store.state.timeDiff = JSON.parse(cookie_state).timeDiff;
      this.$store.state.shareSwitch = JSON.parse(cookie_state).shareSwitch;
    }

    //获取openID和活动id
    var openid = _this.$store.state.userInfo.openid;
    var activity_id = _this.$store.state.gameInfo.activity_id;
    //获取openID
    function getUrlParam() {
      var reg = new RegExp("openid={1}.{28}"); //构造一个含有目标参数的正则表达式对象
      var r = window.location.href.match(reg);
      if (!!r && r.length) return r[0].slice(7);
      return null; //返回参数值
    }
    //获取活动ID
    function getActivityId(obj) {
      var reg = /activity_id=\d+&/gi;
      var r = obj ? obj.match(reg) : window.location.href.match(reg);
      if(!!r){return r[0].slice(12, -1) * 1;};
      return null;
    }
    if (!openid || !activity_id) {
      openid = getUrlParam("openid");
      activity_id = getActivityId();
      if (!openid || !activity_id) {
        // window.location.href = _this.$store.state.url + "wenda/auth";
      }
      $.get(_this.$store.state.url + "wendatwo/sharelist", {
        activity_id: activity_id,
        openid: openid
      }).then(data => {
        data = JSON.parse(data);
        // console.log(data);
        for(var i=0;i<3;i++){
          this.user.push(data[i])
        }
        _this.amountMoney = '¥'+data.sumMoney;
        _this.$refs.userNum.innerText =
          parseInt(data.sumMoney*1 / (data[0].money*1)) +
          "人";
      });
    } else {
      $.get(_this.$store.state.url + "wendatwo/activitycount", {
        activity_id: activity_id,
        openid: openid
      }).then(data => {
        data = JSON.parse(data);
        // console.log(data);
        _this.user = data;
        _this.amountMoney = '¥ ' +_this.$store.state.gameInfo.amount_money;
        _this.$refs.userNum.innerText =
          parseInt(_this.$store.state.gameInfo.amount_money*1 / (data[0].money*1)) +
          "人";
      });
    }
    // 分享接口
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
          link:"/answer/dist/#/results?openid=" +
            openid +
            "&activity_id=" +
            activity_id+"&a=1",
          appId: data.appId,
          nonceStr: data.nonceStr,
          timestamp: data.timestamp,
          signature: data.signature,
          amount_money:_this.$store.state.gameInfo.amount_money,
          callback: function() {
            $.post(_this.$store.state.url + "wenda/activityshare", {
              activity_id: activity_id
            }).then(data => {
              console.log("ok");
            });
          }
        });
        // console.log(_this.$store.state.shareInfo);
      }
    });

    window.addEventListener(
      "popstate",
      function(e) {
        // alert(1)
        _this.$router.push({ path: "/" });
        // alert("我监听到了浏览器的返回按钮事件啦");//根据自己的需求实现自己的功能
      },
      false
    );
  }
};
</script>
<style lang="css" scoped>
.ws{
  background: #740AB2 !important;
}
.result-main>img:first-child{
  width:164px;
  height:32px;
  margin-bottom:10px;
}
.clearfix {
  height: 50px;
}
.results {
  width: 100%;
  overflow: hidden;
  padding-bottom: 0;
}
.code {
  text-align: center;
  margin-top: 20px;
}
.code img {
  width: 130px;
  height: 130px;
}
.code p {
  margin-top: 10px;
  font-size: 16px;
  color: #fff;
}
.share {
  font-size: 14px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  letter-spacing: normal;
  color: #ffffff;
  margin-right: 16px;
  margin-top: 16px;
}
.result-main {
  height:48vh;
  padding: 0 16px;
  margin-top: 3%;
}
.result-main .result-content {
  background: #ffffff;
  border-radius: 8px;
  position: relative;
  height: 100%;
}
.resulticon {
  width: 60px;
  height: 60px;
  position: absolute;
  left: 9px;
  top: -5px;
}
.content-head {
  border-bottom: 1px solid #e0e0e0;
  font-size: 16px;
  font-weight: 900;
  height: 20%;
  line-height: 60px;
  text-align: center;
}
.ranking-main {
  height: 60%;
}

.ranking-main ul li {
  height: 21%;
  line-height: 40px;
  padding: 10px 15px;
  font-size: 14px;
  border-bottom: 1px solid #e0e0e0;
}
.ranking-main li img {
  height: 30px;
  width: 30px;
  vertical-align: middle;
}
.content-name {
  margin-left: 9px;
}
.contetnt-money {
  float: right;
  font-weight: 900;
}
.content-bottom {
  display: flex;
  flex: 1;
  flex-direction: row;
  height: 20%;
  width: 100%;
  text-align: center;
}
.content-all,
.content-count {
  width: 75%;
  height: 60px;
  padding-top: 10px;
  padding-bottom: 0;
}
.bottom-title {
  font-size: 14px;
  color: #333;
  height: 20px;
}
.bottom-money {
  font-size: 18px;
  color: #d23823;
}
.bottom-num {
  font-size: 18px;
  color: #333;
  font-weight: 900;
}
.result-more {
  width: 100%;
  text-align: center;
  font-size: 14px;
  color: #d49ef1;
  margin-top: 10px;
}
</style>
