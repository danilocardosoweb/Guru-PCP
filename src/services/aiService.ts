import axios from 'axios';

const API_KEY = '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';
const API_URL = 'https://openrouter.ai/api/v1/chat/completions';

interface Message {
  role: string;
  content: string;
}

export const sendMessageToAI = async (
  message: string, 
  previousMessages: Message[]
): Promise<string> => {
  try {
    // Formatar as mensagens anteriores para o formato esperado pela API
    const formattedMessages = [
      { role: 'system', content: 'Você é o Guru PCP, um assistente virtual especializado em Planejamento e Controle da Produção (PCP). Você deve responder perguntas relacionadas a PCP de forma clara, objetiva e profissional. Utilize exemplos práticos quando possível. Formate suas respostas usando marcação de texto quando necessário para melhorar a legibilidade. Sempre use o formato de números e datas brasileiro (ex: 1.000,50 para valores e DD/MM/AAAA para datas). Responda sempre em português brasileiro.' },
      ...previousMessages,
      { role: 'user', content: message }
    ];

    const response = await axios.post(
      API_URL,
      {
        model: 'openai/gpt-3.5-turbo',
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'HTTP-Referer': 'https://guru-pcp.vercel.app',
          'X-Title': 'Guru PCP'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Erro ao comunicar com a API:', error);
    throw new Error('Falha na comunicação com o serviço de IA');
  }
};
