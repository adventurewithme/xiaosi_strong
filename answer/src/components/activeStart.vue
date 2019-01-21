<template>
  <div id="startshow" v-show="activeStart.startshow">
      <!--  错过了比赛的页面 -->
        <div class="content">
            <h1 v-html="activeStart.h1"></h1>
            <p v-html="activeStart.p1"></p>
            <p v-html="activeStart.p2"></p>
            <p v-html="activeStart.p3"></p>
            <div class="stay" @click="stays" v-text="activeStart.stay"></div>
            <div class="leave" @click="closeWindows" v-text="activeStart.leave"></div>
            <!-- <h1>你来晚了</h1>
            <p>比赛已经开始了</p>
            <p>你无法参加本轮比赛</p>
            <p>但仍然可以继续围观和讨论</p>
            <div class="stay" @click="stays">继续观看比赛</div>
            <div class="leave" @click="closeWindows">取消</div> -->
        </div>
    </div>
</template>

<script>
import Vue from "vue";
export default {
  data() {
    return {
        startshow:true
    };
  },
  props: {
    activeStart: {
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

    window.addEventListener(
      "popstate",
      function(e) {
        // alert(1)
        // _this.$parent.leave.isShowed = true;
        // alert("我监听到了浏览器的返回按钮事件啦");//根据自己的需求实现自己的功能
      },
      false
    );
    // console.log(this.$route)
  },
  methods: {
    stays() {
      this.$emit("stays", { startshow: false });
      window.history.pushState(
        { page: 1 },
        "title",
        "#" + this.$route.path + "?page=" + this.$route.name
      );
      return false;
    },
    closeWindows() {
      this.$emit("closeWindows", { startshow: true });
    }
  }
};
</script>
<style scoped>
    #startshow{
        width:100vw;
        height: 100vh;
        position: absolute;
        overflow: hidden;
        top:0;
        left:0;
        z-index: 9999;
        text-align: center;
        background:rgba(0,0,0,.6);
    }
    .content{
        width: 375px;
        height: 394px;
        margin:auto;
        position: absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
        border:1px solid transparent;
        background:url('../assets/img/popup-bj.png') center top no-repeat;
        background-size:100% 100%;
    }
    .content h1{
        width: 100%;
        height: 50px;
        margin-top:76px;
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
    .content h1 strong{
        font-size: 36px;
        font-weight: 600;
    }
    .content p{
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
    .stay{
        width: 194px;
        height: 44px;
        line-height: 44px;
        margin:0 auto;
        border-radius: 27px;
        background-color: #ffffff;
        color: #d23823;
        font-size: 18px;
        font-weight: 600;
        cursor:pointer;
        -webkit-tap-highlight-color: transparent;
        margin-top:28px;
    }
    .leave{
        width: 100%;
        height: 20px;
        margin-top:16px;
        font-family: PingFangSC;
        font-size: 14px;
        font-weight: 500;
        text-align: center;
        color: #ffffff;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
    }
</style>
