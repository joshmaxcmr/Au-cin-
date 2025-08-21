import React, {useState, useEffect} from 'react'
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import './App.css'
import MovieCard from "./components/MovieCard.jsx";
import {useDebounce} from 'react-use'
import {updateSearchCount} from "./appwrite.js";

const API_BASE_URL = 'https://api.themoviedb.org/3'
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
}

const App = () => {
    const [searchTerm, setSearchTerm] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [movieList, setMovieList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [debounceSearchterm, setDebounceSearchterm] = useState('')

    useDebounce(() => setDebounceSearchterm(searchTerm),500, [searchTerm])

    const fetchMovies = async (query = '') => {
        setIsLoading(true);
        setErrorMessage('')

        try {
            const endpoint = query 
                ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
                : `${API_BASE_URL}/movie/popular`;
            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) {
                throw new Error('impossible de récupérer les films');
            }
            const data = await response.json();
            
            if(data.response === 'false'){
                setErrorMessage(data.Error ||'Aucun film trouvé');
                setMovieList([]);
                return;
            }
            setMovieList(data.results || []);

            if(query && data.results.length > 0) {
                await updateSearchCount(query, data.results[0]);
            }
            
        } catch (error) {
            console.error(`Error fetching movies: ${error}`);
            setErrorMessage('Une erreur s\'est produite lors de la récupération des films. Veuillez réessayer plus tard.');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchMovies(searchTerm);
    }, [debounceSearchterm]);

    return (
        <main>
            <div className="pattern"/>
            <div className="wrapper"/>
            <header>
                <img src="./hero.png" alt="hero banner"/>
                <h1>Trouver des <span className="text-gradient">films</span> pour vos moments détentes</h1>
                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
            </header>

            <section className="all-movies">
                <h2 className="mt-20">Tout les films</h2>

                {isLoading ? (
                   <Spinner/>
                ) : errorMessage ? (
                    <p className="text-red-500">{errorMessage}</p>
                ) :(
                    <ul>
                        {movieList.map((movie) => (
                           <MovieCard key={movie.id} movie={movie}/>
                        ))}
                    </ul>
                )}
            </section>


        </main>
    )
}
export default App
