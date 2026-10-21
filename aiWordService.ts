import { GoogleGenAI } from '@google/genai';
import { WordItem, Category } from '../types/vocabulary';

export async function generateVocabularyCardWithAI(searchQuery: string): Promise<WordItem | null> {
  try {
    const ai = new GoogleGenAI();
    const prompt = `You are an expert bilingual English-Bengali educator and lexicographer.
Generate a structured JSON vocabulary card for the English word or phrase: "${searchQuery}".
The output MUST be clean JSON with no markdown wrapping or code ticks, strictly matching this structure:
{
  "word": "Exact English Word with correct capitalization",
  "phonetic": "/international phonetic alphabet/",
  "partOfSpeech": "noun" or "verb" or "adjective" or "adverb" or "phrase",
  "banglaMeaning": "Accurate, clear Bengali translation and meaning",
  "category": "Daily Use" or "Advanced" or "Travel" or "Business" or "Academic",
  "difficulty": "Beginner" or "Intermediate" or "Advanced",
  "examples": [
    {
      "english": "Sentence 1 in natural modern English illustrating the word clearly.",
      "bangla": "Sentence 1 clear Bengali translation."
    },
    {
      "english": "Sentence 2 in realistic conversational or professional context.",
      "bangla": "Sentence 2 clear Bengali translation."
    }
  ],
  "distractors": [
    "Plausible incorrect Bengali meaning 1",
    "Plausible incorrect Bengali meaning 2",
    "Plausible incorrect Bengali meaning 3"
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const text = response.text;
    if (!text) return null;

    const data = JSON.parse(text);

    return {
      id: `ai-gen-${Date.now()}`,
      word: data.word || searchQuery,
      phonetic: data.phonetic || '/.../',
      partOfSpeech: data.partOfSpeech || 'noun',
      banglaMeaning: data.banglaMeaning || 'বাংলা অর্থ',
      category: (data.category as Category) || 'Daily Use',
      difficulty: data.difficulty || 'Intermediate',
      visualIcon: 'sparkles',
      themeColor: 'from-emerald-500 to-indigo-600',
      examples: data.examples && data.examples.length >= 2 
        ? [data.examples[0], data.examples[1]] 
        : [
            { english: `Practice using "${searchQuery}" daily.`, bangla: `প্রতিদিন "${searchQuery}" প্রয়োগ করার চর্চা করুন।` },
            { english: `This word is useful in communication.`, bangla: `যোগাযোগের ক্ষেত্রে এই শব্দটি অত্যন্ত প্রয়োজনীয়।` }
          ],
      distractors: data.distractors || ['অলসতা', 'ভুল ধারণা', 'অপ্রয়োজনীয় বিষয়']
    };
  } catch (error) {
    console.error('Failed to generate AI vocabulary item:', error);
    return null;
  }
}
