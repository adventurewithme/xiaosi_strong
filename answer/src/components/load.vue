<template>
<div class="main" :style="'height:'+screenHeight+'px'">
    <div class="load-title">快来答题</div>
    <div class="load-no">NO</div>
    <div class="load-yes">YES</div>
</div>
</template>
<script>

export default {
    name:'load',
    data(){
        return{

        }
    },
    mounted(){
    },
    methods:{
        
    }
}
</script>
<style scoped>
    .load-title,.load-no,.load-yes{
        height: 50px;
        line-height: 50px;
        text-align: center;
        font-size: 14px;
        margin-top: 20px;
        width: 80%;
        margin: 20px auto;
    }
    .load-title{
        color: #333333;
    }
    .load-no{
        border: 1px solid #999;
        color: #333333;
        border-radius: 45px;
    }
    .load-yes{
        background-image:linear-gradient(115deg,#bb12ad,#820bf2);
        border-radius: 45px;
    }
</style>

