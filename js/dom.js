export {tabNow, tabDetails, createNewCity, renderForecast};
import {getTime, getDate} from './getTimeDate.js';

function tabNow(json, cityName, degreeCelsius) {
  const imgWeather = document.getElementById("img-weather-url");
  const imgСode = json.weather[0].icon; //доступ к коду иконки погоды
  //меняем картинку погоды по url согласно данным для найденного города
  imgWeather.src = `https://openweathermap.org/img/wn/${imgСode}@4x.png`; //получаем url для отображения иконки на сайте 
  //меняем температуру на виджете из запроса города
  document.getElementById("temp-widget").textContent = `${degreeCelsius}\xB0`; //значек градуса \xB0
  //подставляем из запроса город в виджите
  document.getElementById("city-widget").textContent = cityName;

}
  
function tabDetails(json, cityName, degreeCelsius) {
  //обновляем таб details
  document.getElementById("city-widget-details").textContent = cityName;
  document.getElementById("deg-city").textContent = `${degreeCelsius}\xB0`;
  let degreeCelsiusFeel = Math.round(json.main.feels_like - 273.5);
  document.getElementById("deg-feel-city").textContent = `${degreeCelsiusFeel}\xB0`
  document.getElementById("clouds-city").textContent = json.weather[0].main; 
  

  document.getElementById("sunrise-city").textContent = getTime(json.sys.sunrise, json.timezone);
  document.getElementById("sunset-city").textContent = getTime(json.sys.sunset, json.timezone);
  document.getElementById("idCityInput").value = ""; //чистим Input 
}

//в аргумент надо передать объект с данными для добавления их в нужные поля
function renderForecast(jsonForecast) { //в аргумент можно передать id который будет получаться из строки + число из for (количество временных интервалов можно будет настроить через for)
  
  //чистим сначала все записи прогноза для прошлого города
  //1) найдем список, куда будем вставлять прогноз;
  const parent = document.querySelector('.forecast');
  //2) чистим весь список перед добавлением элементов
  if(parent !== null) parent.replaceChildren();
  //установить город, прогноз по которому нужен, предварительно создав элемент
  const newPCityForecast = document.createElement('p');
  newPCityForecast.className = 'city-widget-details';
  newPCityForecast.textContent = jsonForecast.city.name;
  parent.appendChild(newPCityForecast);

  //создаем содержимое отдельных блоков на каждый временной интервал
  //4 интервала на 12 часов прогноз получается
  for(let item = 0; item < 4; item++) {
    
    const newDivMain = document.createElement('div');
    newDivMain.className = 'forecast-info';
    parent.appendChild(newDivMain);
    const newDivDateTime = document.createElement('div');
    newDivDateTime.className = 'date-time-info';
    newDivMain.appendChild(newDivDateTime);
    const newPDate = document.createElement('p'); 
    newDivDateTime.appendChild(newPDate);
    //list[0] временно, потом через for 8 первых элементов вставить (прогноз каждые 3 часа, то есть на сутки вперед, а максимум на 5 дней 40 записей дает API)
    newPDate.textContent = getDate(jsonForecast.list[item].dt, jsonForecast.city.timezone);
    const newPTime = document.createElement('p'); 
    newDivDateTime.appendChild(newPTime);
    newPTime.textContent = getTime(jsonForecast.list[item].dt, jsonForecast.city.timezone);
    //*** 
    const newDivForecastWeather = document.createElement('div');
    newDivForecastWeather.className = 'forecast-weather';
    newDivMain.appendChild(newDivForecastWeather);

    const newDivTemperatureInfo = document.createElement('div');
    newDivTemperatureInfo.className = 'temperature-info';
    newDivForecastWeather.appendChild(newDivTemperatureInfo);
    const newPTemp = document.createElement('p');
    newPTemp.textContent = `Temperature: ${Math.round(jsonForecast.list[item].main.temp)}\xB0`; //jsonForecast.list[0].main.feels_like;
    newDivTemperatureInfo.appendChild(newPTemp);
    const newPFeelsLike = document.createElement('p');
    newPFeelsLike.textContent = `Feels like: ${Math.round(jsonForecast.list[item].main.feels_like)}\xB0`;
    newDivTemperatureInfo.appendChild(newPFeelsLike);
    //**
    const newDivForecastImg = document.createElement('div');
    newDivForecastImg.className = 'forecast-img';
    newDivForecastWeather.appendChild(newDivForecastImg);

    const newPCloud = document.createElement('p');
    newPCloud.textContent = jsonForecast.list[item].weather[0].main;
    newDivForecastImg.appendChild(newPCloud);
    //изображение прогноза погоды c div для обрезки фона
    const newDivForecastImgSize = document.createElement('div');
    newDivForecastImgSize.className = 'forecast-img-size';
    console.log(newDivForecastImgSize);
    newDivForecastImg.appendChild(newDivForecastImgSize);
    const imgForecast = document.createElement('img');
    const imgСodeForecast = jsonForecast.list[item].weather[0].icon; //доступ к коду иконки погоды
    //меняем картинку погоды по url согласно данным
    imgForecast.src = `https://openweathermap.org/img/wn/${imgСodeForecast}.png`; //получаем url для отображения иконки на сайте 
    newDivForecastImgSize.appendChild(imgForecast);
  }
}
  
function createNewCity(elem) {
  const newLi = document.createElement('li');
  newLi.className = 'city-list-close';
  
  //наполним новый элемент списка
  const newCityName = document.createElement('div');
  newCityName.className = 'new-like-city';
  newCityName.textContent = elem; //записываем название города  
  newLi.appendChild(newCityName);
  const newDelButton = document.createElement('button');
  newDelButton.className = 'btn-del-add-city';
  newLi.appendChild(newDelButton);
  const imgClose = document.createElement('img');
  imgClose.src = './img/close-icon.svg';
  newDelButton.appendChild(imgClose);
  return [newLi, newDelButton, newCityName]
}












//не используется пока
//создание элемента с указанием имени, типа, класса и куда вставить
function createElemForDom(nameEl, type, classname, parent) {
  nameEl = document.createElement(type);
  nameEl.className = classname;
  parent.appendChild(nameEl);
}
