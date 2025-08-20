import React, {useState, useEffect} from 'react'
import Search from "./components/Search.jsx";

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

    const fetchMovies = async () => {
        setIsLoading(true);
        setErrorMessage('')

        try {
            const endpoint = `${API_BASE_URL}/discover/movies?sort_by=popularity.desc`;
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
        } catch (error) {
            console.error(`Error fetching movies: ${error}`);
            setErrorMessage('Une erreur s\'est produite lors de la récupération des films. Veuillez réessayer plus tard.');
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchMovies();
    }, []);

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
                <h2>Tout les films</h2>

                {isLoading ? (
                   <p className="text-white">Chargement...</p>
                ) : errorMessage ? (
                    <p className="text-red-500">{errorMessage}</p>
                ) :(
                    <ul>
                        
                    </ul>
                )}
            </section>


        </main>
    )
}
export default App
