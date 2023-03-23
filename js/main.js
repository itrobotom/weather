import {getFavoriteCities, getCurrentCity, saveCurrentCity} from './storage.js'; 
import {SERVER_URL, API_KEY, btnSearchCity, btnLike} from './consts.js';
import {addNewCity, delCity} from './array.js';
import {tabNow, tabDetails, createNewCity} from './dom.js';

export {render, cityesArr, cityName}; 
//разбить на модули (вынести константы и поиск элементов в dom)

let cityName = "Tomsk"; //по-умолчанию город

let cityesArr = [];
//перезапишем пустой cityesArr и добавим избранные города из localstorage при запуске приложения, если хранилище не пустое
if(getFavoriteCities("favoriteCities") != null){
  cityesArr = getFavoriteCities("favoriteCities");
  render();
}
console.log(cityesArr);

//проверить есть ли данные последнего введенного города в localstorage и если есть, вывести данные слева
if(getCurrentCity("inputCity") != null){
  requestWeatherLikeCity(getCurrentCity("inputCity"))
} else { //если нет, пусть выводит по-умолчанию Tomsk
  requestWeatherLikeCity("Tomsk");
}

btnLike.addEventListener("click", addNewCity); //вызвать функцию render

btnSearchCity.addEventListener("click", requestWeather);

async function requestWeather(e) {
  e.preventDefault(); //сбросили обновление страницы при отрпавки формы
  cityName = document.getElementById("idCityInput").value; //получаем введенные данные из input
  
  //сохраним текущий запрос в localstorage 
  saveCurrentCity(cityName);
  
  const url = `${SERVER_URL}?q=${cityName}&appid=${API_KEY}`;
  //проверяем на ошибку ответ сервера
  try {
    //response.ok Булевское значение, которое указывает, выполнился ли запрос успешно или нет (то есть находится ли код ответа в диапазоне 200–299).
    //Response.status Код ответа.
    //Response.error() Возвращает новый объект Response, связанный с сетевой ошибкой.
    const response = await fetch(url);
    let json = await response.json();
    console.log(json);
    //проверим json на код ответа если он успешный 200, то выведем в виджет все 
    if(response.ok){
      if (json.cod === 200) {
        updateWeather(json, cityName); //обновим данные по запрашиваемому городу
      } else {
        alert(`Возникла проблема, ответ сервера: ${json.message}, Code: ${json.cod}`);
      }
    } else {
      alert(`Возникла проблема! Ответ от сервера не пришел: ${Response.status}, Code: ${Response.error()}`);
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
    console.log('Урааааа, код не упал!!')
  } catch (error) {
    alert(`Внимание, ошибка сервера!: ${error.name} - ${error.message}`);
  } 
  console.log('Урааааа, код не упал2!!')
}

function updateWeather(json, cityName) { 
  if(cityName === ''){
    alert('Вы не ввели город!');
  } else {
    let degreeCelsius = Math.round(json.main.temp - 273.5);
    tabNow(json, cityName, degreeCelsius);
    tabDetails(json, cityName, degreeCelsius);
  }
}

//функция для обновления данных в dom дереве из массива и добавления каждому городу прослушивания кнопки удаления
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
  //добавим задачи из массива с данными в dom дерево
  cityesArr.forEach(function(elem){
    //3) добавим новый элемент li с дивом где будет название города и кнопкой удаления
    const [newLi, newDelButton, newCityName] = createNewCity(elem);
    //вешаем прослушку удаления на каждый новый добавленный город в избранное
    newDelButton.addEventListener("click", function() {
      delCity(cityesArr, idCityInput);
    });
    //вешаем прослушку на нажатие по div где находится город в нужном li 
    newCityName.addEventListener("click", function() {
      //делаем запрос погоды на этот город и выводим на основной экран слева
      requestWeatherLikeCity(elem.name);
    });
    parentListCityes.appendChild(newLi); //добавим в шаблон отлайканный город
  });
}
