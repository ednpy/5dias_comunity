import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${query}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-bar__container">
      <input
        placeholder="Buscar"
        className="search-bar__input"
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button className="search-bar__button" type="submit">
        <svg viewBox="0 0 16 16" className="bi bi-search" fill="currentColor" height="16" width="16" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
        </svg>
      </button>
    </form>
  );
};

export default SearchBar;