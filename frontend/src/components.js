import React, { useState, useEffect, useRef } from 'react';

// TMDB API Configuration with fallback
const TMDB_API_KEY = 'c8dea14dc917687ac631a52620e4f7ad';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';

// Utility function to fetch data from TMDB with timeout
const fetchFromTMDB = async (endpoint) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`${TMDB_BASE_URL}${endpoint}?api_key=${TMDB_API_KEY}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) throw new Error('API request failed');
    return await response.json();
  } catch (error) {
    console.error('TMDB API Error:', error);
    return null;
  }
};

// Header Component
export const Header = ({ onSearch, onProfileClick }) => {
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      onSearch(searchTerm);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-90 backdrop-blur-sm transition-all duration-300">
      <div className="flex items-center justify-between px-4 lg:px-16 py-4">
        {/* Logo */}
        <div className="flex items-center space-x-8">
          <h1 className="text-3xl font-bold text-red-600 cursor-pointer">NETFLIX</h1>
          
          {/* Navigation Menu */}
          <nav className="hidden md:flex space-x-6">
            {['Home', 'TV Shows', 'Movies', 'New & Popular', 'My List'].map((item) => (
              <a key={item} href="#" className="text-white hover:text-gray-300 transition-colors duration-200">
                {item}
              </a>
            ))}
          </nav>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative">
            {showSearch ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search movies, shows..."
                  className="bg-black border border-white text-white px-4 py-2 w-64 focus:outline-none focus:border-red-600"
                  autoFocus
                />
                <button type="button" onClick={() => setShowSearch(false)} className="text-white ml-2">
                  ✕
                </button>
              </form>
            ) : (
              <button onClick={() => setShowSearch(true)} className="text-white hover:text-gray-300">
                🔍
              </button>
            )}
          </div>

          {/* Notifications */}
          <button className="text-white hover:text-gray-300">
            🔔
          </button>

          {/* Profile */}
          <div className="relative">
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-2 text-white hover:text-gray-300"
            >
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                👤
              </div>
            </button>
            
            {showProfileMenu && (
              <div className="absolute right-0 top-full mt-2 bg-black bg-opacity-90 border border-gray-600 rounded w-48">
                <div className="p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center">
                      👤
                    </div>
                    <span className="text-white">User Profile</span>
                  </div>
                  <div className="border-t border-gray-600 pt-3 space-y-2">
                    <a href="#" className="block text-white hover:text-gray-300">Manage Profiles</a>
                    <a href="#" className="block text-white hover:text-gray-300">Account</a>
                    <a href="#" className="block text-white hover:text-gray-300">Help Center</a>
                    <a href="#" className="block text-white hover:text-gray-300">Sign out</a>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

// Hero Section Component with loading optimization
export const Hero = ({ featuredMovie, onPlay, onMoreInfo }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!featuredMovie) {
    return (
      <div className="relative h-screen bg-gradient-to-r from-red-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl font-bold text-white mb-4">NETFLIX</div>
          <div className="text-white text-xl animate-pulse">Loading amazing content...</div>
        </div>
      </div>
    );
  }

  const backdropUrl = featuredMovie.backdrop_path 
    ? `${TMDB_IMAGE_BASE_URL}/w1280${featuredMovie.backdrop_path}`
    : 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1280&q=80';

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Image with loading */}
      <div className="absolute inset-0">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-red-900 to-black animate-pulse"></div>
        )}
        <img 
          src={backdropUrl}
          alt={featuredMovie.title || featuredMovie.name}
          className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-4 lg:px-16">
        <div className="max-w-lg">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight animate-fade-in">
            {featuredMovie.title || featuredMovie.name || "Netflix Original"}
          </h1>
          
          <p className="text-lg lg:text-xl text-white mb-6 leading-relaxed animate-fade-in">
            {featuredMovie.overview || "Discover thousands of movies and TV shows."}
          </p>

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 animate-fade-in">
            <button 
              onClick={() => onPlay(featuredMovie)}
              className="flex items-center space-x-2 bg-white text-black px-8 py-3 rounded font-semibold hover:bg-gray-200 transition-colors duration-200"
            >
              <span>▶</span>
              <span>Play</span>
            </button>
            
            <button 
              onClick={() => onMoreInfo(featuredMovie)}
              className="flex items-center space-x-2 bg-gray-600 bg-opacity-70 text-white px-8 py-3 rounded font-semibold hover:bg-opacity-90 transition-all duration-200"
            >
              <span>ℹ</span>
              <span>More Info</span>
            </button>
          </div>

          {/* Movie Info */}
          <div className="flex items-center space-x-4 mt-6 text-white animate-fade-in">
            <span className="text-green-400 font-semibold">
              {Math.round((featuredMovie.vote_average || 8.5) * 10)}% Match
            </span>
            <span>{featuredMovie.release_date ? new Date(featuredMovie.release_date).getFullYear() : '2024'}</span>
            <span className="border border-gray-400 px-1 text-sm">HD</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// Movie Card Component with optimized loading
export const MovieCard = ({ movie, onPlay, onAddToList }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const posterUrl = movie.poster_path 
    ? `${TMDB_IMAGE_BASE_URL}/w342${movie.poster_path}`
    : null;
    
  const fallbackUrl = 'https://images.unsplash.com/photo-1489599843714-2e4aafb21fee?w=342&h=513&q=80&fit=crop';

  return (
    <div 
      className="relative group cursor-pointer flex-shrink-0 w-48 lg:w-64 transition-transform duration-300 hover:scale-105"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image with loading state */}
      <div className="relative w-full h-72 lg:h-96 bg-gray-800 rounded-lg overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 animate-pulse rounded-lg"></div>
        )}
        
        {posterUrl && !imageError ? (
          <img 
            src={posterUrl}
            alt={movie.title || movie.name}
            className={`w-full h-full object-cover rounded-lg transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageError(true);
              setImageLoaded(true);
            }}
            loading="lazy"
          />
        ) : (
          <img 
            src={fallbackUrl}
            alt={movie.title || movie.name}
            className="w-full h-full object-cover rounded-lg"
            onLoad={() => setImageLoaded(true)}
          />
        )}
        
        {/* Title overlay for fallback */}
        {(!posterUrl || imageError) && (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <h3 className="text-white text-center font-semibold">
              {movie.title || movie.name}
            </h3>
          </div>
        )}
      </div>
      
      {/* Overlay on Hover */}
      {isHovered && imageLoaded && (
        <div className="absolute inset-0 bg-black bg-opacity-80 rounded-lg flex flex-col justify-end p-4 transition-opacity duration-300">
          <h3 className="text-white font-semibold text-lg mb-2">
            {movie.title || movie.name}
          </h3>
          
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-green-400 text-sm">
              {Math.round((movie.vote_average || 7) * 10)}% Match
            </span>
            <span className="text-white text-sm">
              {movie.release_date ? new Date(movie.release_date).getFullYear() : movie.first_air_date ? new Date(movie.first_air_date).getFullYear() : '2024'}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onPlay(movie);
              }}
              className="bg-white text-black p-2 rounded-full hover:bg-gray-200 transition-colors duration-200"
            >
              ▶
            </button>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onAddToList(movie);
              }}
              className="bg-gray-600 bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90 transition-all duration-200"
            >
              +
            </button>
            
            <button className="bg-gray-600 bg-opacity-70 text-white p-2 rounded-full hover:bg-opacity-90 transition-all duration-200">
              👍
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Content Row Component
export const ContentRow = ({ title, movies, onPlay, onAddToList }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!movies || movies.length === 0) {
    return (
      <div className="px-4 lg:px-16 py-8">
        <h2 className="text-white text-2xl font-semibold mb-4">{title}</h2>
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="px-4 lg:px-16 py-8">
      <h2 className="text-white text-2xl font-semibold mb-4">{title}</h2>
      
      <div className="relative group">
        {/* Left Scroll Button */}
        <button 
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-70"
        >
          ◀
        </button>

        {/* Movies Container */}
        <div 
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <MovieCard 
              key={movie.id}
              movie={movie}
              onPlay={onPlay}
              onAddToList={onAddToList}
            />
          ))}
        </div>

        {/* Right Scroll Button */}
        <button 
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-opacity-70"
        >
          ▶
        </button>
      </div>
    </div>
  );
};

// Video Player Modal Component
export const VideoPlayer = ({ movie, onClose }) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrailer = async () => {
      if (!movie) return;
      
      setLoading(true);
      try {
        const videos = await fetchFromTMDB(`/movie/${movie.id}/videos`);
        if (videos && videos.results && videos.results.length > 0) {
          const trailer = videos.results.find(video => 
            video.type === 'Trailer' && video.site === 'YouTube'
          ) || videos.results[0];
          
          if (trailer) {
            setVideoUrl(`https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1`);
          }
        } else {
          // Fallback to a Netflix trailer if no specific trailer found
          setVideoUrl('https://www.youtube.com/embed/P8hZiRnzl4M?autoplay=1&mute=1');
        }
      } catch (error) {
        console.error('Error fetching trailer:', error);
        setVideoUrl('https://www.youtube.com/embed/P8hZiRnzl4M?autoplay=1&mute=1');
      } finally {
        setLoading(false);
      }
    };

    fetchTrailer();
  }, [movie]);

  if (!movie) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4">
      <div className="bg-black rounded-lg overflow-hidden max-w-4xl w-full max-h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-600">
          <h2 className="text-white text-xl font-semibold">
            {movie.title || movie.name}
          </h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-gray-300 text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Video Player */}
        <div className="relative aspect-video">
          {loading ? (
            <div className="absolute inset-0 bg-gray-900 flex items-center justify-center">
              <div className="text-white text-xl">Loading trailer...</div>
            </div>
          ) : (
            <iframe
              src={videoUrl}
              title={movie.title || movie.name}
              className="w-full h-full"
              frameBorder="0"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          )}
        </div>

        {/* Movie Details */}
        <div className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-green-400 font-semibold">
              {Math.round(movie.vote_average * 10)}% Match
            </span>
            <span className="text-white">
              {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
            </span>
            <span className="border border-gray-400 text-white px-2 py-1 text-sm">HD</span>
          </div>

          <p className="text-white text-lg leading-relaxed mb-4">
            {movie.overview}
          </p>

          <div className="flex items-center space-x-4">
            <button className="bg-white text-black px-6 py-2 rounded font-semibold hover:bg-gray-200 transition-colors duration-200">
              Play
            </button>
            <button className="bg-gray-600 bg-opacity-70 text-white px-6 py-2 rounded font-semibold hover:bg-opacity-90 transition-all duration-200">
              + My List
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Footer Component
export const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 px-4 lg:px-16 py-12">
      <div className="max-w-6xl mx-auto">
        <p className="mb-8">Questions? Contact us.</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="space-y-3">
            <a href="#" className="block hover:text-white transition-colors duration-200">FAQ</a>
            <a href="#" className="block hover:text-white transition-colors duration-200">Investor Relations</a>
            <a href="#" className="block hover:text-white transition-colors duration-200">Privacy</a>
            <a href="#" className="block hover:text-white transition-colors duration-200">Speed Test</a>
          </div>
          
          <div className="space-y-3">
            <a href="#" className="block hover:text-white transition-colors duration-200">Help Center</a>
            <a href="#" className="block hover:text-white transition-colors duration-200">Jobs</a>
            <a href="#" className="block hover:text-white transition-colors duration-200">Cookie Preferences</a>
            <a href="#" className="block hover:text-white transition-colors duration-200">Legal Notices</a>
          </div>
          
          <div className="space-y-3">
            <a href="#" className="block hover:text-white transition-colors duration-200">Account</a>
            <a href="#" className="block hover:text-white transition-colors duration-200">Ways to Watch</a>
            <a href="#" className="block hover:text-white transition-colors duration-200">Corporate Information</a>
            <a href="#" className="block hover:text-white transition-colors duration-200">Only on Netflix</a>
          </div>
          
          <div className="space-y-3">
            <a href="#" className="block hover:text-white transition-colors duration-200">Media Center</a>
            <a href="#" className="block hover:text-white transition-colors duration-200">Terms of Use</a>
            <a href="#" className="block hover:text-white transition-colors duration-200">Contact Us</a>
          </div>
        </div>

        <div className="mb-6">
          <button className="border border-gray-600 text-gray-400 px-4 py-2 rounded">
            Service Code
          </button>
        </div>

        <p className="text-sm">© 1997-2024 Netflix, Inc.</p>
      </div>
    </footer>
  );
};