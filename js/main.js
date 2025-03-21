"use strict";

const inputSearch = document.querySelector(".js-input-search");
const submitBtn = document.querySelector(".js-submit-btn");
const resetBtn = document.querySelector(".js-reset-btn");
const seriesList = document.querySelector(".js-series-list");
const favoritesList = document.querySelector(".js-favorites-list");
const wrongImage = "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png";
const imageNotFound = "https://fakeimg.pl/225x309?text=Image+not+found&font_size=40";

let series = [];
let favorites = [];

const createSerie = (serie) => {
    return `<li class="${isFavorite(serie.id) ? 'favorite': ''}">
                <div class="container-serie">
                    <div>
                    <img src="${serie.image}"/>
                    </div>
                    <p>${serie.title}</p>
                    <div id="${serie.id}">
                        <i id="${serie.id}" class="fa-solid fa-heart"></i>
                    </div>
                </div>
            </li>`;
}

const createFavorite = (serie) => {
    return `<li>
                <div class="container-favorite">
                    <div>
                        <img src="${serie.image}"/>
                    </div>
                    <p>${serie.title}</p>
                    <div id="${serie.id}">
                        <i id="${serie.id}" class="fa-solid fa-trash"></i>
                    </div>
                </div>
            </li>`;
}

const renderSeries = (series) => {
    seriesList.innerHTML = "";
    for(const serie of series) {
        seriesList.innerHTML += createSerie(serie);
    }
}

const renderFavorites = (series) => {
    favoritesList.innerHTML = "";
    for(const serie of series) {
        favoritesList.innerHTML += createFavorite(serie);
    }
}

const loadFavorites = () => {
    const storedFavorites = JSON.parse(localStorage.getItem('favorites'));

    if (!storedFavorites) {
        return;
    }
    
    favorites = storedFavorites;
    renderFavorites(favorites);
}

const isFavorite = (serieId) => {
    const serie = favorites.find(serie => serie.id === serieId);
    return serie ? true : false;
}

const handleClickSubmit = (e) => {
    e.preventDefault();

    const search = inputSearch.value; //obtengo el valor de input

    fetch(`https://api.jikan.moe/v4/anime?q=${search}`)
        .then(response => response.json())
        .then(data => {
            const results = data.data.map(serie => {
                const originalImage = serie.images.jpg.image_url;

                return {
                    id: serie.mal_id,
                    title: serie.title,
                    image: originalImage === wrongImage ? imageNotFound : originalImage,
                }
            })

            series = results;
            renderSeries(series);
        })
}

const handleAddFavorite = (e) => {
    const serieId = e.target.id;

    if (!serieId || isFavorite(parseInt(serieId))) {
        return;
    }

    const serie = series.find(serie => serie.id === parseInt(serieId));
    favorites.push(serie);
    localStorage.setItem('favorites', JSON.stringify(favorites));

    renderFavorites(favorites);
    renderSeries(series);
}

const handleDeleteFavorite = (e) => {
    const serieId = e.target.id;

    if (!serieId) {
        return;
    }

    const newFavorites = favorites.filter(favorite => favorite.id !== parseInt(serieId));
    favorites = newFavorites;
    localStorage.setItem('favorites', JSON.stringify(favorites));

    renderFavorites(favorites);
    renderSeries(series);
}

const handleClickReset = () => {
    localStorage.removeItem('favorites');
    series = [];
    favorites = [];

    renderFavorites(favorites);
    renderSeries(series);
}

submitBtn.addEventListener("click", handleClickSubmit);
seriesList.addEventListener("click", handleAddFavorite);
favoritesList.addEventListener("click", handleDeleteFavorite);
resetBtn.addEventListener("click", handleClickReset);

loadFavorites();