//модуль для работы с локальным хранилищем браузера localstorage

export function saveFavoriteCities(favoriteCities) {
    //localStorage.clear(); //чистить целиком хранилище нельзя, там еще данные о введенном городе хранятся
    localStorage.removeItem("favoriteCities");
    //отчистить localstorage по ключу favoriteCities
    localStorage.setItem("favoriteCities", JSON.stringify(favoriteCities));
}

export function getFavoriteCities(key) {
   return JSON.parse(localStorage.getItem(key));
}

//получается такая же функция как и getFavoriteCities
export function getCurrentCity(key) {
    return JSON.parse(localStorage.getItem(key));
}

export function saveCurrentCity(newInputCity) {
    //отчистим из памяти браузера прошлый запрос города в строке поиска (ключ доступа всегда один inputCity)
    localStorage.removeItem("inputCity");
    //сохраним новый город
    localStorage.setItem("inputCity", JSON.stringify(newInputCity));
}