"use strict";
// PARA OBTENER LOS ELEMENTOS DEL DOM CON LOS QUE INTERACTUO Y NECESITO, BUSCO CON EL DOC.QUERY
const inputSearch = document.querySelector(".js-input-search");  
const submitBtn = document.querySelector(".js-submit-btn");
const resetBtn = document.querySelector(".js-reset-btn");
const seriesList = document.querySelector(".js-series-list");
const favoritesList = document.querySelector(".js-favorites-list");
const wrongImage = "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png"; // HE GUARDADO EN UNA CONST LA URL DE LA IMAGEN INCORRECTA
const imageNotFound = "https://fakeimg.pl/225x309?text=Image+not+found&font_size=40"; // "      "        "      "   URL DE LA IMAGEN NUEVA QUE APARECERA EN SU LUGAR
// DOS ARRAYS VACIAS PARA LA LOGICA DEL EJERCICIO QUE ME PIDEN, LA DOS LISTAS
let series = [];
let favorites = [];         

const createSerie = (serie) => { // CREACIÓN DEL HTML DE CADA SERIE DIRECTAMENTE EN JS
    return `<li class="${isFavorite(serie.id) ? 'favorite': ''}"> --->// Es favorita? si el id de la serie es favorita, le pone string/clase favorita SINO nada/string vacio
                <div class="container-serie">
                    <div>
                    <img src="${serie.image}"/>
                    </div>
                    <p>${serie.title}</p>
                    <div id="${serie.id}">
                        <i id="${serie.id}" class="fa-solid fa-heart"></i> // para que al clicar el corazon se obtenga el id
                    </div>
                </div>
            </li>`;
}

const createFavorite = (serie) => { // CREACIÓN DEL HTML DE CADA SERIE FAVORITA DIRECTAMENTE EN JS
    return `<li>
                <div class="container-favorite">
                    <div>
                        <img src="${serie.image}"/>
                    </div>
                    <p>${serie.title}</p>
                    <div id="${serie.id}">
                        <i id="${serie.id}" class="fa-solid fa-trash"></i> // para que al clicar la trash se obtenga el id y se elimine
                    </div>
                </div>
            </li>`;
}

const renderSeries = (series) => { //FUNCION CREADA SOLO PARA PINTAR SERIES
    seriesList.innerHTML = ""; // pintar limpiar lo que pudiera haber antes
    for(const serie of series) { //bucle porque se va recorriendo cada serie que venga
        seriesList.innerHTML += createSerie(serie); // se pintan la series que vienen del array creado por nosotros y se iran añadiendo/incrementando una tras otra
    }
}

const renderFavorites = (series) => { //FUNCION CREADA SOLO PARA PINTAR FAVORITAS
    favoritesList.innerHTML = ""; // pintar limpiar lo que pudiera haber antes
    for(const serie of series) { //bucle porque se va recorriendo cada serie favorita que venga
        favoritesList.innerHTML += createFavorite(serie); // se pintan la series que vienen del array creado por nosotros y se iran añadiendo una tras otra
    }
}

const loadFavorites = () => { // CUANDO SE CARGA DE NUEVO LA PAGINA CON LOS FAVORITOS DEL LOCAL STORAGE --> 
    const storedFavorites = JSON.parse(localStorage.getItem('favorites')); // favoritos almacenados, 
                //TRANSFORMA EL STRING(lo que venga) EN OBJETO
    if (!storedFavorites) { // si no hay almacenadas favoritas
        return; // sale de la función, acaba aquí
    }
    
    favorites = storedFavorites; // si hay las carga
    renderFavorites(favorites); // y las pinta
}
// TIENE QUE SABER SI EL ID ES EL MISMO QUE UNO DE LAS FAVORITAS O NO:
const isFavorite = (serieId) => { // busca una serie en favoritos con ese id
    const serie = favorites.find(serie => serie.id === serieId); // en esta const busco/compara la serieId con los id que hay en favoritas del array
    return serie ? true : false; // retorna truthly: si la serie es objeto devuelve cierto, sino falso ME DICE SI ES FAVORITO O NO
}

const handleClickSubmit = (e) => { // CUANDO LA USUARIA CLICA BUSCAR
    e.preventDefault(); // para que no actue por defecto, sino se repita todo el rato

    const search = inputSearch.value; //con esta cont obtengo el valor de input, de lo que escribe la usuaria
    // LOS FETCH SON PROMESAS
    fetch(`https://api.jikan.moe/v4/anime?q=${search}`) // fetch para llamar al servidor concreto, interpolación del input que introduce la usuaria
        .then(response => response.json()) // conviertimos a json para que sea un objeto de js
        .then(data => {
            const results = data.data.map(serie => { // convierte los resultados que me devuelva la api, en lo que yo necesito, lo que retorna el map
                const originalImage = serie.images.jpg.image_url; // la imagen esta equivodada hay que cambiarla

                return {  // me retorna un objeto con lo que necesito, en la const RESULTS almaceno los datos solo lo que necesito: el id, el titulo y la imagen
                    id: serie.mal_id,
                    title: serie.title,
                    image: originalImage === wrongImage ? imageNotFound : originalImage, //si la const originalImage es igual a que no hay imagen, 
                }                               // ponemos imagenNotFound definida al principio, sino pues deja la imagen original del objeto creado                                
            })

            series = results; // aquí se actualiza la serie porque he creado un obj nuevo con solo 3 propiedades que necesito
            renderSeries(series); // se pintan en la web
        })
}

const handleAddFavorite = (e) => { //CUANDO LA USUARIA CLICA EN CORAZON PARA QUE SEA FAVORITA: 
    const serieId = e.target.id; // para que el id pertenezca a solo el corazón, solo cuando se clica en el id que esta en el corazon

    if (!serieId || isFavorite(parseInt(serieId))) { // si la serie no tiene id en el corazon o es favorita
        return; // no retorna nada, se para aquí, no se pone en favorito pk no se ha dado justo en el corazon
    }                                  //parse INT porque necesita convertirse en numero, porque id es un numero

    const serie = series.find(serie => serie.id === parseInt(serieId)); // se busca en el array de SERIES la serie exacta para añadirla en favoritos
    favorites.push(serie); // aquí le digo que al darle en el corazon se añada al array de favoritas
    localStorage.setItem('favorites', JSON.stringify(favorites)); // actualiza el localstorage para que se cargue la nueva favorita

    renderFavorites(favorites); // se pintan de nuevo las favoritas
    renderSeries(series); // se pintan de nuevo las series
}

const handleDeleteFavorite = (e) => { // CUANDO LA USUARIA HACE CLICA EN TRASH PARA QUE SE ELIMINE DE FAVORITA:
    const serieId = e.target.id; // para que el id pertenezca a trash, solo cuando se clica en el id que esta en el trash

    if (!serieId) { // si no se clica el icono de trash, no hay id
        return; // no retorna nada, se para aquí, no se elimina no se ha dado exacto en trash
    }

    const newFavorites = favorites.filter(favorite => favorite.id !== parseInt(serieId)); // se filtra el array favoritas con todos los elementos que no sean el id que yo le paso, entonces se elimina el que quiero eliminar
    favorites = newFavorites; // entonces ahora favoritas es igual a las nuevas favoritas sin la favorita acabada de eliminar
    localStorage.setItem('favorites', JSON.stringify(favorites)); // actualiza el localstorage para que se cargue sin la favorita eliminada

    renderFavorites(favorites); // se pintan de nuevo las favoritas
    renderSeries(series); // se pintan de nuevo las series
}

const handleClickReset = () => { // CUANDO LA USUARIA CLICA EN RESET: 
    localStorage.removeItem('favorites'); // limpia el local Storage  //NO SE LIMPIA EL INPUT PK EL RESET YA LO HACE POR DEFECTO AL ESTAR DENTRO FORM
    series = []; // array vacio
    favorites = []; // array vacio

    renderFavorites(favorites); // se pintan de nuevo las favoritas
    renderSeries(series); // se pintan de nuevo las series
}

submitBtn.addEventListener("click", handleClickSubmit); // LLAMADAS A FUNCIONES
seriesList.addEventListener("click", handleAddFavorite);
favoritesList.addEventListener("click", handleDeleteFavorite);
resetBtn.addEventListener("click", handleClickReset);

loadFavorites(); // CARGAR FAVORITAS: para que al cargar sin limpiar cache, se pinten los favoritos añadidos anteriormente