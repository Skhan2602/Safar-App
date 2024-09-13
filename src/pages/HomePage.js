// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

function HomePage() {
  return (
    <div className="game-container">
      <h1 className="title">Welcome to Movie Recommender</h1>
      <p className="subtext">Personalized movie suggestions at your fingertips</p>
      <Link to="/genre-selection">
        <button className="button">Get Started</button>
      </Link>
    </div>
  );
}

export default HomePage;
