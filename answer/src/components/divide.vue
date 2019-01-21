<template>
    <div id="leave" v-show="isShow">
        <!--  所有用户答完所有题之后平分的奖金弹框页面 -->
        <div class="content">
            <p>￥{{money}}</p>
            <p>恭喜获得本期奖金</p>
            <p>你简直太厉害了！</p>
            <div class="divide-share" @click="shareTo">分享</div>
        </div>
    </div>
</template>
<script>
export default {
    name:'divide',
    data(){
        return {
            isShow:true,
            money:'10万'
        }
    },
    methods:{
        shareTo(){
            
        }
    }
}
</script>
<style scoped>
    #leave{
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
        height: 350px;
        margin-top:123px;
        border:1px solid transparent;
        background:url('../assets/img/pop-bj.png') center top no-repeat;
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
    .content p:nth-child(1){
        margin-top: 129px;
        font-size: 30px;
    }
    .content p:nth-child(2){
        font-size: 14px;
        color: #ffeca2;
    }
    .content p:nth-child(3){
        font-size: 22px;
        color: #ffeca2;
    }
    .divide-share{
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




