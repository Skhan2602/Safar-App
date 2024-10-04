const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors'); // Add this line

const app = express();

app.use(cors()); // Add this line to enable CORS
app.use(express.json()); 

const transporter = nodemailer.createTransport({
  host: 'smtp.mail.yahoo.com',
  auth: {
    user: 'your-email',
    pass: 'your-password',
  },
});

app.post('/api/share-itinerary', (req, res) => {
  const { email, itinerary } = req.body;

  const mailOptions = {
    from: 'babarsher26@yahoo.com',
    to: email,
    subject: 'Your Green Adventure Itinerary',
    text: itinerary,
    html: `<h1>Your Green Adventure Itinerary</h1><pre>${itinerary}</pre>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      return res.status(500).json({ message: 'Failed to send itinerary' });
    }
    res.status(200).json({ message: 'Itinerary sent successfully' });
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
