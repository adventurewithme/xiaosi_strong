import Vue from 'vue'
import Vuex from 'vuex'


Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    //用户信息
    userInfo:{
      // id: '', //用户I
      openid:'',
      nickname:"", //用户名
      image_url:"/answer/dist/static/img/no-pic.jpg", //用户头像
      card_num:"0", // 复活卡次数
      code: '', //邀请码
      // status:"",//用户状态 1：正常 2：黑名单
      // share_img:"",
      is_use_code:0,//是否使用过邀请码 1：使用过 0：未使用
      amount:0//用户可提现金额
    },
    //游戏信息
    gameInfo:{
      people:0,
      activity_exists:0,            //是否有活动 1：有 0：无 (若无则不返回下面字段)
      activity_id:0,             //活动id
      activity_title:"",   //活动标题
      start_time: "",      //活动开始时间
      now_time: "", //获取的当前时间
      amount_money:0,        //活动金额
      ad_title:"",              //导流标题
      ad_url:"https://www.xiaositv.com",             //导流url
      activity_tips:[]               //活动tips
    },
    shareInfo:{
      appId:"",
      nonceStr:"",
      timestamp:0,
      signature:""
    },
    beatNum:0,
    hasShare:false,
    shareSwitch:true,
    questionCount:6,
    // url:"https://www.xiaositv.com/"
    // url:"https://api.xiaositv.com/"
    url:"/"
  },
   // 修改vuex中数据示例  
   // this.$store.commit("newShareInfo", {"1":"2"}); 
   // 括号里前面是mutations里的方法名 后面是要改成的值
  mutations: {     
    newUserInfo(state, obj) {
      state.userInfo = obj;
    },
    newGameInfo(state, obj) {
      state.userInfo = obj;
    },
    newShareInfo(state, obj) {
      state.userInfo = obj;
    },
    newIllegalWords(state,arr) {
      state.illegalWords= arr;
    }
  }
})

export default store
