<template>
    <div id="leave" v-show="leaveMsg.isShowed">
        <div class="content">           
            <h1 v-html="leaveMsg.h1"></h1>
            <p v-html="leaveMsg.p1"></p>
            <p v-html="leaveMsg.p2"></p>
            <p v-html="leaveMsg.p3"></p>
            <div class="stay" @click="stay" v-text="leaveMsg.stay"></div>
            <div class="leave" @click="closeWindow" v-text="leaveMsg.leave"></div>
        </div>

        
    </div>
</template>
<script>
/**
引用时父组件需要设置的变量
leave: {
    // 退出弹框组件
            isShowed: false,
            money:'10万',
    h1:'本场奖金<strong>10万</strong>元',
    p1:'本场奖金10万元！',
    p2:'确定离开？',
    p3:'确定不要了么？',
    stay:"留下",
    leave:'离开'
    },

    ==========html样式
    <leave :leaveMsg="leave" @stay="stay" @closeWindow="closeWindow"></leave>

    @stay  // 点击上面按钮触发的事件
    @closeWindow  //点击下面按钮触发的事件

*/

export default {
  data() {
    return {};
  },
  props: {
    leaveMsg: {
      type: Object
    }
  },
  mounted() {
    // alert(111)
    var _this = this;
    // window.history.pushState({title:"title",url:"#"}, "title", "#");
    window.history.pushState(
      { page: 1 },
      "title",
      "#" + this.$route.path + "?page=answer"
    );

    window.addEventListener("popstate",a,false);
    function a(){
      // alert(1)
      var active = _this.$store.state.gameInfo.start_time
      // console.log(active)
      var sysTime = Date.parse(new Date());
      // console.log(sysTime)
      if ((_this.$store.state.gameInfo.activity_exists == 0 && _this.$route.path == '/' && active - sysTime <= 0)||_this.$parent.guanzhan) {
        // console.log(_this.$store.state.gameInfo.activity_exists, "测试离开");
          _this.$parent.leave.isShowed = false;
          window.removeEventListener("popstate",a,false)
      } else {
        // console.log(_this.$store.state.gameInfo.activity_exists, "测试离开1");
        _this.$parent.leave.isShowed = true;
      }
    }
    // console.log(this.$route)
  },
  methods: {
    stay() {
      this.$emit("stay", { isShowed: false });
      window.history.pushState(
        { page: 1 },
        "title",
        "#" + this.$route.path + "?page=" + this.$route.name
      );
      return false;
    },
    closeWindow() {
      this.$emit("closeWindow", { close: true });
    }
  }
};
</script>
<style scoped>
#leave {
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
.content {
  width: 375px;
  height: 394px;
  margin: auto;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 1px solid transparent;
  background: url("../assets/img/popup-bj.png") center top no-repeat;
  background-size: 100% 100%;
}
.content h1 {
  width: 100%;
  height: 50px;
  margin-top: 76px;
  font-family: HelveticaNeue;
  font-size: 24px;
  font-weight: 700;
  font-style: normal;
  font-stretch: condensed;
  line-height: normal;
  letter-spacing: normal;
  color: #ffffff;
  margin-bottom: 14px;
}
.content h1 strong {
  font-size: 36px;
  font-weight: 600;
}
.content p {
  width: 100%;
  font-family: PingFangSC;
  font-size: 16px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.63;
  letter-spacing: normal;
  color: #ffffff;
}
.stay {
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
.leave {
  width: 100%;
  height: 20px;
  margin-top: 16px;
  font-family: PingFangSC;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: #ffffff;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}
</style>

