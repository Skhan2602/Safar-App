import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { generateItinerary } from './openaiService';        // API call to generate itinerary
import { Container, Row, Col, Card, Form, Button, ListGroup, Modal } from 'react-bootstrap';
import { FaLeaf, FaPaperPlane } from 'react-icons/fa';      // Icons for UI
import axios from 'axios';
import './ItineraryPage.css';

function ItineraryPage() {
  const { state } = useLocation();              // Get itinerary data passed through routing
  const [itinerary, setItinerary] = useState(state?.itinerary || '');   // Store the itinerary
  const [destination, setDestination] = useState('');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false); // For the share modal
  const [email, setEmail] = useState(''); // Email input for the share feature
  const [loading, setLoading] = useState(false); // Loading state for email sending
  const [emailSent, setEmailSent] = useState(false); // Track if the email was successfully sent

  useEffect(() => {
    parseItinerary(itinerary);
  }, [itinerary]);

  // Extract the destination from the itinerary and update state
  const parseItinerary = (itineraryText) => {
    const lines = itineraryText.split('\n');
    if (lines[0].startsWith('Destination:')) {
      setDestination(lines[0].split(':')[1].trim());
      setItinerary(lines.slice(1).join('\n'));
    }
  };

  // Handle modifying the itinerary via chat input and generate a new itinerary
  const handleSendMessage = async () => {
    if (message.trim()) {
      setChatHistory([...chatHistory, { role: 'user', content: message }]);
      setIsLoading(true);
      const prompt = `Modify the following itinerary for ${destination} with: ${message}`;
      try {
        const response = await generateItinerary(prompt);
        parseItinerary(response);
        setChatHistory([...chatHistory, { role: 'user', content: message }, { role: 'system', content: response }]);
        setMessage('');
      } catch (error) {
        console.error('Failed to modify itinerary:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // Format the itinerary into individual day cards
  const formatItinerary = (itineraryText) => {
    const dayBlocks = itineraryText.match(/(Day \d+:.*?)(?=Day \d+:|$)/gs) || [];
    return dayBlocks.map((dayBlock, index) => {
      const [dayHeader, ...dayContent] = dayBlock.split(':');
      const dayText = dayContent.join(':').trim();

      const [activities, sites] = dayText.split('Sites/Places to visit:');
      return (
        <Card key={index} className="mb-4 itinerary-day">
          <Card.Header as="h3" className="bg-success text-white">{dayHeader.trim()}</Card.Header>
          <Card.Body>
            <Card.Text>{activities ? activities.trim() : 'No activities listed for this day.'}</Card.Text>
            {sites && (
              <div className="sites-to-visit">
                <h5 className="text-success">Sites/Places to visit:</h5>
                <ListGroup variant="flush">
                  {sites.split(',').map((site, siteIndex) => (
                    <ListGroup.Item key={siteIndex}>
                      <FaLeaf className="mr-2 text-success" /> {site.trim()}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            )}
          </Card.Body>
        </Card>
      );
    });
  };

  // Handle Share button click and email modal
  const handleShowShareModal = () => setShowShareModal(true);
  const handleCloseShareModal = () => {
    setShowShareModal(false);
    setEmail('');
    setEmailSent(false);
  };

  // Handle sending the itinerary via email
  const handleEmailSubmit = async () => {
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    alert('Please enter a valid email address.');
    return;
  }

  setLoading(true);
  try {
    const response = await axios.post('/api/share-itinerary', {     // POST request to send the itinerary
      email,
      itinerary: `Destination: ${destination}\n${itinerary}`,
    });

    if (response.data.message === 'Itinerary sent successfully') {
      setEmailSent(true);
    } else {
      alert('Failed to send email: ' + response.data.message);
    }
  } catch (error) {
    console.error('Error sending email:', error);
    alert('Error sending email.');
  } finally {
    setLoading(false);
  }
};

  return (
    <Container fluid className="itinerary-page py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <h1 className="text-center text-success mb-4">Your Green Adventure Awaits</h1>
          {destination && <h2 className="text-center text-success mb-5">Destination: {destination}</h2>}
          <div className="itinerary-content">
            {formatItinerary(itinerary)}
          </div>

          <Card className="mt-5 chat-box">
            <Card.Header as="h3" className="bg-success text-white">Modify Your Itinerary</Card.Header>
            <Card.Body>
              <div className="chat-history mb-3">
                {chatHistory.map((msg, index) => (
                  <div key={index} className={`chat-message ${msg.role}`}>
                    <p>{msg.content}</p>
                  </div>
                ))}
              </div>
              <Form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}>
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Add or remove something from the itinerary..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </Form.Group>
                <Button 
                  variant="success" 
                  type="submit" 
                  className="mt-2 d-flex align-items-center justify-content-center" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating...' : 'Send'} 
                  {!isLoading && <FaPaperPlane className="ml-2" />}
                </Button>
              </Form>
            </Card.Body>
          </Card>

          {/* Share Button */}
          <div className="share-button-bubble" onClick={handleShowShareModal}>
            <Button variant="success">
              <i className="fas fa-share-alt"></i> Share
            </Button>
          </div>

          {/* Share Modal */}
          <Modal show={showShareModal} onHide={handleCloseShareModal}>
            <Modal.Header closeButton>
              <Modal.Title>Share Itinerary</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="email">
                  <Form.Label>Enter your email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>
              </Form>
              {emailSent && <p className="text-success">Itinerary sent successfully to {email}!</p>}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseShareModal}>
                Close
              </Button>
              <Button variant="primary" onClick={handleEmailSubmit} disabled={loading}>
                {loading ? 'Sending...' : 'Send Itinerary'}
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </Row>
    </Container>
  );
}

export default ItineraryPage;