import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateItinerary } from './openaiService';
import tropicalImg from './assets/tropical.jpg';
import cityImg from './assets/city.jpg';
import desertImg from './assets/desert.jpg';
import mountainImg from './assets/mountains.jpg';
import countrySideImg from './assets/countryside.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Home.css';

// Array of vacation types and their corresponding images
const vacationTypes = [
  { type: 'Tropical', image: tropicalImg },  // Use the imported image
  { type: 'City', image: cityImg },
  { type: 'Mountain', image: mountainImg },
  { type: 'Desert', image: desertImg },
  { type: 'Countryside', image: countrySideImg }
];

// Array of available traveler types
const travelerTypes = ['Adventurous', 'Relaxing', 'Cultural', 'Nature-Lover'];

export default function Home() {
  const [vacationType, setVacationType] = useState([]);
  const [stayDuration, setStayDuration] = useState('');
  const [travelerType, setTravelerType] = useState('');
  const navigate = useNavigate();

  // Handle selecting/deselecting vacation types (supports multiple selection)
  const handleVacationTypeSelect = (type) => {
    setVacationType(prev => 
      prev.includes(type) ? prev.filter(item => item !== type) : [...prev, type]
    );
  };

  // Generate the itinerary when user clicks the button
  const handleGenerateItinerary = async () => {
    // Ensure that vacation type, stay duration, and traveler type are all selected
    if (vacationType.length && stayDuration && travelerType) {
      const prompt = `I want a ${travelerType} trip to a ${vacationType.join(', ')} destination for ${stayDuration} days.`;
      try {
        const response = await generateItinerary(prompt);
        navigate('/itinerary', { state: { itinerary: response } });
      } catch (error) {
        console.error('Failed to generate itinerary:', error);
      }
    } else {
      alert('Please make all selections before proceeding.');
    }
  };

  return (
    <div className="safar-container">
      <header className="safar-header">
        <div className="header-overlay"></div>
        <div className="header-content">
          <h1 className="safar-title">Safar</h1>
          <p className="safar-subtitle">Plan Your Next Great Adventure</p>
        </div>
      </header>

      <div className="container my-5">
        <div className="mb-5">
        <h2 className="section-title">Choose Your Dream Destination</h2>
          <div className="row g-4">
            {vacationTypes.map(({ type, image }) => (
              <div key={type} className="col-6 col-md-4 col-lg">
                <div 
                  className={`vacation-card ${vacationType.includes(type) ? 'selected-card' : ''}`}
                  onClick={() => handleVacationTypeSelect(type)}
                >
                  <img src={process.env.PUBLIC_URL + image} className="card-img-top" alt={type} />
                  <div className="card-img-overlay">
                    <h5 className="card-title">{type}</h5>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-5">
          <h2 className="section-title">How Long Is Your Dream Vacation?</h2>
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="input-group input-group-lg">
                <input
                  type="number"
                  className="form-control border-success"
                  placeholder="Number of days"
                  value={stayDuration}
                  onChange={(e) => setStayDuration(e.target.value)}
                />
                <span className="input-group-text bg-success text-white">Days</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-5">
          <h2 className="section-title">What's Your Travel Style?</h2>
          <div className="traveler-type-buttons">
            {travelerTypes.map(type => (
              <button
                key={type}
                className={`btn btn-lg ${travelerType === type ? 'btn-success' : 'btn-outline-success'}`}
                onClick={() => setTravelerType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="text-center">
          <button
            className="generate-btn btn btn-success btn-lg"
            onClick={handleGenerateItinerary}
          >
            Create My Dream Itinerary
          </button>
        </div>
      </div>

      <footer className="safar-footer">
        <p>© 2024 Safar - Your AI Travel Companion</p>
      </footer>
    </div>
  );
}