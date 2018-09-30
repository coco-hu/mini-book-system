function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatTime(t, f){
  let formatArr = ['Y', 'M', 'D', 'h', 'm', 's']
  let returnArr = []

  let date = new Date(t * 1000);
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (let i in returnArr) {
    f = f.replace(formatArr[i], returnArr[i]);
  }
  return f;
}

/**
 * 获取超时时间，days: 天数
 */
function getExpireTime(s, days) {
  if(!s){
    return false;
  }
  let sDate = new Date(s*1000)
  let eDate = new Date(sDate.getFullYear(), sDate.getMonth(), sDate.getDate() + days + 1)
  return eDate.getTime()/1000 -1 
}
module.exports = {
  formatTime,
  getExpireTime
}