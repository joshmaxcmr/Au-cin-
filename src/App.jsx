import React, {useState, useEffect} from 'react'
import Search from "./components/Search.jsx";

const API_BASE_URL = 'https://api.themoviedb.org'
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

    useEffect(() => {

    }, []);

    return (
        <main>
            <div className="pattern"/>
            <div className="wrapper"/>
            <header>
                <img src="./hero.png" alt="hero banner"/>
                <h1>Trouver des <span className="text-gradient">films</span> pour vos moments détentes</h1>
            </header>

            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>

        </main>
    )
}
export default App
