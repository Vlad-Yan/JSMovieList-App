"use strict";
window.addEventListener('DOMContentLoaded', () => {

    const exampleMovies = [
        {
            title: 'Аватар',
            genre: 'Приключение',
            url: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1599028/4adf61aa-3cb7-4381-9245-523971e5b4c8/300x450',
            favorite: 'false'
        },
        {
            title: 'Джон Картер',
            genre: 'Фантастика',
            url: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1629390/76aec0f0-bc47-4715-9818-73d3687da49f/300x450',
            favorite: 'false'
        },
        {
            title: 'Тор',
            genre: 'Фантастика',
            url: 'https://avatars.mds.yandex.net/get-kinopoisk-image/4303601/8674c9c7-6ec6-4c90-8642-7b0741d87dac/300x450',
            favorite: 'false'
        },
        {
            title: 'Хищник из бездны',
            genre: 'Ужасы',
            url: 'https://avatars.mds.yandex.net/get-kinopoisk-image/4774061/3eedd304-f842-4444-a0c4-88da8aa914fa/300x450',
            favorite: 'false'
        },
        {
            title: 'Начало',
            genre: 'Фантастика',
            url: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1629390/8ab9a119-dd74-44f0-baec-0629797483d7/300x450',
            favorite: 'false'
        },
        {
            title: 'Гладиатор',
            genre: 'Боевик',
            url: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1599028/7c3460dc-344d-433f-8220-f18d86c8397d/300x450',
            favorite: 'false'
        },
    ]

    getMovies(exampleMovies);
    favoritesMovies();
    filterMovies();
});

const NAME_LOCALSTORAGE = 'movies';
let MODAL_INDEX = document.querySelector('.index');
const MODAL_TITLE = document.querySelector('#exampleModalLabel');
const MODAL_SUBMIT = document.querySelector('#new-movie-submit');
const HTTP_REGEX = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;


function getMovies (exampleMovies) {
    if (localStorage.getItem(NAME_LOCALSTORAGE) == null)  {
        localStorage.setItem(NAME_LOCALSTORAGE, JSON.stringify(exampleMovies));
    }
    showMovies(JSON.parse(localStorage.getItem(NAME_LOCALSTORAGE)));
}


function addMovie (data) {
    let movies = JSON.parse(localStorage.getItem(NAME_LOCALSTORAGE));
    let index = MODAL_INDEX.textContent;
    
    const movie = {
        title: data.elements.title.value,
        genre: data.elements.genre.value,
        url: data.elements.url.value,
        favorite: false
    }

    if (index === "-1") {
        if (!movie.title || !movie.genre || !movie.url) {
            alert("Заполните все поля!");
        } else if(!HTTP_REGEX.test(movie.url)) {
            alert("Не верный url!");
        } else if(movies.find(m => m.title === movie.title)) {
            alert("Такой фильм уже создан!");
        } else {
            movies.push(movie);
            localStorage.setItem(NAME_LOCALSTORAGE, JSON.stringify(movies));
            data.reset();
            filterMovies();
            document.querySelector('.btn-close').click();
        }

    } else {
        movie.favorite = movies[index].favorite;
        if (!movie.title || !movie.genre || !movie.url) {
            alert("Заполните все поля!");
        } else if(!HTTP_REGEX.test(movie.url)) {
            alert("Не верный url!");
        } else if(movies.find(m => m.title === movie.title) && movies[index].title !== movie.title) {
            alert("Такой фильм уже создан!");
        } else {
            movies[index] = movie;
            localStorage.setItem(NAME_LOCALSTORAGE, JSON.stringify(movies));
            data.reset();
            filterMovies();
            document.querySelector('.btn-close').click();
        }
    }
}


function showMovies(data) {
    const moviesEl = document.querySelector('.movies');
    document.querySelector(".movies").innerHTML = "";

    data.forEach(movie => {
        let favoritButton;

        if (movie.favorite === true) {
            favoritButton = '<button data-action="favorit" class="no-favorit">Убрать из избранного</button>';
        } else {
            favoritButton = '<button data-action="favorit" class="favorit">Добавить в избранное</button>';
        }

        const movieEl = document.createElement("div");
        movieEl.classList.add("movie");
        movieEl.innerHTML = `
            <div class="content">
            <img src="${movie.url}" alt="movie">
            <div class="movie-description">
                <p>Название фильма:</p>
                <p id="title" class="info">${movie.title}</p>
                <p>Жанр:</p>
                <p class="info">${movie.genre}</p>
            </div>
            </div>
            <div class="actions">
                ${favoritButton}
                <button data-action="edit" class="edit" onclick="modalEdit('${movie.title}', '${movie.genre}', '${movie.url}')" data-bs-toggle="modal" data-bs-target="#exampleModal">Изменить</button>
                <button data-action="delete" class="delete" onclick="delMovie('${movie.title}')">Удалить</button>
            </div>
            `;
        moviesEl.appendChild(movieEl);
    });
}


function delMovie(title) {        
    let movies = JSON.parse(localStorage.getItem(NAME_LOCALSTORAGE));
    movies = movies.filter(m => m.title != title); 
    localStorage.setItem(NAME_LOCALSTORAGE, JSON.stringify(movies));
    filterMovies();
}


function favoritesMovies() {
    let favoritButton = document.querySelector('.movies');
    
    favoritButton.addEventListener('click', (e) => {
        let movies = JSON.parse(localStorage.getItem(NAME_LOCALSTORAGE));

        if (e.target.dataset.action === 'favorit'){
            let title = e.target.closest('.movie').querySelector('#title');

            let index = movies.findIndex(movie => movie.title === title.textContent)

            if (e.target.classList.item(0) === 'favorit') {
                e.target.classList.remove('favorit');
                e.target.classList.add('no-favorit');
                e.target.textContent = "Убрать из избранного";
                movies[index].favorite = true;
            } else {
                e.target.classList.remove('no-favorit');
                e.target.classList.add('favorit');
                e.target.textContent = "Добавить в избранное";
                movies[index].favorite = false;
            }
            localStorage.setItem(NAME_LOCALSTORAGE, JSON.stringify(movies));
            filterMovies()
        }
    }
)};


function filterMovies() {
    let movies = JSON.parse(localStorage.getItem(NAME_LOCALSTORAGE));
    let btnFavorit = document.querySelectorAll('.btnFavorit');
    let active = document.querySelector('.active');

    if (active.outerText === "Избранные") {
        movies = movies.filter(movie => movie.favorite === true);
        showMovies(movies);
    } else {
        showMovies(movies);
    }

    btnFavorit.forEach(btn => {
        btn.addEventListener('click', (e) => {
            if(btn.outerText === "Все"){
                btn.classList.add("active");
                btn.nextElementSibling.classList.remove("active");
                movies = JSON.parse(localStorage.getItem(NAME_LOCALSTORAGE));
            } else {
                btn.classList.add("active");
                btn.previousElementSibling.classList.remove("active");
                movies = movies.filter(movie => movie.favorite === true)
            }
        showMovies(movies);        

        }
    )});
}


function modalAdd() {
    MODAL_TITLE.textContent = "Добавить фильм";
    MODAL_SUBMIT.value = "Добавить фильм";
    MODAL_INDEX.textContent = "-1";
}

function modalEdit(title, genre, url) {
    MODAL_TITLE.textContent = "Изменить фильм";
    MODAL_SUBMIT.value = "Изменить фильм";

    let titleInput = document.querySelector('#title-input');
    let genreSelect = document.querySelector('#genre-select');
    let urlInput = document.querySelector('#url-input');

    titleInput.value = title;
    genreSelect.value = genre;
    urlInput.value = url;

    let movies = JSON.parse(localStorage.getItem(NAME_LOCALSTORAGE));
    let index = movies.findIndex(movie => movie.title === title)
    MODAL_INDEX.textContent = index;
}


/* Фильмы для теста

Мумия
Фэнтези
https://avatars.mds.yandex.net/get-kinopoisk-image/1599028/7075696b-2399-4038-9f89-283921eea7ef/300x450

Сердце пармы
Драма
https://avatars.mds.yandex.net/get-kinopoisk-image/6201401/f2d7ecc1-635c-48a2-86db-180982fd9923/300x450

*/