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
            title: 'Джон Картер ',
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
            genre: 'История',
            url: 'https://avatars.mds.yandex.net/get-kinopoisk-image/1599028/7c3460dc-344d-433f-8220-f18d86c8397d/300x450',
            favorite: 'false'
        },
    ]

    let movies = getMovies(exampleMovies);
    addMovie();
    showMovies(movies);
    delMovie();
    editMovie();
    favoritesMovies();
    filterMovies();


    function getMovies (exampleMovies) {
        let movies;

        if (localStorage.getItem('movies'))  {
            movies = JSON.parse(localStorage.getItem('movies'));
        } else {
            localStorage.setItem('movies', JSON.stringify(exampleMovies)); 
            movies = JSON.parse(localStorage.getItem('movies'));
        }

        return movies;
    }


    function addMovie () {
        const newMovieForm = document.querySelector('.new-movie-form');

        newMovieForm.addEventListener('submit', (e) => {
            let movies = JSON.parse(localStorage.getItem('movies'));
            e.preventDefault();
            const movie = {
                title: e.target.elements.title.value,
                genre: e.target.elements.genre.value,
                url: e.target.elements.url.value,
                favorite: false
            }

            if (!movie.title || !movie.genre || !movie.url) {
                alert("Заполните все поля!");
            } else if(movies.find(m => m.title === movie.title)) {
                alert("Такой фильм уже добавлен!");
            } else {
                movies.push(movie);
                localStorage.setItem('movies', JSON.stringify(movies));
                e.target.reset();
                filterMovies();
            }
        });
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
                    <input 
                    id="title"
                    type="text" 
                    class="text" 
                    placeholder="Введите название фильма"
                    value="${movie.title}"
                    readonly/>
                    <p>Жанр:</p>
                    <input 
                    id="genre"
                    type="text" 
                    class="text" 
                    placeholder="Введите жанр фильма"
                    value="${movie.genre}"
                    readonly/>
                    <input
                    id="url"
                    type="text" 
                    class="text hide" 
                    placeholder="Введите URL обложки фильма"
                    value="${movie.url}"
                    />
                </div>
                </div>
                <div class="actions">
                    ${favoritButton}
                    <button data-action="edit" class="edit">Изменить</button>
                    <button data-action="delete" class="delete">Удалить</button>
                </div>
                `;
            moviesEl.appendChild(movieEl);
        });
    }


    function delMovie() {        
        let deleteButton = document.querySelector('.movies');

            deleteButton.addEventListener('click', (e) => {
                let movies = JSON.parse(localStorage.getItem('movies'));

                if (e.target.dataset.action === 'delete'){
                    const title = e.target.closest('.movie').querySelector('#title').value;
                    movies = movies.filter(m => m.title != title); 
                    localStorage.setItem('movies', JSON.stringify(movies));
                    filterMovies();
                }
        });
    }

    
    function editMovie() {
        let editButton = document.querySelector('.movies');

        editButton.addEventListener('click', (e) => {

            if (e.target.dataset.action === 'edit'){

                let input = e.target.closest('.movie').querySelectorAll('input')
                let title = e.target.closest('.movie').querySelector('#title');
                let genre = e.target.closest('.movie').querySelector('#genre');
                let url = e.target.closest('.movie').querySelector('#url');
                let movies = JSON.parse(localStorage.getItem('movies'));
                let index = movies.findIndex(movie => movie.title === title.value)

                title.removeAttribute('readonly');
                genre.removeAttribute('readonly');
                url.classList.remove('hide');

                let dataTitle = title.value;
                let dataGenre = genre.value;
                let dataUrl = url.value;
                
                input.forEach(input => {
                    input.addEventListener('blur', (e) => {
                        title.setAttribute('readonly', true);
                        genre.setAttribute('readonly', true);
                        url.classList.add('hide');

                        if (!title.value || !genre.value || !url.value) {
                            alert("Пожалуйста, не оставляйте поля пустыми!");
                            title.value = dataTitle;
                            genre.value = dataGenre;
                            url.value = dataUrl;
                        } else if(movies.find(m => m.title === title.value) && movies[index].title !== title.value) {
                            alert("Такой фильм уже добавлен!");
                            title.value = dataTitle;
                        } else {
                            let movie = {
                                title: title.value,
                                genre: genre.value,
                                url: url.value,
                                favorite: movies[index].favorite
                            }
                            movies[index] = movie;
                            localStorage.setItem('movies', JSON.stringify(movies));
                            filterMovies();
                        }
                    })
                });
            }
        });
    }


    function favoritesMovies() {
        let favoritButton = document.querySelector('.movies');
        
        favoritButton.addEventListener('click', (e) => {
            let movies = JSON.parse(localStorage.getItem('movies'));

            if (e.target.dataset.action === 'favorit'){
                let title = e.target.closest('.movie').querySelector('#title');
                let index = movies.findIndex(movie => movie.title === title.value)
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
                localStorage.setItem('movies', JSON.stringify(movies));
                filterMovies()
            }
        }
    )};

    
    function filterMovies() {
        let movies = JSON.parse(localStorage.getItem('movies'));
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
                    movies = JSON.parse(localStorage.getItem('movies'));
                } else {
                    btn.classList.add("active");
                    btn.previousElementSibling.classList.remove("active");
                    movies = movies.filter(movie => movie.favorite === true)
                }
            showMovies(movies);        

            }
        )});
    }
});


/* Фильмы для теста

Мумия
Фэнтези
https://avatars.mds.yandex.net/get-kinopoisk-image/1599028/7075696b-2399-4038-9f89-283921eea7ef/300x450

Сердце пармы
Драма
https://avatars.mds.yandex.net/get-kinopoisk-image/6201401/f2d7ecc1-635c-48a2-86db-180982fd9923/300x450

*/