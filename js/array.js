import {render} from './main.js';
import {saveFavoriteCities} from './storage.js'

export {addNewCity, delCity};


//добавление нового города в избранное
//!!ПЕРЕДАТЬ АРГУМЕНТЫ SET И ГОРОД 
function addNewCity(currentSet, city) { 
  currentSet.has(city) ? alert(`Город ${city} уже есть в избранных.`) : currentSet.add(city);
  
  //сохранить новый массив в localstorage
  saveFavoriteCities(currentSet);
  console.log(currentSet);
  //вызвать функцию render для обновления dom дерева и что у нас в зоне лайков есть
  render();
}
  
//удаление города
function delCity(currentSet, city) {
  //находим в множестве currentSet город (уже имя, а не id), по которому кликнули и удаляем его
  currentSet.delete(city);
  render();
  //сохранить новый set в localstorage (с учетом удаленных)
  saveFavoriteCities(currentSet);
}