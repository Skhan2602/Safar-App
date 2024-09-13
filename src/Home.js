import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateItinerary } from './openaiService';
import './Home.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import tropicalImage from './tropical.jpg';  
import cityImage from './city.jpg';  
import mountainImage from './mountains.jpg';  
import desertImage from './desert.jpg';  
import countrysideImage from './countryside.jpg';  

function Home() {
  const [vacationType, setVacationType] = useState([]);
  const [stayDuration, setStayDuration] = useState('');
  const [travelerType, setTravelerType] = useState('');
  const navigate = useNavigate();

  const vacationTypes = [
    { type: 'Tropical', image: tropicalImage },
    { type: 'City', image: cityImage },
    { type: 'Mountain', image: mountainImage },
    { type: 'Desert', image: desertImage },
    { type: 'Countryside', image: countrysideImage }
  ];

  const travelerTypes = ['Adventurous', 'Relaxing', 'Cultural', 'Nature-Lover'];

  const handleVacationTypeSelect = (type) => {
    if (vacationType.includes(type)) {
      setVacationType(vacationType.filter(item => item !== type));
    } else {
      setVacationType([...vacationType, type]);
    }
  };

  const handleGenerateItinerary = async () => {
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
    <div className="safar-container bg-light-green">
      <h1 className="safar-title text-center text-success">Safar</h1>
      <p className="safar-subtitle text-center">Plan Your Next Great Adventure</p>

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

      <div className="text-center mt-4">
        <button className="btn btn-success px-4" onClick={handleGenerateItinerary}>Generate Itinerary</button>
      </div>
    </div>
  );
}

export default Home;
