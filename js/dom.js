export {tabNow, tabDetails, createNewCity};


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
    let sunriseTime = new Date(json.sys.sunrise * 1000);
    document.getElementById("sunrise-city").textContent = `${sunriseTime.getHours()}:${sunriseTime.getMinutes()};`
    let sunsetTime = new Date(json.sys.sunset * 1000);
    document.getElementById("sunset-city").textContent = `${sunsetTime.getHours()}:${sunsetTime.getMinutes()};`
    document.getElementById("idCityInput").value = ""; //чистим Input 
  }
  
  function createNewCity(elem) {
    const newLi = document.createElement('li');
    newLi.className = 'city-list-close';
    const idCityInput = elem.id; 
    newLi.id = idCityInput; //установим уникальный id элементу списка
  
    //наполним новый элемент списка
    const newCityName = document.createElement('div');
    newCityName.className = 'new-like-city';
    newCityName.textContent = elem.name; //записываем название города  
    newLi.appendChild(newCityName);
    const newDelButton = document.createElement('button');
    newDelButton.className = 'btn-del-add-city';
    newLi.appendChild(newDelButton);
    const imgClose = document.createElement('img');
    imgClose.src = './img/close-icon.svg';
    newDelButton.appendChild(imgClose);
    return [newLi, newDelButton, newCityName]
  }