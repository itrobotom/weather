import {getFavoriteCities, getCurrentCity, saveCurrentCity} from './storage.js'; 
import {SERVER_URL, FORECAST_URL, API_KEY, btnSearchCity, btnLike, tabForecast} from './consts.js';
import {addNewCity, delCity} from './array.js';
import {tabNow, tabDetails, createNewCity, renderForecast} from './dom.js';

export {render}; 
//разбить на модули (вынести константы и поиск элементов в dom)

let cityName = ""; //по-умолчанию город

//let cityesArr = [];
let cityesSet = new Set();
//перезапишем пустой cityesArr и добавим избранные города из localstorage при запуске приложения, если хранилище не пустое
if(getFavoriteCities("favoriteCities") != null){
  cityesSet = getFavoriteCities("favoriteCities"); //забираем множество из localstorage
  render();
}
//checkCityInСhsen(cityName, cityesSet);

//проверить, имеется ли текущее значение города в переменной cityName в избранных (из множества) и если есть, выделить цвет иконки лайка красным, а если нет белым
//ФУНКЦИЯ ВЫЗЫВАЕТСЯ 3 раза: при лайке города, при вводе его в поисковике и при удалении города
function checkCityInСhsen(cityName, cityesSet) {
  const parent = document.querySelector('.weather-like');
  console.log(parent); 
  const likeIconSvg = parent.querySelector('svg');
  console.log(likeIconSvg); 
  cityesSet.has(cityName) ? likeIconSvg.classList.add('col-red') : likeIconSvg.classList.remove('col-red');
}

//проверить есть ли данные последнего введенного города в localstorage и если есть, вывести данные слева
if(getCurrentCity("inputCity") != null){
  requestWeatherLikeCity(getCurrentCity("inputCity"));
  cityName = getCurrentCity("inputCity"); //получить последний введеный город из localStorage
  render();
} else { //если нет, пусть выводит по-умолчанию Tomsk
  cityName = "Tomsk";
  requestWeatherLikeCity(cityName);
}

btnLike.addEventListener("click", function() {
  addNewCity(cityesSet, cityName);
  checkCityInСhsen(cityName, cityesSet);
}); 

btnSearchCity.addEventListener("click", requestWeather);

//обновляем данные прогноза только после нажатия на таб Прогноз
tabForecast.addEventListener("click", requestForecast); 


async function requestWeather(e) {
  e.preventDefault(); //сбросили обновление страницы при отрпавки формы
  cityName = document.querySelector(".cityInput").value; //получаем введенные данные из input
  
  //сохраним текущий запрос в localstorage 
  saveCurrentCity(cityName);
  
  const url = `${SERVER_URL}?q=${cityName}&appid=${API_KEY}`;

  //проверяем на ошибку ответ сервера
  try {
    const response = await fetch(url);
    //if(response.ok){
      let json = await response.json();
      console.log(json);
      //response.ok Булевское значение, которое указывает, выполнился ли запрос успешно или нет (то есть находится ли код ответа в диапазоне 200–299).
      //Response.status Код ответа.
      //Response.error() Возвращает новый объект Response, связанный с сетевой ошибкой.  
      //if(response.ok){
      if (json.cod === 200) {
        updateWeather(json, cityName); //обновим данные по запрашиваемому городу
      } else {
        alert(`Возникла проблема с данными от сервера: ${json.message}, Code: ${json.cod}`);
      }
    //} else {
      //alert(`Возникла проблема! Ответ от сервера не пришел: ${Response.status} - ${Response.statusText}, Code: ${Response.error()}`);
      //throw new Error('Неверно введен адрес');
    //}
    
    //проверим json на код ответа если он успешный 200, то выведем в виджет все 
    console.log('Урааааа, код не упал!!')
  } catch (error) { //выведется созданная в else response OK
    alert(`Не можем обратиться к серверу, проверьте интернет соединение: ${error.name} - ${error.message}`);
  } 
  console.log('Урааааа, код не упал2!!')
}

async function requestForecast() {
  const urlForecast = `${FORECAST_URL}?q=${cityName}&appid=${API_KEY}&units=metric`; 
  try {
    const responseForecast = await fetch(urlForecast);
    let jsonForecast = await responseForecast.json();
    if (jsonForecast.cod === "200") {
      //updateWeather(json, cityName); //обновим данные по запрашиваемому городу
      renderForecast(jsonForecast);
    } else {
      alert(`Возникла проблема с данными от сервера: ${jsonForecast.message}, Code: ${jsonForecast.cod}`);
    }
  } catch (error) { //выведется созданная в else response OK
    alert(`Не можем обратиться к серверу, проверьте интернет соединение: ${error.name} - ${error.message}`);
  } 
}  

//почти такая же функция как requestWeather, но только без сброса отправки формы и обновления странцы
//не знаю как функцию универсальную сделать
async function requestWeatherLikeCity(city) {
  const url = `${SERVER_URL}?q=${city}&appid=${API_KEY}`;
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
    //console.log('Урааааа, код не упал!!');
  } catch (error) { 
    alert(`Внимание, ошибка сервера!: ${error.name} - ${error.message}`);
  } 
  //console.log('Урааааа, код не упал2!!');
}

function updateWeather(json, cityName) { 
  if(cityName === ''){
    alert('Вы не ввели город!');
  } else {
    let degreeCelsius = Math.round(json.main.temp - 273.5);
    checkCityInСhsen(cityName, cityesSet); //установим иконку лайка в нужный цвет по наличию города в списке избранных
    tabNow(json, cityName, degreeCelsius);
    tabDetails(json, cityName, degreeCelsius);
  }
}

//функция для обновления данных в dom дереве из массива и добавления каждому городу прослушивания кнопки удаления
//ПЕРЕНЕСТИ В DOM!!!!!
function render() {
  //ДОБАВИМ ЭЛЕМЕНТ li И ВСЕ В НЕГО ДЛЯ ФОРМИРОВАНИЯ СПИСКА ГОРОДОВ (elem очередной элемент массива, в котором есть поле название города elem.name и id города)
  //1) найдем список, в который будем вставлять li (города);
  const parentListCityes = document.querySelector('.city-list'); 
  //2) чистим весь список перед добавлением элементов
  parentListCityes.replaceChildren();
  // можно так:
  // while (parentListCityes.firstChild) {
  //   parentListCityes.removeChild(listCity.firstChild);
  // }
  //добавим задачи из set с данными в dom дерево
  for(let city of cityesSet) {
  //cityesArr.forEach(function(elem){
    //3) добавим новый элемент li с дивом где будет название города и кнопкой удаления
    // как в python только здесь возвращается из функции createNewCity 3 элемента и записывается в массив
    const [newLi, newDelButton, newCityName] = createNewCity(city);
    //вешаем прослушку удаления на каждый новый добавленный город в избранное
    newDelButton.addEventListener("click", function() {
      delCity(cityesSet, city);
      checkCityInСhsen(cityName, cityesSet);
    });
    //вешаем прослушку на нажатие по div где находится город в нужном li 
    newCityName.addEventListener("click", function() {
      //делаем запрос погоды на этот город и выводим на основной экран слева
      requestWeatherLikeCity(city);
      cityName = city; //обновляем переменную, чтобы при запросе forecast обновлялась погода города
    });
    parentListCityes.appendChild(newLi); //добавим в шаблон отлайканный город
  }
}
