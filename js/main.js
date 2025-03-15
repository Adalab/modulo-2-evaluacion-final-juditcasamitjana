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
    return `<li>
                <div>
                    <img src="${serie.image}"/>
                </div>
                <p>${serie.title}</p>
                <div id="${serie.id}">
                    Favorita
                </div>
            </li>`;
}

const createFavorite = (serie) => {
    return `<li>
                <div>
                    <img src="${serie.image}"/>
                </div>
                <p>${serie.title}</p>
                <div id="${serie.id}">
                    Delete
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
                    favorite: false,
                }
            })

            series = results;
            renderSeries(series);
        })
}

const handleFavorite = (e) => {
    const serieId = e.target.id;

    if (!serieId) {
        return;
    }

    const serie = series.find(serie => serie.id === parseInt(serieId));
    favorites.push(serie);

    renderFavorites(favorites);
}

submitBtn.addEventListener("click", handleClickSubmit);
seriesList.addEventListener("click", handleFavorite);