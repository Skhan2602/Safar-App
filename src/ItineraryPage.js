import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { generateItinerary } from './openaiService';
import { Container, Row, Col, Card, Form, Button, ListGroup } from 'react-bootstrap';
import { FaLeaf, FaPaperPlane } from 'react-icons/fa';
import './ItineraryPage.css';

function ItineraryPage() {
  const { state } = useLocation();
  const [itinerary, setItinerary] = useState(state?.itinerary || '');
  const [destination, setDestination] = useState('');
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    parseItinerary(itinerary);
  }, [itinerary]);

  const parseItinerary = (itineraryText) => {
    const lines = itineraryText.split('\n');
    if (lines[0].startsWith('Destination:')) {
      setDestination(lines[0].split(':')[1].trim());
      setItinerary(lines.slice(1).join('\n'));
    }
  };

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

  const formatItinerary = (itineraryText) => {
    const dayBlocks = itineraryText.match(/(Day \d+:.*?)(?=Day \d+:|$)/gs) || [];
    return dayBlocks.map((dayBlock, index) => {
      const [dayHeader, ...dayContent] = dayBlock.split(':');
      const dayText = dayContent.join(':').trim();
  
      // Further split into activities and sites, if applicable
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
        </Col>
      </Row>
    </Container>
  );
}

export default ItineraryPage;