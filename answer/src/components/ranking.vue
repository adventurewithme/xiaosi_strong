<template>
<div class="bg" :style="'height:'+screenHeight+'px'">
  <div class="main" id="allmain" ref="allmain">
	<div class="Rectangle-24">
		<p class="layer">本周总排行</p>
	</div>
	<!--   排行前三名部分 -->
	<div class="header">
		<ul>
			<!-- 前三名部分 -->
		<li v-for="(userInfo,key) in weeklist" :key="key" v-if="key < 3">
			<div v-if="key==0" class="icon-first">
				<img src="../assets/img/icon-first.png" alt="">
			</div>
			<div v-else :class="{'Rectangle-26':key == 1, 'Rectangle-27':key == 2}">
				<p>NO.{{key + 1}}</p>
			</div>
			<div class="header-ranking">
				<img :src="userInfo.image_url" class="avatar">
			</div>
			<p>{{userInfo.nickname}}</p>
      <p class="user-amount">￥{{userInfo.amount_sum}}</p>
		</li>
		</ul>
	</div>
  <!-- 除了前三名之外的所有用户 -->
	<div class="ranking-content">
		<div class="ranking-main" id="haha"  ref="haha">
			<ul :style="'margin-bottom:'+margin+'px;overflow:auto'">
				<li v-for="(userInfo,key) in weeklist" :key="key" v-if="key > 2">
					<div class="Oval-7">
						<img :src="userInfo.image_url">
					</div>
					<div class="ranking-name">{{userInfo.nickname}}</div>
					<div class="money">￥{{userInfo.amount_sum}}</div>
				</li>
			</ul>
		</div>
	</div>
  </div>
  <!-- 底部分享 -->
	<div v-if="!!$store.state.userInfo.openid" class="ranking-me ranking-main" id="bottom">
    <div class="ranking-tip">
      <span></span>
    </div>
		<!-- 正常首页点击排行榜进入的排行榜页面开始 -->
		<ul v-if="$store.state.userInfo.openid">
			<li>
				<div class="Oval-7">
					<img :src="users.image_url">
				</div>
				<div class="ranking-name">{{users.nickname}}</div>
				<div class="money bottom">￥{{users.amount_sum}}</div>
			</li>
		</ul>
		<!-- 正常首页点击排行榜进入的排行榜页面结束 -->
	</div>
</div>
</template>
<script>
import { screenHeight } from "../assets/utils/sceenHeight";
import { shareToApp } from "../assets/utils/share";
export default {
  name: "ranking",
  data() {
    return {
      screenHeight: 0,
      weeklist: [],
      users: {},
      openid: null,
      linkUrl: null,
      margin:160
      // active:false
    };
  },
  methods: {
    // linkToWX() {
    //   if (this.$store.state.url) {
    //     window.location.href = this.$store.state.url;
    //   }
    // }
  },
  mounted: function() {
    var _this = this;
    var that = that;
    /**
     * 获取openid
     * */
     var cookie_state=sessionStorage.getItem("state");
     if(!cookie_state )
    this.$store.state=JSON.parse(cookie_state);

    function getUrlParam(openid) {
      var reg = new RegExp("openid={1}.{28}"); //构造一个含有目标参数的正则表达式对象
      var r = window.location.href.match(reg);
      if (r != null) return r;
      return null; //返回参数值
    }
    // console.log(this.$store.state.userInfo.openid)
    this.openid = getUrlParam("openid");

    ////sessionStorage  
    var cookie_state = sessionStorage.getItem("state");
    //openid检查
    // alert(!!cookie_state)
    if (!!cookie_state){
      this.$store.state.userInfo = JSON.parse(cookie_state).userInfo;
      this.$store.state.gameInfo = JSON.parse(cookie_state).gameInfo;
      this.$store.state.beatNum = JSON.parse(cookie_state).beatNum;
      this.$store.state.hasShare =  JSON.parse(cookie_state).hasShare;
      this.$store.state.totalUsers =  JSON.parse(cookie_state).totalUsers;
      this.$store.state.timeDiff =  JSON.parse(cookie_state).timeDiff;
      this.$store.state.shareSwitch = JSON.parse(cookie_state).shareSwitch;
    }


    //获取地址栏传入的openid
    // this.openid = this.openid[0].substr(7)
    // var openid = "oKw4s0h52miDicoQpO2v3H0XETpQ";
    _this.screenHeight = screenHeight();
    var offTop = $(".ranking-content").offset().top;
    var bottomH = $("#bottom").height();
    if(!_this.$store.state.userInfo.openid){
      _this.$refs.haha.style.height = _this.screenHeight - offTop  + "px";     
      _this.$refs.allmain.style.height = _this.screenHeight + "px";  
    }else{
      _this.$refs.haha.style.height = _this.screenHeight - offTop - bottomH + "px";
      _this.$refs.allmain.style.height = _this.screenHeight - bottomH + "px";
      _this.margin=110+bottomH;
    }
    //  _this.$refs.haha.style.height = _this.screenHeight - offTop - bottomH + "px";
    //   _this.$refs.allmain.style.height = _this.screenHeight - bottomH + "px";
    $.get({
     url: _this.$store.state.url+"wenda/weeklist",
      data: {
        // openid: openid
        openid: _this.$store.state.userInfo.openid
      },
      success(data) {
        data = JSON.parse(data);
        // console.log(data);
        _this.weeklist = data.week_list;  
        // console.log(_this.weeklist);
        _this.users = data.me ? data.me : "";
        _this.linkUrl = data.share.url ? data.share.url : "";
        if(data.week_list == ""){
          // _this.active = false
          alert("暂无排行榜数据")
        }else{
          // _this.active = true
          
        }
        // console.log(_this.users);
        // console.log(data);
        // if (_this.$store.state.userInfo.openid) {
        //   _this.me = true;
        //   _this.once = false;
        // } else {
        //   _this.me = false;
        //   _this.once = true;
        // }
      }
    });
    //分享接口
    $.get({
     url: _this.$store.state.url+"wenda/getsignpackage",
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
          link: "/answer/dist/#/ranking",
          appId: data.appId,
          nonceStr: data.nonceStr,
          timestamp: data.timestamp,
          signature: data.signature,
          amount_money:_this.$store.state.gameInfo.amount_money
        });
      }
    });
    // console.log(_this.$route)
    var nowPath = _this.$route.path;
    window.addEventListener(
      "popstate",
      function(e) {
        // alert(1)
        console.log(e)
        console.log(_this.$route)
        e.cancelBubble = true;
        e.stopPropagation()
        _this.$router.push({'path':'/'})
        return false;
        // alert("我监听到了浏览器的返回按钮事件啦");//根据自己的需求实现自己的功能
      },
      false
    );
  }
};
</script>
<style lang="css" scoped>
.main {
  padding-bottom: 0;
  overflow: hidden;
}
li {
  list-style: none;
}
.share {
  float: right;
}
.ranking-title {
  position: fixed;
  top: 0;
  width: 375px;
  height: 30px;
  object-fit: contain;
  background-color: #820bf2;
  margin-left: -20px;
}
.ranking-title .back {
  width: 10px;
  height: 16px;
  margin-top: 10px;
  margin-left: 10px;
  float: left;
}
.ranking-title .ranking {
  float: left;
  line-height: 30px;
  margin-left: 150px;
  font-family: PingFangSC;
  font-size: 18px;
  font-weight: 500;
  color: #ffffff;
}
.ranking-title .share {
  float: left;
  line-height: 30px;
  margin-left: 110px;
  font-family: PingFangSC;
  font-size: 14px;
  color: #ffffff;
}
.Rectangle-24 {
  width: 211px;
  height: 44px;
  border-radius: 22px;
  background-color: rgba(0, 0, 0, 0.1);
  margin: 0 auto;
}
.Rectangle-24 .layer {
  font-family: PingFangSC;
  font-size: 16px;
  line-height: 44px;
  text-align: center;
  color: #ffffff;
}
.header ul li {
  float: left;
  margin-top: 40px;
  width: 33%;
  text-align: center;
  overflow-y: auto;
}
.header {
  position: relative;
  width: 100%;
  margin-bottom: 10px;
}
.header ul {
  overflow: hidden;
  width: 100%;
  padding: 0 10px 10px 10px;
  box-sizing: border-box;
}
.header ul li p {
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.user-amount{
  /* width: 39px; */
  height: 16px;
  font-size: 18px;
  font-weight: bold;
  line-height: 0.89;
  text-align: left;
  color: #ffe644;
  margin-top: 2vh;
}
.header .icon-first {
  width: 40px;
  height: 30px;
  position: absolute;
  left: 20%;
  top: 20%;
}
.icon-first img{
  width: 100%;
  height: 100%;
}
.header .Rectangle-26 {
  width: 40px;
  height: 20px;
  border-radius: 2px;
  background-color: #000000;
  background-color: rgba(0, 0, 0, 0.7);
  position: absolute;
  left: 50%;
}
.header .Rectangle-27 {
  width: 40px;
  height: 20px;
  border-radius: 2px;
  background-color: #000000;
  background-color: rgba(0, 0, 0, 0.7);
  position: absolute;
  left: 80%;
}
.ranking-content {
  width: 100%;
  /* margin-left: -20px; */
}
.ranking-content .ranking-main {
  width: 100%;
  border-top: rgba(0, 0, 0, 0.1) 1px solid;
  margin: 0 auto;
}
.ranking-main ul li {
  float: left;
  width: 100%;
}
.ranking-main .Oval-7 {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #fff;
  margin: 10px auto;
  /* margin-left: 16px; */
  float: left;
}
.Oval-7 img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.ranking-main .ranking-name {
  float: left;
  font-size: 14px;
  font-weight: 500;
  line-height: 60px;
  text-align: left;
  color: #ffffff;
  margin-left: 9px;
  max-width: 25%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.ranking-main .money {
  font-size: 18px;
  font-weight: 500;
  line-height: 60px;
  color: #ffffff;
  float: right;
}
.ranking-me {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 60px;
  border-top: rgba(0, 0, 0, 0.1) 1px solid;
  /* padding: 0 20px; */
  box-sizing: border-box;
  /* 分享出去的排行榜加入的背景图片 */
}
.ranking-me li {
  padding: 0 20px;
  width: 100vw;
  box-sizing: border-box;
}
#haha {
  /* height: 285px!important; */
  overflow-y: auto;
  -webkit-overflow-scrolling:touch;
}
#haha ul{
  -webkit-overflow-scrolling:touch;  
}
.ranking-tip {
  /* text-align: center;
  line-height: 60px;
  font-size: 16px;
  color: #fff; */
  /* background: url("../assets/img/btn-bj.png"); */
  /* position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 60px;
  background: #8c0ce5; */
  display: none;
}
#bottom {
  width: 100%;
  background: linear-gradient(left, #8c0ce5, #820bf1);
  background: -webkit-linear-gradient(left, #8c0ce5, #820bf1);
}
</style>
