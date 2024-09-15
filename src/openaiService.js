import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: 'YOUR-OPEN-AI-KEY',
  dangerouslyAllowBrowser: true
});

export const generateItinerary = async (prompt) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a travel planner. Provide itineraries in the following format:\n\nDestination: [Destination Name]\nDay 1: [Activities]\nSites/Places to visit: [Site 1], [Site 2], [Site 3]\nDay 2: [Activities]\nSites/Places to visit: [Site 1], [Site 2], [Site 3]\n...' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 1000,
    });

    const generatedText = response.choices[0].message.content.trim();
    return generatedText;
  } catch (error) {
    console.error("Error generating itinerary: ", error);
    throw new Error('Failed to generate itinerary');
  }
};