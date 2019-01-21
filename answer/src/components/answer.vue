<template>
<div class="answer bg" :style="'height:'+screenHeight+'px'" ref="answer">
  <img src="../assets/img/runoffbj@2x.png" class="runoff" v-show="reqTimes==totalNum">
	<div class="runoff answer-content" :style="(reqTimes==totalNum||'background:#fff;')+'height:'+screenHeight*0.61+'px'">
    <div>
      <div class="results-header lf">
        <div class="icon_user">
        </div>
        <div class="layer">{{parseInt($store.state.gameInfo.people*1 + allUsers*1)}}人</div>
      </div>
    </div>
    <!-- 倒计时 -->
    <div class="timedown" v-show="isDown">
      <canvas id="cvs" width="100" height="100"></canvas>
      <p id="time" v-show="!isStory" class="time-content" :class="reqTimes==totalNum && 'last-game-name'">{{countDown}}</p>
      <p v-show="isStory" class="time-content story-title" :class="reqTimes==totalNum && 'last-game-name'">解答</p>
    </div>
    <div v-if="guanzhan" class="notice-board guanzhan-notice rt">
        <p>观战中</p>
    </div>
    <div v-if="!guanzhan" class="notice-board fuhuo-notice rt">
        <p>{{$store.state.userInfo.card_num}}</p>
    </div>
	  <div class="content">
      <transition name="fade">
		  <div v-if="!isStory">
        <div class="num" v-if="reqTimes && (reqTimes!=totalNum) ">
          <span style="color:#d23823">{{reqTimes}}</span>/<span>{{totalNum}}</span>
        </div>
        <div v-if="reqTimes==totalNum" class="lastOne">决胜题</div>
    	  <div class="content-title">
			    <p :class="reqTimes==totalNum && 'last-game-name'">{{problem.question}}</p>
        </div>
        <div class="answer-list">
		      <ul>
			      <li @click="choose(index)" v-for="(item,index) in problem.answer" :key="index"  class="choose" :class="item.css">
    		    {{ item.answer }}
            <span class="rt" v-if="showPercent">{{rightAnswer.statistics[index].choose}}</span>
			      </li>
            
		      </ul>
          <div v-show="showResult">
            <transition name="widen">
            <ul class="percent" v-if="showPercent">
			        <li @click="choose(index)" v-for="(item,index) in problem.answer" :key="index"  class="choose" :class="[rightAnswer.statistics[index].isRight?'clickStatus':index==userChoose?'wrong':'other']" :style="'width:'+rightAnswer.statistics[index].percent*76+'%'">
              </li>
		        </ul>
            </transition>
            <div v-show="!guanzhan">
              <div class="notice correct" v-show="!isWrong">
	  		        <img src="../assets/img/right@2x.png" alt="">
	  		        <p>正确</p>
  		        </div>
              <div class="notice error" v-show="isWrong">
                <img src="../assets/img/error@2x.png" alt="">
                <p>错误</p>
              </div>
            </div>
          </div>
          <div class="R-notice correct oneMore" v-show="oneMore">
                <p>复活！</p>
          </div>
          <div class="leave" v-if="isBonus">
            <div class="contents">
              <p>￥{{money}}</p>
              <p>恭喜获得本期奖金</p>
              <p>你简直太厉害了！</p>
              <div class="divide-share" @click="shareEvent">分享</div>
            </div>
          </div>
        </div>
      </div>
      </transition>
      <transition name="fade">
        <div v-if="isStory" class="jieda">
		      <div class="story" :class="reqTimes==totalNum && 'last-game-name'">{{problem.description}}</div>
          <div class="R-notice correct oneMore" v-show="timeOut">
            <p>超时！</p>
          </div>
        </div>
      </transition>
	  </div>
	</div>
  <leave ref="leave" :leaveMsg="leave" @stay="stay" @closeWindow="closeWindow"></leave>
  <fail v-if="showFail"></fail>
	<!-- 弹幕滚动区 -->
  <WebSocket ref="wsp" @listenFromChild="fn"></WebSocket>
  <!-- 分享的遮罩 -->
  <share v-if="showShare"></share> 
</div>
</template>
<script>
import leave from "./leave";
import { screenHeight } from "../assets/utils/sceenHeight";
import { countDown } from "../assets/utils/countDown";
import { shareToApp } from "../assets/utils/share";
import WebSocket from "./ws";
import share from "./share";
import fail from "./fail";
export default {
  name: "answer",
  components: {
    leave,
    WebSocket,
    share,
    fail
  },
  data() {
    return {
      guanzhan: false, //是否是观战模式
      sayBoard: false, ///
      showShare: false,
      showFail: false,
      isLate: false,
      continue: true,
      leave: {
        // 退出弹框组件
        isShowed: false,
        money: "",
        h1: "",
        p1: "",
        p2: "确定离开？",
        p3: "确定不要了么？",
        stay: "留下",
        leave: "离开"
      },
      isBonus: false,
      money: 0,
      screenHeight: 0, //手机屏幕高度
      countDown: 12, //答题时间0
      isDown: true, //倒计时开关
      showResult: false, //显示正确或错误总开关
      isWrong: false, //答案错误状态 
      isStory: false, //显示解答开关
      canClick: true, //可以选择答案开关
      showPercent: false, //显示答案状态开关
      oneMore: false, //显示复活开关
      timeOut: false, ///显示超时
      hasRevive: false, //是否复活过
      reqTimes: 0, ///当前题的题号
      totalNum: 0, //总共需要答题的数量
      problemList:[],
      problem: {},
      userChoose: 100, //用户选择答案
      rightAnswer: {},
      allUsers: 0
    };
  },
  methods: {
    choose: function(index) {
      var that = this;
      var _this = this;
      if (this.canClick && !this.guanzhan) {
        this.problem.answer[index].css = "clickStatus";
        this.userChoose = index;
        //发送用户选项给后台
        $.get({
          url: that.$store.state.url + "wendatwo/choosequestion",
          data: {
            openid: that.$store.state.userInfo.openid,
            activity_id: that.$store.state.gameInfo.activity_id,
            question_id: that.problem.id,
            answer_id: that.problem.answer[index].id,
            question_sort: that.reqTimes
          },
          success: function(data) {
            data = JSON.parse(data);
            // console.log(data);
          }
        });
      }

      this.canClick = false;
    },
    // 子组件传来的数据
    stay(data) {
      // console.log(data)
      this.leave.isShowed = data.isShowed;
    },
    
    closeWindow(data) {
      //按返回时弹出层的事件
      var that = this;
      this.leave.isShowed = false; // 退出弹窗消失
      $.get({
        url: that.$store.state.url + "wendatwo/isrevive", /// 失败后退出，发送死亡记录
        data: {
          openid: that.$store.state.userInfo.openid,
          activity_id: that.$store.state.gameInfo.activity_id,
          islive: 0
        },
        success: function(res) {
          res = JSON.parse(res);
          if (res.isdeath == 1) {
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
          }
        }
      });
    },
    shareEvent() {
      ///  分享接口
      this.isBonus = false;
      this.showShare = true;
      this.$store.state.shareSwitch = true;
    },
    fn(data) {
      // console.log("ws人数是..." + data);
      this.allUsers = data;
    }
  },
  mounted: function() {
    var that = this;
    var _this = this;
    this.screenHeight = screenHeight();
    this.$refs.answer.style.position = "relative";
    this.totalNum=this.$store.state.questionCount;
    /// sessionStorage 存储检测
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

    if (!_this.guanzhan) {
      _this.leave.money =
      _this.$store.state.gameInfo.amount_money / 10000 + "万";
      _this.leave.h1 = "本场奖金<strong>" + this.leave.money + "</strong>元";
      _this.leave.p1 = "本场奖金" + this.leave.money + "元！";
    }
    //分享接口
    // 10s答题 5s解答 3s统计 答题和解答中间空了一秒 防止定时器重叠闪
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
          link:"/answer/dist/#/userCanvas?openid=" +
            _this.$store.state.userInfo.openid,
          appId: data.appId,
          nonceStr: data.nonceStr,
          timestamp: data.timestamp,
          signature: data.signature
        });
        // console.log(_this.$store.state.shareInfo);
      }
    });

    var jiedaTime = 10, ///  解答时间
      jieguoTime = 3; ///  结果时间

    function doIt() {
      /// 请求问题的函数 //请求题目和选项
      if(that.reqTimes==0){
        if(sessionStorage.getItem("question")){
          var data=JSON.parse(sessionStorage.getItem("question"));
          that.problemList=data.question;
          that.problem =that.problemList[0];
          that.reqTimes++;
          countDown(that.countDown);
          setTimeout(jieda, (that.countDown+1) * 1000);
        }else{
          $.get({
            url: that.$store.state.url + "wendatwo/getquestion",
            data: {
              activity_id: that.$store.state.gameInfo.activity_id,
              openid: that.$store.state.userInfo.openid
            },
            success: function(data) {
              // console.log("===============请求到的问题=================");
              // console.log(data);
              data = JSON.parse(data);
              that.problemList=data.question;
              that.problem = that.problemList[0];
              that.reqTimes++;
              countDown(that.countDown); ///canvas 画图
              setTimeout(jieda, (that.countDown+ 1) * 1000);
            }
          });
        }  
      }else{
        that.reqTimes++;
        that.problem=that.problemList[that.reqTimes-1];
        countDown(that.countDown);
        setTimeout(jieda, (that.countDown+1) * 1000);
      }
      that.showResult = false;
      that.showPercent = false;
      that.isDown = true;
    }

    ///解答的函数
    function jieda() {
      if(that.reqTimes==0)that.reqTimes=1;
      $.get({
      url:that.$store.state.url + "wendatwo/questioncount", 
      data:{
        openid: that.$store.state.userInfo.openid,
        activity_id: that.$store.state.gameInfo.activity_id,
        question_sort: that.reqTimes
      },
      success:function(data){
        that.canClick = false;
        that.isDown = true;
        that.isStory = true;
        if (that.userChoose == 100 && !that.guanzhan) that.timeOut = true;
        countDown(jiedaTime);
        data = JSON.parse(data);
        var arr = [];
        for (var i=0;i<that.problem.answer.length;i++) {
          arr.push(data.statistics[that.problem.answer[i].id]);
        }
        for (var i=0;i<arr.length;i++) {
          if (arr[i].isRight === 1) {
            data.answerIndex = i;
          }
        }
        data.statistics = arr;
        that.rightAnswer = data;
        that.problem.answer[that.rightAnswer.answerIndex].css = "white";
        if (that.problem.answer[that.userChoose])
          that.problem.answer[that.userChoose].css = "white";
        setTimeout(jieguo, jiedaTime * 1000);
      }
      })
    }

    /// 结果
    function jieguo() {
      that.timeOut = false;
      that.isStory = false;
      that.showResult = true;
      that.showPercent = true;
      that.isDown = false;
      $("#time").html("");
      if (that.userChoose == that.rightAnswer.answerIndex || that.guanzhan) {
        that.isWrong = false;
        setTimeout(daduile, jieguoTime * 1000);
      } else {
        that.isWrong = true;
        //不是12题
        if (that.reqTimes != _this.totalNum) {
          //没有复活机会
          if (that.hasRevive) {
            //弹出击败多少人
            fail();
          } else {
            //复活
            //给服务器发请求复活次数-1
            var chaoshi = 0;
            if (that.userChoose == 100) chaoshi = 1;
            $.get({
              url: that.$store.state.url + "wenda/revive",
              data: {
                openid: that.$store.state.userInfo.openid,
                activity_id: that.$store.state.gameInfo.activity_id,
                question_id: that.problem.id,
                question_sort: that.reqTimes,
                overtime: chaoshi
              },
              success: function(data) {
                data = JSON.parse(data);
                if (data.state == 1) {
                  setTimeout(fuhuo, jieguoTime * 1000);
                  that.hasRevive = true;
                  that.$store.state.userInfo.card_num--;
                } else {
                  fail();
                }
              }
            });
          }
        } else {
          //是第12题
          that.continue = false;
          that.$store.state.beatNum =
            that.$store.state.gameInfo.people -
            that.rightAnswer.statistics[that.rightAnswer.answerIndex].choose;
          that.showFail = true;
          setTimeout(() => {
            goResults();
          }, jieguoTime * 1000);
        }
      }
    }

    function fail() {
      /// 失败的函数
      $.get({
        url: that.$store.state.url + "wendatwo/isrevive",
        data: {
          openid: that.$store.state.userInfo.openid,
          activity_id: that.$store.state.gameInfo.activity_id,
          islive: 0
        },
        success: function(data) {
          data = JSON.parse(data);
          if (data.isdeath == 1) {
            setTimeout(() => {
              //开始观战模式
              that.guanzhan = true;
              var people = sessionStorage.getItem("people") * 1;
              that.$store.state.beatNum = parseInt(
                that.$store.state.gameInfo.people * 1 +
                  people -
                  that.rightAnswer.statistics[that.rightAnswer.answerIndex].choose
              );
              that.showFail = true;
              that.userChoose = 100;
              jiedaTime = 10;
              jieguoTime = 3;
              doIt();
            }, jieguoTime * 1000);
          }
        }
      });
    }

    function daduile() {
      ///答对了执行的函数
      that.userChoose = 100;
      that.showResult = false;
      that.showPercent = false;
      that.canClick = true;
      if (that.reqTimes < _this.totalNum) {
        that.isDown = true;
        //请求下一题
        jiedaTime = 10;
        jieguoTime = 3;
        doIt();
      } else {
        //弹出获得奖金
        if (!that.guanzhan) {
          $.get({
            url:that.$store.state.url + "wendatwo/activitycount",
            data:{
              activity_id: that.$store.state.gameInfo.activity_id,
              openid: that.$store.state.userInfo.openid
            },
            success:function(data){
              data = JSON.parse(data);
              that.money = data[0].money;
              that.isBonus = true;
              goResults();
            }
          })
        } else {
          that.continue = false;
          for (var p of that.problem.answer) {
            p.css = "";
          }
          goResults();
        }
      }
    }

    function fuhuo() {
      /// 复活接口函数
      that.oneMore = true;
      setTimeout(() => {
        that.oneMore = false;
      }, 2000);
      that.userChoose = 100;
      that.showResult = false;
      that.showPercent = false;
      that.canClick = true;
      if (that.reqTimes < _this.totalNum) {
        that.isDown = true;
        //请求下一题
        jiedaTime = 10;
        jieguoTime = 3;
        doIt();
      } else {
        //弹出获得奖金
        if (!that.guanzhan) {
          that.isBonus = true;
          goResults();
        } else {
          that.continue = false;
          for (var p of that.problem.answer) {
            p.css = "";
          }
          goResults();
        }
      }
    }
    function goResults() {
      ///去结果页
      setTimeout(() => {
        that.$router.push({ path: "/results" });
      }, 3000);
    }
    if(!that.$store.state.userInfo.openid || !that.$store.state.gameInfo.activity_id){
      window.location.href = _this.$store.state.url+"wenda/auth";
    }
    
    if(sessionStorage.getItem('timeRound')){
      // nowTime = new Date()*1 - sessionStorage.getItem('timeRound');
      doIt();
      sessionStorage.setItem('timeRound','');
    }else{
      $.get({
        /// 判断用户是否有权答题
        url: that.$store.state.url + "wendatwo/isrevive",
        data: {
          openid: that.$store.state.userInfo.openid,
          activity_id: that.$store.state.gameInfo.activity_id,
          islive: 1 ///若  1  请求判断用户是否有权答题    0  ->  告诉后台用户已经死了
        },
        success: function(data) {
          data = JSON.parse(data);
          // console.log(
          //   "判断用户是否活着返回的信息==================第一次==========="
          // );
          // console.log(data);  //返回结果  0  ->  没死    1  ->  死了
          var n = 0;
          var nowTime = data.time;
          // 如果时间毫秒数小于等于开始答题时间
          // console.log("用户进来时间" + nowTime);
          // console.log(
          //   "游戏开始时间" + that.$store.state.gameInfo.start_time / 1000
          // );
          // console.log("客户端时间" + new Date().getTime());
          if (nowTime == that.$store.state.gameInfo.start_time / 1000) {
            doIt();
          } else if (
            nowTime > that.$store.state.gameInfo.start_time / 1000 &&
            nowTime <
              that.$store.state.gameInfo.start_time / 1000 + that.countDown &&
            data.isdeath == 0
          ) {
            // console.log("============用户进入 开始答题===========");
            //开始时间<如果当前时间<开始后+10秒 正在答题
            if(sessionStorage.getItem("question")){
              var data = JSON.parse(sessionStorage.getItem("question"));
                that.problemList=data.question;
                that.problem = that.problemList[0];
                that.reqTimes++;
              n =nowTime-that.$store.state.gameInfo.start_time/1000;
              countDown(that.countDown-n),
              setTimeout(jieda, (that.countDown-n+1) * 1000);
            }else{
              $.get({
                url: that.$store.state.url + "wendatwo/getquestion",
                data: {
                  activity_id: that.$store.state.gameInfo.activity_id,
                  openid: that.$store.state.userInfo.openid
                },
                success: function(data) {
                  data = JSON.parse(data);
                  that.problemList=data.question;
                  that.problem = that.problemList[0];
                  that.reqTimes++;
                  n =nowTime-that.$store.state.gameInfo.start_time/1000;
                  countDown(that.countDown-n),
                  setTimeout(jieda, (that.countDown-n+1) * 1000);
                }
              });
            }
          } else if (
            nowTime >
              that.$store.state.gameInfo.start_time / 1000 + that.countDown ||
            data.isdeath == 1
          ) {
            that.reqTimes=Math.ceil((nowTime-that.$store.state.gameInfo.start_time/1000)/26);
            if(that.reqTimes<=that.totalNum){
            $.get({
              url: that.$store.state.url + "wendatwo/getquestion",
              data: {
                activity_id: that.$store.state.gameInfo.activity_id,
                openid: that.$store.state.userInfo.openid
              },
              success: function(data) {
                data = JSON.parse(data);
                that.guanzhan = true;
                that.problemList=data.question;
                that.problem = that.problemList[that.reqTimes-1];
                n =(nowTime-that.$store.state.gameInfo.start_time/1000)%26;
                if (n<that.countDown) {
                  countDown(that.countDown-n),
                    setTimeout(jieda, (that.countDown-n+1) * 1000);
                } else if (n <= that.countDown+jiedaTime+1 && n>=that.countDown) {
                  jiedaTime = that.countDown+jiedaTime+1-n;
                  jieda();
                } else {
                  jieguoTime =that.countDown+jiedaTime+jieguoTime+1-n;
                  jieguo();
                }
              }
            });
          }
          } else {
            console.log("来早了");
            var earlyTime =
              that.$store.state.gameInfo.start_time - nowTime * 1000;
            setTimeout(() => {
              doIt();
            }, earlyTime);
          }
        }
      });
    }
  }
};
</script>
<style lang="css" scoped>
img {
  width: 100%;
  height: 100%;
}
.answer {
  width: 100%;
  overflow: hidden;
  position: relative;
}
.runoff {
  width: 93%;
  height: 61%;
  border-radius: 4px;
  position: absolute;
  top: 14px;
  left: 3.5%;
}
.answer-content {
  box-sizing: border-box;
  padding-top: 10px;
}
.results-header {
  margin-left: 16px;
}
.fuhuo-notice {
  width: 30px;
  background: url("../assets/img/home-icon-heart.png") no-repeat;
  background-size: 100% 100%;
  margin-right: 12px !important;
}
.notice-board {
  text-align: center;
  font-size: 14px;
  color: #fff;
  line-height: 28px;
  height: 28px;
  position: fixed;
  top: 24px;
  right: 3.5%;
}
.guanzhan-notice {
  width: 64px;
  background: linear-gradient(left, #ffae00, #ff1200);
  background: -0-linear-gradient(left, #ffae00, #ff1200);
  background: -moz-linear-gradient(left, #ffae00, #ff1200);
  background: -webkit-linear-gradient(left, #ffae00, #ff1200);
  border-radius: 14px 0 0 14px;
}
.timedown {
  text-align: center;
  width: 100%;
  position: relative;
  height: 100px;
}
#cvs {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
}
.time-content {
  position: absolute;
  left: 0;
  top: 0;
  font-weight: bold;
  width: 100%;
}
#time {
  color: #d23823;
  font-size: 36px;
}
.story-title {
  font-size: 18px;
  color: #000;
}
.jieda {
  position: absolute;
  left: 0;
  top: -15px;
  padding: 0 5vw;
}
.num {
  font-size: 22px;
  font-weight: 500;
  margin-left: 10% !important;
}
.content {
  width: 100%;
  position: absolute;
  top: 80px;
}
.last-game-name {
  color: #fff !important;
}
.lastOne {
  color: #fff;
  font-size: 24px;
  margin-left: 10%;
}
.content-title {
  width: 80%;
  height: 40px;
  line-height: 20px;
  border-radius: 4px;
  margin: 5px auto;
}
.content-title p {
  font-size: 18px;
  line-height: 24px;
  text-align: left;
  color: #333333;
}
.choose {
  margin-top: 13px !important;
}
.white {
  color: #d4c9ee !important;
}
.clickStatus {
  border: none;
  background-color: #820bf2;
  color: #d4c9ee;
}
.wrong {
  border: none;
  background: #d23823;
}
.other {
  border: none;
  background: #dddddd;
}
.notice {
  width: 114px;
  height: 28px;
  border-radius: 14px;
  position: fixed;
  top: 24px;
  left: 50%;
  margin-left: -57px;
  display: flex;
  flex: 1;
  flex-direction: row;
  color: #ffffff;
  font-size: 16px;
  font-weight: 500;
  box-sizing: border-box;
}
.R-notice{
  width:70px;
  height:28px;
  position: fixed;
  top: 24px;
  right:20%;
  color:#fff;
  font-size:16px;
  line-height: 28px;
  text-align: center;
  border-radius: 14px;
  font-weight: bold;
}
.notice img {
  width: 14px;
  height: 14px;
  margin-top: 7px;
  margin-left: 20px;
}
.notice p {
  margin: 0 20px;
  line-height: 28px;
}
.oneMore p {
  margin: 0;
  width: 100%;
  text-align: center;
}
.correct {
  background-color: #820bf2;
}
.error {
  background-color: #d23823;
}
/* 弹幕区 */
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
.story {
  font-size: 18px;
  line-height: 1.71;
  color: #333333;
  margin-top: 38px;
}
.answer-list li {
  white-space: nowrap;
  overflow: hidden;
}
.answer-list span {
  margin-right: 20px;
}
.percent {
  margin-top: -174px;
  text-align: left;
}
.percent > li {
  border-radius: 30px 0 0 30px;
}
.leave {
  width: 100vw;
  height: 100vh;
  position: fixed;
  overflow: hidden;
  top: 0;
  left: 0;
  z-index: 9999;
  text-align: center;
  background: rgba(0, 0, 0, 0.6);
}
.leave .contents {
  width: 375px;
  height: 350px;
  margin-top: 123px;
  border: 1px solid transparent;
  background: url("../assets/img/pop-bj.png") center top no-repeat;
  background-size: 100% 100%;
}
.leave .contents h1 {
  width: 100%;
  height: 50px;
  margin-top: 76px;
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 14px;
}
.leave .contents h1 strong {
  font-size: 36px;
  font-weight: 600;
}
.leave .contents p {
  width: 100%;
  font-size: 16px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.63;
  letter-spacing: normal;
  color: #ffffff;
}
.leave .contents p:nth-child(1) {
  margin-top: 129px;
  font-size: 30px;
}
.leave .contents p:nth-child(2) {
  font-size: 14px;
  color: #ffeca2;
}
.leave .contents p:nth-child(3) {
  font-size: 22px;
  color: #ffeca2;
}
.divide-share {
  width: 194px;
  height: 30px;
  line-height: 30px;
  margin: 0 auto;
  border-radius: 27px;
  background-color: #ffffff;
  color: #d23823;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  margin-top: 35px;
}
.widen-enter-active,
.widen-leave-active {
  transition: width 0.5s;
}
.widen-enter,
.widen-leave-to {
  width: 0;
}
</style>
