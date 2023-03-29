export {getTime, getDate};

function getTime(timeUnix, timeZone) {
    const x = new Date(); //запрос текущего времени из города запроса
    const currentTimeZoneOffsetInSec = x.getTimezoneOffset()*60; 
    const time = new Date((timeUnix + timeZone + currentTimeZoneOffsetInSec) * 1000);
    //console.log(`Дата ${time.getDate()}`);
    //получает двухзначное число в минутах и часах даже если число <10
    if (time.getHours() < 10 && time.getMinutes() < 10) {
      return `0${time.getHours()}:0${time.getMinutes()}`;
    }
    else if (time.getHours() < 10 && time.getMinutes() > 9) {
      return `0${time.getHours()}:${time.getMinutes()}`
    }
    else if (time.getHours() > 9 && time.getMinutes() < 10) {
      return `${time.getHours() }:0${time.getMinutes()}`;
    }
    return `${time.getHours()}:${time.getMinutes()}`
}
  
function getDate(timeUnix, timeZone) {
    const x = new Date(); //запрос текущего времени из города запроса
    const currentTimeZoneOffsetInSec = x.getTimezoneOffset()*60; 
    const time = new Date((timeUnix + timeZone + currentTimeZoneOffsetInSec) * 1000);
    const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"];
    return `${time.getDate()} ${monthNames[time.getMonth()]}`;
}