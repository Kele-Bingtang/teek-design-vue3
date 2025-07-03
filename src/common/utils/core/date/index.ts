/**
 * 获取当前时间：yyyy-mm-dd HH:mm:ss
 */
export function getNowDate() {
  const date = new Date();
  const year = date.getFullYear(); // 年
  let month: string | number = date.getMonth() + 1; // 月
  let day: string | number = date.getDate(); // 日
  let hour: string | number = date.getHours(); // 时
  let minutes: string | number = date.getMinutes(); // 分
  let seconds: string | number = date.getSeconds(); // 秒

  // 给一位数的数据前面加 0
  if (month >= 1 && month <= 9) month = "0" + month;
  if (day >= 0 && day <= 9) day = "0" + day;
  if (hour >= 0 && hour <= 9) hour = "0" + hour;
  if (minutes >= 0 && minutes <= 9) minutes = "0" + minutes;
  if (seconds >= 0 && seconds <= 9) seconds = "0" + seconds;

  return year + "-" + month + "-" + day + " " + hour + ":" + minutes + ":" + seconds;
}

/**
 * 获取当前时间对应的提示语（登录成功后显示）
 */
export function getTimeState() {
  const timeNow = new Date();
  const hours = timeNow.getHours();
  if (hours >= 6 && hours <= 10) return `早上好 ⛅，新的一天就要开始啦，起来后来杯温水或者咖啡，动力满满喔 ~`;
  if (hours >= 10 && hours <= 14) return `中午好 🌞，饭前喝口水，然后去吃最爱吃的饭，接着适当休息放松喔 ~`;
  if (hours >= 14 && hours <= 18) return `下午好 🌞，繁忙的下午也不要忘记喝水、休息喔 ~`;
  if (hours >= 18 && hours <= 24) return `晚上好 🌛，休息啦，先吃晚饭，然后出去散散步，或者锻炼身体喔 ~`;
  if (hours >= 0 && hours <= 6) {
    return `凌晨好 🌛，没想到你那么努力，未来的美好悄然走向你，不过还是希望你早点休息，放下手上的事情，美滋滋的睡个好觉喔 ~`;
  }
  return "";
}
