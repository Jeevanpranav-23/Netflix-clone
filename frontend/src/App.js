import React, { useState, useEffect } from "react";
import "./App.css";
import { 
  Header, 
  Hero, 
  ContentRow, 
  VideoPlayer, 
  Footer 
} from "./components";

// TMDB API Configuration
const TMDB_API_KEY = 'c8dea14dc917687ac631a52620e4f7ad';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Utility function to fetch data from TMDB
const fetchFromTMDB = async (endpoint) => {
  try {
    const response = await fetch(`${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}`);
    if (!response.ok) throw new Error('API request failed');
    return await response.json();
  } catch (error) {
    console.error('TMDB API Error:', error);
    return null;
  }
};

const NetflixClone = () => {
  const [featuredMovie, setFeaturedMovie] = useState(null);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [actionMovies, setActionMovies] = useState([]);
  const [comedyMovies, setComedyMovies] = useState([]);
  const [horrorMovies, setHorrorMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);
  const [myList, setMyList] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all movie data on component mount
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Fetch featured movie (trending)
        const trending = await fetchFromTMDB('/trending/movie/week');
        if (trending && trending.results && trending.results.length > 0) {
          setFeaturedMovie(trending.results[0]);
          setTrendingMovies(trending.results);
        }

        // Fetch popular movies
        const popular = await fetchFromTMDB('/movie/popular');
        if (popular && popular.results) {
          setPopularMovies(popular.results);
        }

        // Fetch top rated movies
        const topRated = await fetchFromTMDB('/movie/top_rated');
        if (topRated && topRated.results) {
          setTopRatedMovies(topRated.results);
        }

        // Fetch TV shows
        const tvPopular = await fetchFromTMDB('/tv/popular');
        if (tvPopular && tvPopular.results) {
          setTvShows(tvPopular.results);
        }

        // Fetch movies by genre
        const actionGenre = await fetchFromTMDB('/discover/movie?with_genres=28');
        if (actionGenre && actionGenre.results) {
          setActionMovies(actionGenre.results);
        }

        const comedyGenre = await fetchFromTMDB('/discover/movie?with_genres=35');
        if (comedyGenre && comedyGenre.results) {
          setComedyMovies(comedyGenre.results);
        }

        const horrorGenre = await fetchFromTMDB('/discover/movie?with_genres=27');
        if (horrorGenre && horrorGenre.results) {
          setHorrorMovies(horrorGenre.results);
        }

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Handle search
  const handleSearch = async (searchTerm) => {
    if (!searchTerm.trim()) {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    const searchData = await fetchFromTMDB(`/search/multi?query=${encodeURIComponent(searchTerm)}`);
    if (searchData && searchData.results) {
      setSearchResults(searchData.results);
    }
  };

  // Handle play movie
  const handlePlay = (movie) => {
    setSelectedMovie(movie);
    setShowVideoPlayer(true);
  };

  // Handle more info
  const handleMoreInfo = (movie) => {
    setSelectedMovie(movie);
    setShowVideoPlayer(true);
  };

  // Handle add to list
  const handleAddToList = (movie) => {
    if (!myList.find(item => item.id === movie.id)) {
      setMyList([...myList, movie]);
      alert(`${movie.title || movie.name} added to your list!`);
    } else {
      alert(`${movie.title || movie.name} is already in your list!`);
    }
  };

  // Handle close video player
  const handleCloseVideoPlayer = () => {
    setShowVideoPlayer(false);
    setSelectedMovie(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-2xl">Loading Netflix...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <Header 
        onSearch={handleSearch}
        onProfileClick={() => {}}
      />

      {/* Main Content */}
      <main>
        {isSearching ? (
          // Search Results
          <div className="pt-20">
            <ContentRow
              title={`Search Results`}
              movies={searchResults}
              onPlay={handlePlay}
              onAddToList={handleAddToList}
            />
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <Hero 
              featuredMovie={featuredMovie}
              onPlay={handlePlay}
              onMoreInfo={handleMoreInfo}
            />

            {/* Content Rows */}
            <div className="space-y-8 -mt-32 relative z-20">
              <ContentRow
                title="Trending Now"
                movies={trendingMovies}
                onPlay={handlePlay}
                onAddToList={handleAddToList}
              />

              <ContentRow
                title="Popular Movies"
                movies={popularMovies}
                onPlay={handlePlay}
                onAddToList={handleAddToList}
              />

              <ContentRow
                title="Top Rated Movies"
                movies={topRatedMovies}
                onPlay={handlePlay}
                onAddToList={handleAddToList}
              />

              <ContentRow
                title="TV Shows"
                movies={tvShows}
                onPlay={handlePlay}
                onAddToList={handleAddToList}
              />

              <ContentRow
                title="Action Movies"
                movies={actionMovies}
                onPlay={handlePlay}
                onAddToList={handleAddToList}
              />

              <ContentRow
                title="Comedy Movies"
                movies={comedyMovies}
                onPlay={handlePlay}
                onAddToList={handleAddToList}
              />

              <ContentRow
                title="Horror Movies"
                movies={horrorMovies}
                onPlay={handlePlay}
                onAddToList={handleAddToList}
              />

              {myList.length > 0 && (
                <ContentRow
                  title="My List"
                  movies={myList}
                  onPlay={handlePlay}
                  onAddToList={handleAddToList}
                />
              )}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Video Player Modal */}
      {showVideoPlayer && selectedMovie && (
        <VideoPlayer 
          movie={selectedMovie}
          onClose={handleCloseVideoPlayer}
        />
      )}
    </div>
  );
};

function App() {
  return <NetflixClone />;
}

export default App;
