import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import tropicalImage from './tropical.jpg';  // Example images
import cityImage from './city.jpg';   
import mountainImage from './mountains.jpg';    
import desertImage from './desert.jpg';  
import countrysideImage from './countryside.jpg';  

function App() {
  const [vacationType, setVacationType] = useState([]);
  const [stayDuration, setStayDuration] = useState('');
  const [travelerType, setTravelerType] = useState('');
  const navigate = useNavigate();

  // Define an array of vacation types with their associated images
  const vacationTypes = [
    { type: 'Tropical', image: tropicalImage },
    { type: 'City', image: cityImage },
    { type: 'Mountain', image: mountainImage },
    { type: 'Desert', image: desertImage },
    { type: 'Countryside', image: countrysideImage }
  ];
  

  const travelerTypes = ['Adventurous', 'Relaxing', 'Cultural', 'Nature-Lover'];

  // Function to handle selection of vacation types, toggles selection on click
  const handleVacationTypeSelect = (type) => {
    if (vacationType.includes(type)) {
      setVacationType(vacationType.filter(item => item !== type));
    } else {
      setVacationType([...vacationType, type]);
    }
  };


  const handleNext = () => {
    if (vacationType.length && stayDuration && travelerType) {
      navigate('/rating-selection');
    } else {
      alert('Please make all selections before proceeding.');
    }
  };

  return (
    <div className="safar-container bg-light-green">
      <h1 className="safar-title text-center text-success">Safar</h1>
      <p className="safar-subtitle text-center">Plan Your Next Great Adventure</p>

      {/* Vacation Type Selection with Images */}
      <div className="selection-container text-center">
        <h2 className="text-success">Select Vacation Type:</h2>
        <div className="row justify-content-center">
          {vacationTypes.map(({ type, image }) => (
            <div className="col-md-2" key={type}>
              <div className={`card ${vacationType.includes(type) ? 'selected-card' : ''}`} onClick={() => handleVacationTypeSelect(type)}>
                <img src={image} className="card-img-top" alt={type} />
                <div className="card-body">
                  <h5 className="card-title text-success">{type}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

        {/* Stay Duration Input */}
      <div className="selection-container text-center mt-4">
        <h2 className="text-success">How long is your stay?</h2>
        <input
          type="number"
          className="form-control w-25 mx-auto"
          placeholder="Number of days"
          value={stayDuration}
          onChange={(e) => setStayDuration(e.target.value)}
        />
      </div>

      {/* Traveler Type Selection */}
      <div className="selection-container text-center mt-4">
        <h2 className="text-success">What type of traveler are you?</h2>
        <div className="btn-group">
          {travelerTypes.map(type => (
            <button
              key={type}
              className={`btn btn-outline-success mx-1 ${travelerType === type ? 'active' : ''}`}
              onClick={() => setTravelerType(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Next Button */}
      <div className="text-center mt-4">
        <button className="btn btn-success px-4" onClick={handleNext}>Next</button>
      </div>
    </div>
  );
}

export default App;
