<template>
<div class="alert" role="alert" >
    <!-- 、、、、、、、、、、、、、、、、、在提前进场预热页面引入的轮播的小提示  、、、、、、、、、、、、、、、、、、、、、 -->

    <div class="slide-show" @mouseout="run">
		<div class="slide-img" onselectstart="return flase">
			<transition name="bounce">
			<div v-if="isShows" class="animated" v-html="tips[nowIndex]"></div>
			</transition>
			<!-- <transition name="fade" leave-active-class="rotateInDownRight" >
			<span v-if="!isShows">{{tips[nowIndex].name}}</span>
			</transition> -->
		</div>
    </div>
</div>
</template>
<script>
import { screenHeight } from "../assets/utils/sceenHeight";

export default {
  name: "preheat",
  props: {
    tips: {
      type: Array
    },
    inv: {
      type: Number,
      default: 3000
    }
  },
  data() {
    return {
      screenHeight: 0,
      nowIndex: 0,
      isShows: true
    };
  },
  methods: {
    goto(index) {
      clearTimeout()
      this.isShows = false;
      setTimeout(() => {
        this.isShows = true;
        this.nowIndex = index;
      }, 10);
    },
      
    run() {
      clearInterval(this.invId)
      this.invId = setInterval(() => {
        this.goto(this.nextIndex);
      }, this.inv);
    }
  },
  mounted: function() {
    // console.log(this.tips);
    this.run();
    // this.isShows = false;
    //   setTimeout(() => {
    //     this.isShows = true;
    //     this.nowIndex = index;
    //   }, 10);
  },
  computed: {
    // prevIndex () {
    // if (this.nowIndex === 0) {
    //     return this.tips.length - 1
    // }
    // else {
    //     return this.nowIndex - 1
    // }
    // },
    nextIndex() {
      if (this.nowIndex === this.tips.length - 1) {
        return 0;
      } else {
        return this.nowIndex + 1;
      }
    }
  }
};
</script>
<style lang="css" scoped>
.bounce-enter-active {
  animation: bounce-in 1s linear;
}
.bounce-leave-active {
  animation: bounce-out 1s linear;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes bounce-out {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(0);
  }
}

.slide-show {
  position: relative;
  /* margin: 15px 15px 15px 0; */
  padding-top: 15px;
  width: 100%;
  height: 120px;
  /* overflow: hidden; */
  text-align: center;
  box-sizing: border-box;
}
/*  */
.slide-img {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
/* .slide-pages {
  position: absolute;
  bottom: 10px;
  right: 15px;
}
.slide-pages li {
  display: inline-block;
  padding: 0 10px;
  cursor: pointer;
  color: #fff;
}
.slide-pages li .on {
  text-decoration: underline;
} */
.slide-img .animated {
  /* margin-left: -567px; */
  font-size: 30px;
  text-align: center;
  color: #ffffff;
}
</style>
