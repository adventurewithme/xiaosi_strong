const formatTime = (date, lineSymbol) => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  // console.log(date,year,month,day,hour,minute,second)
  let lineS = lineSymbol ? lineSymbol : '-';

  return [year, month, day].map(formatNumber).join(lineS) + ' ' + [hour, minute].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const outTime = createTime => {
  var now = new Date().getTime();
  if (now - 23 * 60 * 60 * 1000 - createTime >= 0 && now - 24 * 60 * 60 * 1000 - createTime < 0)
    return "即将过期";
  else if (now - 24 * 60 * 60 * 1000 - createTime > 0)
    return "已过期";
  else return "未领取";
}
//生成随机字符串
const randomString=(len)=>{  
  len = len || 6;
  let $chars = 'ABCDEFGHIJKMLNOPQRSTUVWXYZ1234567890';    
  let maxPos = $chars.length;
  let pwd = (new Date().getTime() + '').substr(-6, 3);
  for (let i = 0; i < len-3; i++) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}
module.exports = {
  formatTime,
  outTime,
  randomString
}
