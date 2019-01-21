<template>
    <div id="leave" v-show="isShow">
        <!-- 比赛已经开始用户来晚了的页面 -->
        <div class="content">
            <h1>你击败了<span style="font-size:36px;">{{$store.state.beatNum}}</span>人</h1>
            <p>你已经很厉害了</p>
            <p>快把你的成绩分享给你的朋友们吧</p>
            <div class="choose2" @click="showShare" :style="{'margin-top':$parent.continue?'28px':'48px'}">分享获得复活机会</div>
            <div class="continue" @click="stay" v-if="$parent.continue">继续观看比赛</div>
        </div>
    </div>
</template>
<script>
import { screenHeight } from "../assets/utils/sceenHeight";
export default {
  name: "fail",
  data() {
    return {
      isShow:true,
      screenHeight: 0
    };
  },
  methods: {
    stay: function(){
      this.$parent.showFail =false;
    },
    showShare:function(){
      this.$parent.showShare =true;
      this.$parent.showFail =false;
    }
  },
  mounted: function() {
    this.screenHeight = screenHeight();
  }
};
</script>
<style lang="css" scoped>
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
  position: absolute;
  top:0;
  bottom:0;
  left:0;
  right:0;
  margin:auto;
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
.choose2 {
  width: 194px;
  height: 44px;
  border-radius: 27px;
  background-color: #ffffff;
  font-family: PingFangSC;
  font-size: 18px;
  font-weight: 500;
  font-style: normal;
  font-stretch: normal;
  line-height: 44px;
  letter-spacing: normal;
  text-align: center;
  color: #d23823;
  margin: 0 auto;
}

.continue {
  text-align: center;
  color: #ffffff;
  font-size: 14px;
  font-weight: 500;
  margin-top: 16px;
}
</style>
