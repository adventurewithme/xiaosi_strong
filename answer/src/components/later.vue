<template>
    <div id="leave" v-show="isShow">
        <!-- 比赛已经开始用户来晚了的页面 -->
        <div class="content">
            <h1>你来晚了</h1>
            <p>比赛已经开始了</p>
            <p>你无法参与本轮比赛但仍然可以</p>
            <p>继续围观和讨论</p>
            <div class="stay">继续观看比赛</div>
            <div class="leave">邀请好友观看比赛</div>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            isShow:true
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
        height: 394px;
        margin-top:123px;
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

