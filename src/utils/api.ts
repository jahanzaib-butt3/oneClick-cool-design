import { Groq } from 'groq-sdk';

const getGroqClient = () => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error('GROQ API key is missing. Please add your API key to the .env file.');
  }

  return new Groq({
    apiKey,
    dangerouslyAllowBrowser: true
  });
};

export const generateChatResponse = async (messages: { role: string; content: string }[], model: string) => {
  if (!messages?.length) {
    throw new Error('No messages provided');
  }

  try {
    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      messages,
      model,
      temperature: 0.7,
      max_tokens: 1000,
      top_p: 1,
      stream: false,
      stop: null,
    });

    if (!completion?.choices?.[0]?.message) {
      throw new Error('Invalid response from GROQ API');
    }

    return completion.choices[0].message;
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        throw new Error('Please configure your GROQ API key in the environment variables.');
      }
      throw new Error(`Chat error: ${error.message}`);
    }
    throw new Error('An unexpected error occurred during chat.');
  }
};