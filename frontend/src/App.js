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

  // Fetch all movie data on component mount with optimization
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Fetch priority content first (featured movie and trending)
        const trending = await fetchFromTMDB('/trending/movie/week');
        if (trending && trending.results && trending.results.length > 0) {
          setFeaturedMovie(trending.results[0]);
          setTrendingMovies(trending.results.slice(0, 10)); // Limit to 10 items
          setLoading(false); // Allow initial render
        }

        // Fetch remaining content in parallel but with smaller sets
        const [popular, topRated, tvPopular] = await Promise.all([
          fetchFromTMDB('/movie/popular'),
          fetchFromTMDB('/movie/top_rated'),
          fetchFromTMDB('/tv/popular')
        ]);

        if (popular && popular.results) {
          setPopularMovies(popular.results.slice(0, 10));
        }
        if (topRated && topRated.results) {
          setTopRatedMovies(topRated.results.slice(0, 10));
        }
        if (tvPopular && tvPopular.results) {
          setTvShows(tvPopular.results.slice(0, 10));
        }

        // Fetch genre movies with delay to not overwhelm API
        setTimeout(async () => {
          const [actionGenre, comedyGenre, horrorGenre] = await Promise.all([
            fetchFromTMDB('/discover/movie?with_genres=28'),
            fetchFromTMDB('/discover/movie?with_genres=35'),
            fetchFromTMDB('/discover/movie?with_genres=27')
          ]);

          if (actionGenre && actionGenre.results) {
            setActionMovies(actionGenre.results.slice(0, 10));
          }
          if (comedyGenre && comedyGenre.results) {
            setComedyMovies(comedyGenre.results.slice(0, 10));
          }
          if (horrorGenre && horrorGenre.results) {
            setHorrorMovies(horrorGenre.results.slice(0, 10));
          }
        }, 1000);

      } catch (error) {
        console.error('Error fetching data:', error);
        // Fallback to mock data if API fails
        setFeaturedMovie({
          id: 1,
          title: "Netflix Original",
          overview: "Welcome to Netflix! Discover thousands of movies and TV shows.",
          backdrop_path: null,
          vote_average: 8.5,
          release_date: "2024"
        });
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
      <div className="min-h-screen bg-black">
        {/* Header */}
        <Header 
          onSearch={() => {}}
          onProfileClick={() => {}}
        />
        
        {/* Loading Hero */}
        <div className="relative h-screen bg-gradient-to-r from-red-900 to-black flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl font-bold text-red-600 mb-4 animate-pulse">NETFLIX</div>
            <div className="text-white text-xl">Loading amazing content...</div>
            <div className="mt-4">
              <div className="w-16 h-1 bg-red-600 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
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
