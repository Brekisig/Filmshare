$(document).ready(function(){
  // Add smooth scrolling to all links
  $("a").on('click', function(event) {

    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 800, function(){
   
        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });
});

// API Key
const API_KEY = "35a13243cc51617756240cd4b86cae9d";
const baseURL = "https://image.tmdb.org/t/p/w500";

// API Path
const apiPaths = {
    searchMovie: (query) => `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${API_KEY}`,
    popularMovies: (popular) => `https://api.themoviedb.org/3/movie/$api_key=${API_KEY}`,
    findGenres: `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`,
    findCast: (credit_id) => `https://api.themoviedb.org/3/movie/${credit_id}/credits?api_key=${API_KEY}`
}

const searchInput = document.querySelector('.input-field input');
const searchMovieListContainer = document.querySelector('.search-movie-list-container');
const movieContainer = document.querySelector('.movie-container');
const castContainer = document.querySelector('.movie-container .cast-details-container');
const castDetailsContainer = document.querySelector('.movie-container .cast-details-container .cast-details');
const popularDetailsContainer = document.querySelector('.movie-container .cast-details-container .cast-details');

const findGenres = async (genre_ids) => {
    const genres = [];

    const res = fetch(apiPaths.findGenres);
    
    try {
        const res_1 = await res;
        const res_2 = await res_1.json();
        genre_ids.forEach(genre_id => {
            for (let obj of res_2.genres) {
                if (genre_id == obj.id) {
                    genres.push(obj.name);
                    break;
                }
            }
        });
        return genres;
    } 
    catch(error) {
        console.log(error);
    }
};

const clearGenresList = (genresList) => {
    Array.from(genresList.children).forEach(children => {
        children.remove();
    });
};

const clearCastDetailsContainer = (genresList) => {
    Array.from(castDetailsContainer.children).forEach(children => {
        children.remove();
    });
};

const addCastToCastDetailsContainer = async (movieId) => {
    clearCastDetailsContainer();

    const res = fetch(apiPaths.findCast(movieId));

    try {
        const res_1 = await res;
        const res_2 = await res_1.json();
        const castDetails = res_2.cast.slice(0,10);
        
        if(castDetails.length !== 0) {
            castContainer.style.display = 'block';
        } 
        else {
            castContainer.style.display = 'none';
        }
        
        castDetails.forEach(castObj => {
            const cast = document.createElement('div');
            const img = document.createElement('img');
            const tr = document.createElement('div');
            const td = document.createElement('div');
            const p = document.createElement('p');
            const ch = document.createElement('p');
            const movie = document.getElementById("movie-container");

            cast.classList.add('cast');

            img.src = castObj.profile_path !== null ? baseURL + castObj.profile_path : "./images/gray background.jpg";
            img.setAttribute('alt', `${castObj.name} Image`);
            p.textContent = castObj.name;
            if(castObj.character != ""){ch.textContent = castObj.character;}
            td.className = "name";
            ch.className = "character";
            movie.scrollIntoView({ behavior: "smooth", block: "start"});
            
            cast.append(tr, td);
            tr.append(img, td);
            td.append(p, ch);

            castDetailsContainer.appendChild(cast);
        });
    }
    catch(error) {
        console.log(error);
    }
};

const showMovieDetails = (movieObj) => {
    return (e) => {
        const movieImageURL = movieObj.poster_path !== null ? baseURL + movieObj.poster_path : "./images/gray background.jpg";
        const movieName = movieObj.title;
        const releaseYear = "(" + movieObj.release_date.substring(0,4) + ")";
        const ratings = movieObj.vote_average.toFixed(1);
        const movieDescription = movieObj.overview;
        const searchBarElement = document.getElementsByClassName('input-field');

        const movieImageElement = document.querySelector('.movie-details-container .movie-image img');
        const movieNameElement = document.querySelector('.movie-details-container .movie-details .movie-name');
        const ratingsElement = document.querySelector('.movie-details-container .movie-details .ratings span');
        const star = document.querySelectorAll('.movie-details-container .movie-details .ratings span');
        const movieDescriptionElement = document.querySelector('.movie-details-container .movie-details .description');
        const genresList = document.querySelector('.movie-details-container .movie-details .genres .genres-list');
        const cast = document.createElement('div');
    
        movieImageElement.src = movieImageURL;
        movieNameElement.innerHTML = "<h1>" + movieName + "</h1> <h3>" + releaseYear + "</h3>";
        ratingsElement.textContent = ratings/2;
        for (let i = 1; i < 11; i++) {
            if(Math.ceil(ratings) >= i && i%2 == 1){
                star[Math.ceil(i/2)].className = "fa-solid fa-star-half-stroke";
            }else if(i%2 == 0 && Math.round(ratings) >= i){
                star[Math.ceil(i/2)].className = "fa fa-star checked";
            }else if(i%2 == 0 && ratings < i && Math.round(ratings) != i-1){
                star[Math.ceil(i/2)].className = "fa-regular fa-star unchecked";
            }
        }
        /*for (let i = 1; i < 11; i++) {
            if(ratings == i){
                star[Math.round.i/2].className = "fa-solid fa-star-half-stroke";
            }else if(ratings > i){
                star[Math.round.ii/2].className = "fa fa-star checked";
            }else if(ratings < i){
                star[Math.round.ii/2].className = "fa-regular fa-star unchecked";
            }
        }*/
        movieDescriptionElement.textContent = movieDescription;
        const res = findGenres(movieObj.genre_ids.slice(0,5));
        res
        .then(genres => {
            clearGenresList(genresList);
            genres.forEach(genre => {
                const li = document.createElement('li');
                li.textContent = genre;
                genresList.appendChild(li);
            });
        })
        .catch(error => {
            console.log(error);
        })

        addCastToCastDetailsContainer(movieObj.id);

        movieContainer.style.display = "block";
        searchMovieListContainer.style.display = "none";
        clearSearchMovieListContainer();
        searchInput.value = "";
    }
};

const ResultstoContainer = async (movieId) => {

    const res = fetch(apiPaths.popularMovies(movieId));

    try {
        const res_1 = await res;
        const res_2 = await res_1.json();
        const resultDetails = res_2.results.slice(0,10);
        
        if(resultDetails.length !== 0) {
            castContainer.style.display = 'block';
        } 
        else {
            castContainer.style.display = 'none';
        }

        castDetails.forEach(castObj => {
            const cast = document.createElement('div');
            const img = document.createElement('img');
            const p = document.createElement('p');

            cast.classList.add('cast');

            img.src = castObj.profile_path !== null ? baseURL + castObj.profile_path : "./images/gray background.jpg";
            img.setAttribute('alt', `${castObj.name} Image`);
            p.textContent = castObj.name;

            cast.append(img, p);

            castDetailsContainer.appendChild(cast);
        });
    }
    catch(error) {
        console.log(error);
    }
};

const clearSearchMovieListContainer = () => {
    Array.from(searchMovieListContainer.children).forEach(children => {
        children.remove();
    });
};

const buildSearchMovieList = (moviesList) => {
    if(searchInput.value !== "") {
        searchMovieListContainer.style.display = "block";
    }
    else {
        searchMovieListContainer.style.display = "none";
    }

    clearSearchMovieListContainer();

    moviesList.forEach(movie => {
        const d = document.createElement('div');
        const d2 = document.createElement('div');
        const i = document.createElement('img');
        const h4 = document.createElement('h4');
        const p = document.createElement('p');
        
        const movieImage = movie.poster_path !== null ? baseURL + movie.poster_path : "./images/gray background.jpg";
        if(movie.release_date !== ""){h4.textContent = movie.title + " (" + movie.release_date.substring(0,4) + ")";}
        else{h4.textContent = movie.title}
        p.textContent = movie.overview.substring(0,50) + "...";
        searchMovieListContainer.appendChild(d);
        i.src = movieImage;
        d.className = "search-row";
        d2.className = "search-name";
        d.append(i, d2);
        d2.append(h4, p);
        
        d.addEventListener('click', showMovieDetails(movie));
    });
}

const searchMovie = (e) => {
    const res = fetch(apiPaths.searchMovie(searchInput.value));

    res
    .then(res => res.json())
    .then(res => {
        buildSearchMovieList(res.results.slice(0,10));
    })
    .catch(error => {
        console.log(error);
    });
};

const root = document.documentElement;
root.style.setProperty('--body-bg-color', "#fff");
root.style.setProperty('--movie-search-bg-color', "#fff");
root.style.setProperty('--logo-color', "#fff");
root.style.setProperty('--secondary-text-color', "#fff");
root.style.setProperty('--primary-text-color', "#fff");
root.style.setProperty('--primary-border-color', "#002642");

const hideSearchMovieListContainer = (e) => {
    setTimeout(() => {
        searchMovieListContainer.style.display = "none";
    }, 130);
}; 

searchInput.addEventListener('input', searchMovie);
searchInput.addEventListener('focusout', hideSearchMovieListContainer);