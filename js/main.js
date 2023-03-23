import * as storage from './storage.js'; 
//разбить на модули (вынести константы и поиск элементов в dom)

const serverUrl = 'http://api.openweathermap.org/data/2.5/weather';
const apiKey = 'fec47f26378bbc35fd196f0a77796177'; 
// новый ключ fec47f26378bbc35fd196f0a77796177
// старый ключ f660a2fb1e4bad108d6160b7f58c555f
let cityName = "Tomsk"; //по-умолчанию город

let countId = 1; //счетчик для уникального id каждому добавляемому городу
let htmlTemplateTown = '<li><div class="city-list-close"><div class = "new-like-city">Amur</div><button type="button" class="btn-del-add-city"><img src="./img/close-icon.svg" alt="close"></button></div></li>'
const btnLike = document.querySelector('#idLike');

let cityesArr = [];
//перезапишем пустой cityesArr и добавим избранные города из localstorage при запуске приложения, если хранилище не пустое
if(storage.getFavoriteCities("favoriteCities") != null){
  cityesArr = storage.getFavoriteCities("favoriteCities");
  render();
}
console.log(cityesArr);

//проверить есть ли данные последнего введенного города в localstorage и если есть, вывести данные слева
if(storage.getCurrentCity("inputCity") != null){
  requestWeatherLikeCity(storage.getCurrentCity("inputCity"))
} else { //если нет, пусть выводит по-умолчанию Tomsk
  requestWeatherLikeCity("Tomsk");
}

btnLike.addEventListener("click", addNewCity); //вызвать функцию render

const buttonSearchCity = document.querySelector(".btn-search");
buttonSearchCity.addEventListener("click", requestWeather);

//добавление нового города 
function addNewCity() { 
  if (cityesArr.find(element => element.name === cityName)){ //INCLUDE111111111111111111111111
    alert(`Город ${cityName} уже есть в избранных.`)
  } else {
    const newCityObj = {name: cityName, id: countId};
    cityesArr.push(newCityObj);
    //сохранить новый массив в localstorage
    storage.saveFavoriteCities(cityesArr);
    console.log(cityesArr);
    countId += 1; //для добавления уникального id задачам
  } 
  //вызвать функцию render для обновления dom дерева и что у нас в зоне лайков есть
  render();
}

//удаление города с погодой
function delCity(arr, idCityInput) {
  let delCityNow = arr.splice(arr.findIndex(element => element.id === idCityInput), 1);
  render();
  //сохранить новый массив в localstorage (с учетом удаленных)
  storage.saveFavoriteCities(cityesArr);
}


//функция для обновления данных в dom дереве из массива и добавления каждому городу прослушивания кнопки удаления
function render() {
  const listCity = document.querySelector(".city-list");
  //чистим весь список городов из избранных
  //пока есть хоть один (первый) дочерный элемент удалаем его в обоих списках
  while (listCity.firstChild) {
    listCity.removeChild(listCity.firstChild);
  }

  //добавим задачи из массива с данными в dom дерево
  cityesArr.forEach(function(elem){
    listCity.insertAdjacentHTML("beforeEnd", htmlTemplateTown); //добавили шаблон
    //добавим в шаблон отлайканный город
    //последняя конструкция дочерняя отностиельно списка с городами
    const newTemplate = listCity.lastElementChild;
    const newLikeCity = newTemplate.querySelector(".new-like-city");
    newLikeCity.innerHTML = elem.name; //записываем задачу
    
    const idCityInput = elem.id; 
    newTemplate.id = idCityInput; //устанавливаем id в html шаблон
    //вешаем прослушку удаления на каждый новый добавленный город в избранное
    
    const elemChange = document.getElementById(idCityInput);
    //находим в этом элементе кнопку удаления
    const buttonDel = elemChange.querySelector(".btn-del-add-city");
    console.log(buttonDel);
    //вешаем прослушку на нажатие кнопки для удаления города из избранных
    buttonDel.addEventListener("click", function() {
      delCity(cityesArr, idCityInput);
    });
    //вешаем прослушку на нажатие по div где находится город в нужном li 
    newLikeCity.addEventListener("click", function() {
      //делаем запрос погоды на этот город и выводим на основной экран слева
      requestWeatherLikeCity(elem.name);
    });
  });
}

async function requestWeather(e) {
  e.preventDefault(); //сбросили обновление страницы при отрпавки формы
  cityName = document.getElementById("idCityInput").value; //получаем введенные данные из input
  
  //сохраним текущий запрос в localstorage 
  storage.saveCurrentCity(cityName);
  
  const url = `${serverUrl}?q=${cityName}&appid=${apiKey}`;
  //проверяем на ошибку ответ сервера
  try {
    const response = await fetch(url);
    let json = await response.json();
    console.log(json);
    //проверим json на код ответа если он успешный 200, то выведем в виджет все 
    if (json.cod === 200) {
      updateWeather(json, cityName); //обновим данные по запрашиваемому городу
    } else {
      alert(`Возникла проблема! ${json.message}, Code: ${json.cod}`);
    }  
    console.log('Урааааа, код не упал!!')
  } catch (error) {
    alert(`Внимание, ошибка сервера!: ${error.name} - ${error.message}`);
  } 
  console.log('Урааааа, код не упал2!!')
}

//почти такая же функция как requestWeather, но только без сброса отправки формы и обновления странцы
//не знаю как функцию универсальную сделать
async function requestWeatherLikeCity(city) {
  const url = `${serverUrl}?q=${city}&appid=${apiKey}`;
  //проверяем на ошибку ответ сервера
  try {
    const response = await fetch(url);
    let json = await response.json();
    //проверим json на код ответа если он успешный 200, то выведем в виджет все 
    if (json.cod === 200) {
      updateWeather(json, city); //обновим данные по запрашиваемому городу
    } else {
      alert(`Возникла проблема! ${json.message}, Code: ${json.cod}`);
    }  
    console.log('Урааааа, код не упал!!')
  } catch (error) {
    alert(`Внимание, ошибка сервера!: ${error.name} - ${error.message}`);
  } 
  console.log('Урааааа, код не упал2!!')
}

function updateWeather(json, cityName) { 
  const imgWeather = document.getElementById("img-weather-url");
  if(cityName === ''){
    alert('Вы не ввели город!');
  } else {
    const imgСode = json.weather[0].icon; //доступ к коду иконки погоды
    //меняем картинку погоды по url согласно данным для найденного города
    imgWeather.src = `https://openweathermap.org/img/wn/${imgСode}@4x.png`; //получаем url для отображения иконки на сайте 
    let degreeCelsius = Math.round(json.main.temp - 273.5);
    //меняем температуру на виджете из запроса города
    document.getElementById("temp-widget").textContent = `${degreeCelsius}\xB0`; //значек градуса \xB0
    //подставляем из запроса город в виджите
    document.getElementById("city-widget").textContent = cityName;
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
}