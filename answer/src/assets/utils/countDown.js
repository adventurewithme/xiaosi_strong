function countDown(num) {
  var timer1 = null;
  var timer2 = null;
  clearInterval(timer1);
  clearInterval(timer2);
  $("#time").html(Math.ceil(num));
  $(".timedown").css({
    "height": "100px",
    "line-height": "100px"
  });
  $(".timedown p").css({
    "height": "100px",
    "line-height": "100px"
  });
  var c5 = document.querySelector("#cvs");
  var ctx = c5.getContext("2d");
  var start = -90; //开始角度
  var end = -90;
  var deg = 360 / (num * 10);

  timer1 = setInterval(function () {
    c5.style.width = "100px";
    c5.style.height = "100px";
    c5.height = 100 * window.devicePixelRatio;
    c5.width = 100 * window.devicePixelRatio;
    ctx.lineWidth = 3 * window.devicePixelRatio;
    ctx.beginPath();
    ctx.arc(c5.width / 2, c5.height / 2, 30 * window.devicePixelRatio, 0 * Math.PI / 180, 360 * Math.PI / 180, false);
    ctx.strokeStyle = "#cccccc";
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.arc(c5.width / 2, c5.height / 2, 30 * window.devicePixelRatio, start * Math.PI / 180, end * Math.PI / 180, false);
    ctx.strokeStyle = "#bb12ad";
    ctx.stroke();
    ctx.closePath();
    end += deg;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }, 100);
  var minusTime = num % 1;
  num -= minusTime;
  setTimeout(() => {
    timer2 = setInterval(() => {
      if (num > 0) {
        num--;
        $("#time").html(num);
      } else {
        // console.log("倒计时结束");
        $("#time").html("");
        ctx.clearRect(0, 0, 100, 100);
        clearInterval(timer1);
        clearInterval(timer2);
      }
    }, 1000)
  }, minusTime);
}
export {
  countDown
}
