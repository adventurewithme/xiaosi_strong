# answer

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


####接口文档

===首页

{
    userName:string,        //用户名
    userId: String,         //id
    userPic:Str,            //用户头像
    inviteCode:Str,         //邀请码
    serviveTimes:Num,       //复活次数
    isFilledInviteCode:Bool,//是否填写过邀请码
    isHasInvitePic:Bool,    //是否有分享个人信息的图片
    startTime:Date,         //活动开始时间   无活动返回0
    moneyPool:Num,          //奖池金额
    tips:Array,               [//活动开始前显示的tips（时间下面）
                                string,
                                string
                             ]
    introduce:Array,          //活动开始前引导跳转的连接和文字
                            [
                                title:str,
                                url:string                   
                            ]
    share:Array             //分享时显示的内容
                            [
                                title:str       //分享的标题
                                desc:str        //分享的描述
                                imgurl:str      //分享的图片链接
                                url:str         //分享的连接
                            ]
}

//发送base64图片            userId(str) + imgDate(base64) =>
{
    state:'ok'          //状态
}

//答题时间验证          
{
    state:'ok',         //状态
    timeLeave:Num,      //剩余时间 ms   如果已经开始，时间为  1
                                        如果第一题已经答完，返回值 <= -10
                                        若今日无活动     0
}

//复活机会添加时验证        userId  +  inviteCode  =>
{
    state:'ok',         //状态
    serviveTimes:Num   //复活次数
}


=======个人中心页
{
    userMoney:Num,          //(保留一位小数)个人奖金数
}

提现时，成功                userId  +  money(num)   =>
{   
    state:'ok',         //状态
    userMoney:Num
}
失败
{
    state:null,
    userMoney:Num       //返回用户钱数
}



================答题页

{
    quesNun:num             //题号
    quesArr:arr         [
                            title:str       //题目
                            a:str
                            b:str
                            c:str
                            story           //题目的背景故事
                        ]
    totalUsers:num          //总人数
}


发送用户结果        quesNun  +  userId  +  answer(str  a 、b、c) + lastTime（str  提交时剩余时间） =>
{
    state:'ok'
    rightAns:str    (a 、b、c)  答案
    results:Arr     //公布结果
                    [
                        aNum:num        //对应题目选择的人数
                        bNum:num
                        cNum:num
                        beatNum:num     //击败的人数
                    ]
    quesNun:num                         //题号
    nextQues:Arr    [
                        title:str       //题目
                        a:str
                        b:str
                        c:str
                        story           //题目的背景故事
                    ]
    totalUsers:num                      //总人数
    winMoney:Num                        //最后得到的金钱 （如果不是最后一题为0）
    share:Arr       [       //如果需要更改分享内容（待定）
                        title:str
                        desc:str
                        imgUrl:str
                        url:str
                    ]
}


================答题结束公布排行（本轮）——
{
    userInfo:json       {
                            rank:num        //排名
                            money:num       //夺得的奖金
                        }         
    totalRank:json      {   page:Num        //当前页数
                            content:arr
                            [   //用户排名  正序  每次15条
                                {
                                    userName:str    //用户名
                                    userPic:str     //头像
                                    money:num       //夺得的金钱
                                }
                            ]
                        }
}




=============排行页

{
    userInfo:json       {
                            rank:num        //排名
                            money:num       //夺得的奖金
                        }         
    totalRank:json      {   page:Num        //当前页数
                            content:arr
                            [   //用户排名  正序  每次15条
                                {
                                    userName:str    //用户名
                                    userPic:str     //头像
                                    money:num       //夺得的金钱
                                }
                            ]
                        }
}



========================周排行数据========
{
    content:[
        {
            userName:
            userPic:
            money:
        }
        //100条
    ]
    mine:{
        userName:
        userPic:
        money:
        rank:  
    }
    ad:{
        title:
        url:
    }
}





///请求成功与失败的标准  {state：Number}   //0  失败   //1  成功
//首页接口
{
    "user_data":{
        "id":"21",                                  // 用户ID
        "openid":"oKw4s0pAe0Ngju9KYmDpdyszxl6U",
        "nickname":"A.王哲",                        //  用户名
        "sex":"2",
        "address":"中国-辽宁-阜新",
        "image_url":"http://thirdwx.qlogo.cn/mmopen/vi_32/KLnTyoNlozcWK6yQtfbmGpmsMMvhojbRD5Hy2t5kgtyW3295udib40kvzCn4kgDEhxeU3D0ZDh1DHQI5VVia5Cag/132",                                              // 用户头像
        "card_num":"0",                              // 复活卡次数
        "code":"SS6HYH",                             //邀请码
        "status":"1",                                //用户状态 1：正常 2：黑名单
        "share_img":"",                              // 用户分享图片url
        "is_use_code":0                              // 是否使用过邀请码 1：使用过 2：未使用
    },
    "activity_data":{
        "activity_id":"28",                         //活动id
        "activity_title":"11111newnew",             //活动标题
        "start_time":"1525086000",                  //活动开始时间
        "amount_money":"400444.44",                 //活动金额
        "ad_title":"111111newnew",                  //导流标题
        "ad_url":"http://www.baidu.com",            //导流url
        "activity_exists":1,                        //是否有活动 1：有 2：无 (若无则不返回下面字段)
        "activity_tips":[                           //活动tips
            "111111111111newnew",
            "22222222222newnew",
            "33333333333newnew"
        ]
    },
    "share_data":{
        "appId":"wxe4183a01fd8c87e9",
        "nonceStr":"ec7DXRgnHyLlGp1X",
        "timestamp":1524812571,
        "signature":"0667bb4be3483d9468de28537cf5fa86a99521c1"
    }
}

////邀请码接口
{
    state：0   /// 0 失败    1 成功
    msg ：      ////   请求信息
    card_num    ////复活次数

}



、、、、、、、、、、、
$.get({    /// 判断用户是否有权答题
      url: "https://api.xiaositv.com/wendatwo/isrevive", 
      data: {
        openid:that.$store.state.userInfo.openid,
        activity_id: that.$store.state.gameInfo.activity_id,
        islive: 1       ///若  1  请求判断用户是否有权答题    0  ->  告诉后台用户已经死了
      },



