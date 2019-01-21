$(function () {
    $('#search').click(function () {
        window.location.href = 'search.html';
    });
    // 下拉刷新
    var $statu = $('.loading-warp .text');

    var pullRefresh = $('.container').pPullRefresh({
        $el: $('.container'),
        $loadingEl: $('.loading-warp'),
        sendData: null,
        callbacks: {
            pullStart: function () {
                $statu.text('松开开始刷新');
            },
            start: function () {
                $statu.text('数据刷新中···');
            },
            success: function (response) {
                $statu.text('数据刷新成功！');
            },
            end: function () {
                $statu.text('下拉刷新结束');
            },
            error: function () {
                $statu.text('找不到请求地址,数据刷新失败');
            }
        }
    });
    // 去详情页
    $('.list_li').click(function(){
        window.location.href='detail.html'
    })
});