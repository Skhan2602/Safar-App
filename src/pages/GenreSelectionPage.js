import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../App.css';

function GenreSelectionPage() {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const navigate = useNavigate();

  const genres = ['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi'];

  // Toggle genre selection for multiple genres
  const handleGenreSelect = (genre) => {
    if (selectedGenres.includes(genre)) {
      // Remove the genre if it's already selected
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      // Add the genre if it's not selected
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleNext = () => {
    if (selectedGenres.length > 0) {
      navigate('/rating-selection', { state: { selectedGenres } });
    }
  };

  return (
    <div className="game-container">
      <h1 className="title">Choose Your Genres</h1>
      <p className="subtext">Select one or more genres</p>
      <div className="genre-cards">
        {genres.map((genre) => (
          <div
            key={genre}
            className={`genre-card ${selectedGenres.includes(genre) ? 'selected' : ''}`}
            onClick={() => handleGenreSelect(genre)}
          >
            <h2>{genre}</h2>
          </div>
        ))}
      </div>
      {selectedGenres.length > 0 && (
        <>
          <p className="selected-genre">Selected Genres: {selectedGenres.join(', ')}</p>
          <button className="button" onClick={handleNext}>
            Next
          </button>
        </>
      )}
    </div>
  );
}

export default GenreSelectionPage;
