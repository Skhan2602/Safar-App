import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { generateItinerary } from './openaiService';
import './ItineraryPage.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function ItineraryPage() {
  const { state } = useLocation();
  const [itinerary, setItinerary] = useState(state?.itinerary || '');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);

  const handleSendMessage = async () => {
    if (message.trim()) {
      setChatHistory([...chatHistory, { role: 'user', content: message }]);
      const prompt = `Modify the following itinerary with: ${message}`;
      try {
        const response = await generateItinerary(prompt);
        setItinerary(response);
        setChatHistory([...chatHistory, { role: 'user', content: message }, { role: 'system', content: response }]);
        setMessage('');
      } catch (error) {
        console.error('Failed to modify itinerary:', error);
      }
    }
  };

  return (
    <div className="itinerary-page bg-light">
      <h1 className="text-center text-success">Your Itinerary</h1>
      <div className="itinerary-content text-center">
        <p>{itinerary}</p>
      </div>

      <div className="chat-box-container">
        <div className="chat-history">
          {chatHistory.map((msg, index) => (
            <div key={index} className={`chat-message ${msg.role}`}>
              <p>{msg.content}</p>
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            type="text"
            className="form-control"
            placeholder="Add or remove something from the itinerary..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="btn btn-primary mt-2" onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ItineraryPage;
