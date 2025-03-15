"use strict";

console.log("work");

const inputSearch = document.querySelector(".js-input-search");
const submitBtn = document.querySelector(".js-submit-btn");
const resetBtn = document.querySelector(".js-reset-btn");
const seriesList = document.querySelector(".js-series-list");
const favoritesList = document.querySelector(".js-favorites-list");

let series = [];
let favorites = [];

// Cuando la usuaria escribe en el input:
//   -escuho el click
//   -obtener el valor del input
//   -petición al servidor para buscar en la API
//   -me duevuelve los resultados
//   -render

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

const renderSeries = (series) => {
    seriesList.innerHTML = "";
    for(const serie of series) {
        seriesList.innerHTML += createSerie(serie);
    }
}

const handleClickSubmit = (e) => {
    e.preventDefault();

    const search = inputSearch.value; //obtengo el valor de input

    fetch(`https://api.jikan.moe/v4/anime?q=${search}`)
        .then(response => response.json())
        .then(data => {
            const results = data.data.map(serie => {
                return {
                    id: serie.mal_id,
                    title: serie.title,
                    image: serie.images.jpg.image_url,
                    favorite: false,
                }
            })

            series = results;
            renderSeries(series);
        })
}



submitBtn.addEventListener("click", handleClickSubmit);


// function renderProduct(item) {
//     listUl.innerHTML = `
//         <li><h4>${item.name}</h4></li>
//         <li><p>${item.description}</p></li>
//         <li><img src="${item.url}" alt="producto"></li>
//     `
// }

// const handleClick = (event) => {
//     event.preventDefault();

//     const product = {
//         name: nameInput.value,
//         description: descripInput.value,
//         url: urlInput.value
//     };

//     renderProduct(product);
// }

// submitBtn.addEventListener("click", handleClick);

