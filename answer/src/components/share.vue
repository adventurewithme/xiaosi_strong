<template>
  <div class="main" :style="'height:'+screenHeight+'px'" v-if="$store.state.shareSwitch">
    <input type="text" ref="clickboard" v-model="$store.state.userInfo.code" class="copyboard">
    <div class="shadow" v-if="showModal" @click="close">
      <img src="../assets/img/guide.png" class="rt">
      <div class="modal" @click="handleClick">
        <div>
          <p>邀请好友填写邀请码，获得额外复活机会</p>
          <p class="invite-code" id="data" ref="data">{{$store.state.userInfo.code}}</p>
          <p class="copy-code"
              v-clipboard:copy="$store.state.userInfo.code"
              v-clipboard:success="onCopy"
              v-clipboard:error="onCopyError">点击复制邀请码</p>
        </div>
        <div>
          <p>复活机会的使用规则： </p>
          <p>1. 好友填写你的邀请码，你和好友各获得一次复活机会。</p>
          <p>2. 复活机会在回答错误时将自动使用。</p>
          <p>3. 每场比赛仅可使用一次复活机会。</p>
        </div>
        <div @click="haha" class="icons">
          <img src="../assets/img/icon1.jpg">
          <img src="../assets/img/icon2.jpg" class="qq">
          <img src="../assets/img/icon3.jpg">
          <img src="../assets/img/icon4.jpg">
        </div>
      </div>
      <transition name="fade">
      <p v-if="copySucc">复制成功！</p>
      </transition>
    </div>
  </div>
</template>
<script>
//引用方式 <share v-if="showShare"></share>
//父组件增加变量  showShare=false
//父组件弹出此组件绑定事件 this.showShare=true
import { screenHeight } from "../assets/utils/sceenHeight";
import VueClipboard from "vue-clipboard2";
import Vue from "vue";

Vue.use(VueClipboard);

export default {
  name: "share",
  data() {
    return {
      screenHeight: 0,
      showModal: true,
      copySucc: false
    };
  },
  methods: {
    onCopy() {
      var that = this;
      that.copySucc = true;
      setTimeout(() => {
        that.copySucc = false;
      }, 1500);
    },
    onCopyError() {
      alert("复制失败");
    },
    close() {
      this.showModal = false;
      this.$parent.showShare = this.showModal;
      if (this.$route.name === "answer" && this.$parent.reqTimes==this.$parent.totalNum) {
        this.$router.push({ path: "/results" });
      }
    },
    haha() {
      $(".rt").addClass("shake");
      setTimeout(function() {
        $(".rt").removeClass("shake");
      }, 1000);
    },
    handleClick(e) {
      e.stopPropagation();
    }
  },
  mounted: function() {
    this.screenHeight = screenHeight();
  }
};
</script>
<style scoped>
.main {
  overflow: hidden;
}
.copyboard {
  position: absolute;
  top: -9999px;
  opacity: 0;
  transform: scale(0);
}
.modal > div:first-child {
  text-align: center;
  color: #3b3b3b;
  margin-top: 10px;
}
.modal > div:first-child > p:first-child {
  font-size: 14px;
  font-weight: bold;
  margin-top: 10px;
}
.invite-code {
  display: block;
  width: 90%;
  height: 30px;
  line-height: 30px;
  margin: 15px auto;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 18px;
}
p.copy-code {
  color: #8e22f3;
  margin-top: 20px;
}
.modal > div:nth-child(2) {
  color: #5c5c5c;
  font-size: 12px;
  line-height: 20px;
  margin-top: 25px;
}
.modal > div:last-child {
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
}
.shadow > img:first-child {
  margin-right: 20px;
}
.icons>img{
  width:50px;
  height:50px;
}
.qq{
  width:45px !important;
}
@keyframes shake {
  0% {
    transform: translateX(10px);
  }
  10% {
    transform: translateY(-5px);
  }
  20% {
    transform: translateX(-10px);
  }
  30% {
    transform: translateX(-2px);
  }
  40% {
    transform: translateY(4px);
  }
  50% {
    transform: translateX(4px);
  }
  60% {
    transform: translateY(-4px);
  }
  70% {
    transform: translateX(-3px);
  }
  80% {
    transform: translateX(3px);
  }
  90% {
    transform: translateY(-2px);
  }
  100% {
    transform: translateX(-3px);
  }
}
.shake {
  animation: shake linear 0.3s;
}
</style>
