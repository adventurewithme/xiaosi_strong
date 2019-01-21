<template>
    <div class="ws" ref="ws">
      <transition name="fade">
        <p class="toast" v-if="toast" v-text="toastMsg">发送过于频繁</p>
      </transition>
      <div class="hostess" ref="hostess">
        <div class="intro clearfix">
          <img class="lf" src="../assets/img/uesr-head@3x.png" alt="">
          <span class="lf">主持人：无敌霹雳美少女</span>
        </div>
        <div class="hostess-say">
          <img class="lf" src="../assets/img/icon-microphone@3x.png" alt="">
          <p class="lf" v-text="hostessSay"></p>
        </div>
      </div>
        <div class="content" ref="content">
            <div :class="{markinput:item.name==$store.state.userInfo.nickname}" :ref="key==(users.length-1)?'contentLast':''" v-for="(item,key) in users" :key="key" >
                <p v-if="item.name">
                  <span class="markinput">{{item.name}}</span> : <span>{{item.words}}</span>
                </p>
                <p v-else class="clearfix hosts">
                  <img class="lf" src="../assets/img/icon-microphone@3x.png" alt="">
                  <span class="lf">{{item.words}}</span>
                </p>
            </div>
        </div>
        <div class="input-board clearfix" ref="wsCon" v-show="this.wsocketBtnShow">
          <img class="send-content rt" v-show="!inputShow" @click="sayBoard" src="../assets/img/icon-message.png" alt="">
        </div>
        <div :class="{'clearfix':true,'sayboard':true,'active':inputShow}">
          <input id='sayBoardInput' class="lf" ref="sayBoardInput" type="text" @input="wsInput" @focus="inputFocus" v-model="wsValue" placeholder="7s内只能发言一次哦~">
          <div class="lf sayboard-send" @click="wsSend" v-text="wsSendBtnCon"></div>
        </div>
    </div>
</template>
<script>          
import illegal from "../assets/utils/illegal";
import hostessCon from "../assets/utils/hostessCon";
import { screenHeight } from "../assets/utils/sceenHeight";
export default {
  name: "WebSocket",
  data() {
    return {
      users: [],
      inputShow: false,  //输入框是否显示
      wsValue: "",
      wsocket: null,
      inputReady:true,
      wsocketBtnShow:false,
      wsSendBtnCon:'收起',
      wsPeople:0,
      hostessSay:'欢迎大家参加理财超人答题活动！',
      hostessOpenid:['oKw4s0qIuNidJ6YxPHrh74flRWTA',
                      'oKw4s0nwWY_I7RKXMAhVvUANJgGU',
                      'oaSjVwfSig2Y3Qy4ETalfmkNmwvY',  ///杜厉害想变成纸片人 测试
                      'oaSjVwaq032KX88y__rTRIB8ncKk' ///qiphon 测试
                    ], ///主持人的openID
      isHostess:false,
      isHostessSay:false,
      toast:false,
      toastMsg:'',
      robotTimeOut: null,  ///机器人倒计时
      robotInterval: null  ///机器人倒计时
    };
  },
  methods: {
    inputHide(){
      this.$refs.sayBoardInput.blur();
      this.inputShow = false;
      this.wsocketBtnShow = false;
    },
    sayBoard() {
      var _this = this;
      if(this.wsValue){
        this.wsSendBtnCon = "发送";
      }else{
        this.wsSendBtnCon = "收起";
      }
      this.inputShow = !this.inputShow;
      _this.$refs.sayBoardInput.focus();
      // var sceenHeight=screenHeight();
      // scroll(0,sceenHeight);
    },
    inputFocus(){
      var _this = this;
      setTimeout(function(){
        $('#app').scrollTop(9999)
        $('body').scrollTop(9999)
        document.documentElement.scrollTop =999;
        document.body.scrollTop =999;
      },500)
    },
    wsInput() {
      // this.on('resize',function(){
      //   console.log(11)
      // })
      this.wsValue = this.wsValue.replace(new RegExp(illegal, "ig"), "**");
      if(!this.wsValue){
        this.wsSendBtnCon = "收起";
      }else{
        this.wsSendBtnCon = "发送";
      }
      if(this.wsValue.length>=22){
        this.wsValue = this.wsValue.slice(0,22);
      }
    },
    clearRobot(){ 
      ////清空机器人
      clearInterval(this.robotInterval);
      clearTimeout(this.robotTimeOut);
    },
    wsSend() {
      var _this = this;
        // this.$refs.sayBoardInput.blur();
        // console.log(this.wsValue)
        // console.log(!this.wsValue.trim())
      if(!this.wsValue.trim()){
        _this.inputShow = false;
        _this.wsocketBtnShow = true;
        // _this.toast = true;
        // this.toastMsg = '消息不能为空';
        // setTimeout(function(){
        //   _this.toast = false;
        // },1800)
        return;
      }
      
      // console.log(this.inputReady)
      // console.log(this.isHostess)
      if(!this.inputReady){
        _this.inputShow = false;
        _this.wsocketBtnShow = true;
        _this.toast = true;
        this.toastMsg = '发言过于频繁';
        setTimeout(function(){
          _this.toast = false;
        },1800)
        return;
      }
      if (this.inputReady && !this.isHostess) {
        // console.log('--------')
        // console.log(this.inputReady,this.isHostess)
        _this.inputReady = false;
        setTimeout(function(){
          // _this.wsocketBtnShow = true;
          // console.log(_this.inputReady)
          _this.inputReady =true;
        },7000)
      }
      var obj = {
        name: _this.$store.state.userInfo.nickname?_this.$store.state.userInfo.nickname:'□',
        activity_id:_this.$store.state.gameInfo.activity_id,
        openid:_this.$store.state.userInfo.openid,
        // activity_id:$store.state.gameInfo.activity_id,
        words: _this.wsValue.slice(0,50),
        // activity_id:_this.$store.state.activity_id
      };
      if(!this.isHostess){
        _this.users.push({
          name: obj.name,
          words: obj.words
        });
      }
        // console.log(obj)
      var obj1 = JSON.stringify(obj);
      _this.wsocket.send(obj1);
      this.wsValue = "";
      this.inputShow = !this.inputShow;
      if(this.$refs.content)
      this.$refs.content.scrollTop += 999;
      // this.$refs.wsCon.style.scrollTop='100%';
    }
  },
  mounted() {
    var _this = this;
    ////清空机器人
    clearInterval(this.robotInterval);
    clearTimeout(this.robotTimeOut);
    var hostessLen = this.hostessOpenid.length;
    // console.log(this.hostessOpenid)
    for(let i=0 ;i < hostessLen; i++){
      if(_this.$store.state.userInfo.openid === _this.hostessOpenid[i]){
        _this.isHostess = true;
      }
    }
    ////sessionStorage     
    this.$refs.ws.style.height= screenHeight() * 0.35 + 'px';

    // _this.$store.state.gameInfo.people = 756;
    // console.log(WebSocket in window)
    this.wsocket = new WebSocket("wss://www.xiaositv.com:6443");
    this.wsocket.onopen=function(){
      // alert('websocket ok')
      _this.wsocketBtnShow = true;
      // console.log(_this.isHostess)
    }
    this.wsocket.addEventListener("message", function(evt) {
      evt = JSON.parse(evt.data);
      // console.log('======================websocket接收的内容=====================')
      // console.log(evt);
      ///计算总人数
      if(evt.peopleNum>0){
        _this.$emit('listenFromChild',evt.peopleNum);
        sessionStorage.setItem("people",evt.peopleNum);
      }
      ///弹幕滚动
      if(_this.$refs.content){
        setTimeout(function(){
          _this.$refs.content.scrollTop += 999;
        },1000)
      }
      // console.log(evt)
      /// 判断是否是服务器主动推的人数
      if(evt.serverSend==1){
        return false;
      }
      // console.log(evt)
      /// 判断说话的是不是主持人
      for(let i =0; i<hostessLen ;i++){
        if(evt.openid === _this.hostessOpenid[i]){
          _this.isHostessSay = true;
        }
      }
      // console.log(_this.isHostessSay)
      /// 如果是主持人说的
      if(_this.isHostessSay){
        _this.hostessSay = evt.words;
        _this.users.push({
          name:'',
          words: evt.words
        });
        _this.isHostessSay = false;
        return;
      }
      /// 如果是自己说的
      if(evt.openid==_this.$store.state.userInfo.openid){
        return;
      }
      /// 普通用户发的
      _this.users.push({
        name: evt.name,
        words: evt.words
      });
    });

    ///自动发言  
    // var hostessI = 0;
    // var hostessLen = hostessCon.length;
    // var chaTime = sessionStorage.getItem('timeRound')?sessionStorage.getItem('timeRound'):0;
    // var robotTime = (_this.$store.state.gameInfo.start_time - new Date()*1 + chaTime)<30000?(_this.$store.state.gameInfo.start_time - new Date()*1 + chaTime):0;
    // if(robotTime >0 ){
    //   hostessI = 0;
    // }else{
    //   hostessI = hostessLen - Math.floor((_this.$store.state.gameInfo.start_time - new Date()*1 + chaTime - 30000)/6000); 
    //   if(_this.$store.state.gameInfo.start_time - new Date()*1 + chaTime - 30000<0){
    //     hostessI = 0;
    //   }
    // }
    // _this.robotTimeOut = setTimeout(()=>{
    //   if(_this.$route.path =='/preheat'){
    //     _this.robotInterval = setInterval(function(){
    //       chaTime = sessionStorage.getItem('timeRound')?sessionStorage.getItem('timeRound'):0;
    //       hostessI = hostessLen - Math.floor((_this.$store.state.gameInfo.start_time - new Date()*1 + chaTime*1 - 30000)/6000);
    //       if(hostessI >=hostessLen){clearInterval(_this.robotInterval);return;}
    //       _this.hostessSay = hostessCon[hostessI];
    //       hostessI++;
    //     },6000)
    //   }
    // },robotTime)
  }
};
</script>
<style scoped>
* {
  box-sizing: border-box;
}
.markinput {
  color: #3dfffd;
  line-height: 19px;
}
.ws {
  width: 100vw;
  height: 35%;
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 5;
  font-size: 16px;
  line-height: 1.8;
  padding-top:57px;
  box-sizing: border-box;
  /* background: #8c0ce6; */
}
/* 吐司提示 */ 
.toast{
  position: absolute;
  top:0;
  left:50vw;
  width:150px;
  margin-left:-75px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background:rgba(0,0,0,.8);
  color:#fff;
  z-index: 999;
}
/**
* 主持人位置
*/ 
.ws .hostess{
  position: absolute;
  top:0;
  left:0;
  width:100vw;
  height: 70px;
  padding:0 16px;
  box-sizing: border-box;
}
.hostess img{
  width:22px;
  height: auto;
  margin-right: 5px;
}
.hostess .intro{
  margin-bottom:4px;
  margin-top: 10px;
}
.hostess .intro span{
  color:#fffd00;
  line-height: 30px;
  margin-left: 10px;
  font-size: 14px;
}
.hostess-say p{
  color:#fffd00;
  font-size: 14px;
}
.hostess-say img{
  margin-right:14px;
}
.ws .send-content {
  width: 40px;
  height: 39px;
  margin: 0 16px 16px 0;
  z-index: 6;
}
.ws .content {
  overflow: auto;
  height: 100%;
  overflow-x:hidden;
  padding:10px 16px 0 16px;
  color: #fff;
  -webkit-overflow-scrolling: touch;
}
.ws .content span{
  font-size: 14px;
}
/* 主持人消息样式 */
.ws .hosts img{
  width:22px;
  height: auto;
  margin:5px 5px 0 0;
}
.ws .hosts span{
  color:#fffd00;
  line-height: 30px;
  margin-left: 10px;
  font-size: 14px;
}

.ws .input-board {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100vw;
}
.sayboard {
  position: fixed;
  left: 0;
  bottom:0;
  width: 100vw;
  transform: scale(0);
  font-size: 20px;
  line-height: 40px;
  transition: all 0.3s;
  background:#fff;
  padding:12px 0;
}
.ws .active {
  transform: scale(1);
  will-change: transform;
}
.sayboard input {
  width: 280px;
  height: 40px;
  font-size:16px;
  line-height:24px;
  margin-left: 17px;
  vertical-align: top;
  border-radius: 0;
  border-radius: 8px;
  padding: 8px 6px;
  outline: none;
  border: 1px solid #ccc;
  background: #F8F8F8;
}
.sayboard .sayboard-send {
  width: 55px;
  height: 40px;
  border-radius: 4px;
  margin-left: 10px;
  text-align: center;
  background: #7528EA;
  color:#fff;
}
</style>


