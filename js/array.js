import {render, cityesArr, cityName} from './main.js';
import {saveFavoriteCities} from './storage.js'

export {addNewCity, delCity};

let countId = 1; //счетчик для уникального id каждому добавляемому городу

//добавление нового города 
function addNewCity() { 
    if (cityesArr.find(element => element.name === cityName)){ //INCLUDE111111111111111111111111
      alert(`Город ${cityName} уже есть в избранных.`)
    } else {
      const newCityObj = {name: cityName, id: countId};
      cityesArr.push(newCityObj);
      //сохранить новый массив в localstorage
      saveFavoriteCities(cityesArr);
      console.log(cityesArr);
      countId += 1; //для добавления уникального id задачам
    } 
    //вызвать функцию render для обновления dom дерева и что у нас в зоне лайков есть
    render();
}
  
//удаление города с погодой
function delCity(arr, idCityInput) {
    arr.splice(arr.findIndex(element => element.id === idCityInput), 1);
    render();
    //сохранить новый массив в localstorage (с учетом удаленных)
    saveFavoriteCities(cityesArr);
}