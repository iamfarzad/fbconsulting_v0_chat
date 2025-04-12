import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
  type Message,
  type LanguageModelV1,
  type ImageModel,
  type LanguageModelV1CallOptions,
  type LanguageModelV1StreamPart,
} from 'ai';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');
const geminiPro = genAI.getGenerativeModel({
  model: 'gemini-2.5-pro-preview-03-25',
});
const geminiProVision = genAI.getGenerativeModel({
  model: 'gemini-pro-vision',
});

// Initialize cache
const cache = new Map<
  string,
  {
    text: string;
    timestamp: number;
    usage: { promptTokens: number; completionTokens: number };
  }
>();

const CACHE_TTL = 1000 * 60 * 60; // 1 hour cache TTL

// Create Gemini model interface
const createGeminiModel = (): LanguageModelV1 => ({
  specificationVersion: 'v1',
  modelId: 'gemini-2.5-pro-preview-03-25',
  provider: 'google',
  defaultObjectGenerationMode: 'json',

  async doGenerate(options: LanguageModelV1CallOptions) {
    try {
      const prompt = Array.isArray(options.prompt)
        ? options.prompt.join('\n')
        : options.prompt;

      // Check cache first
      const cacheKey = prompt;
      const cached = cache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        return {
          text: cached.text,
          reasoning: [{ type: 'text' as const, text: cached.text }],
          finishReason: 'stop' as const,
          usage: cached.usage,
          rawCall: {
            rawPrompt: prompt,
            rawSettings: {},
          },
        };
      }

      const result = await geminiPro.generateContent(prompt);
      const text = result.response.text();

      // Cache the result
      cache.set(cacheKey, {
        text,
        timestamp: Date.now(),
        usage: {
          promptTokens: prompt.length,
          completionTokens: text.length,
        },
      });

      return {
        text,
        reasoning: [{ type: 'text' as const, text }],
        finishReason: 'stop' as const,
        usage: {
          promptTokens: prompt.length,
          completionTokens: text.length,
        },
        rawCall: {
          rawPrompt: prompt,
          rawSettings: {},
        },
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  },

  async doStream(options: LanguageModelV1CallOptions) {
    try {
      const prompt = Array.isArray(options.prompt)
        ? options.prompt.join('\n')
        : options.prompt;

      // Reuse the same API call for both streaming and completion
      const result = await geminiPro.generateContent(prompt);
      const text = result.response.text();

      // Use larger chunk size to reduce overhead
      const chunkSize = 20; // Increased from 5
      const stream = new ReadableStream<LanguageModelV1StreamPart>({
        start(controller) {
          // Stream in larger chunks
          for (let i = 0; i < text.length; i += chunkSize) {
            controller.enqueue({
              type: 'text-delta',
              textDelta: text.slice(i, Math.min(i + chunkSize, text.length)),
            });
          }

          controller.enqueue({
            type: 'finish',
            finishReason: 'stop',
            usage: {
              promptTokens: prompt.length,
              completionTokens: text.length,
            },
          });
          controller.close();
        },
      });

      return {
        stream,
        rawCall: {
          rawPrompt: prompt,
          rawSettings: {},
        },
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  },
});

// Create vision model interface
const createVisionModel = (): ImageModel => ({
  specificationVersion: 'v1',
  modelId: 'gemini-pro-vision',
  provider: 'google',
  maxImagesPerCall: 1,

  async doGenerate({ prompt }: { prompt: string }) {
    try {
      const result = await geminiProVision.generateContent([prompt]);
      return {
        images: [],
        warnings: [],
        response: {
          timestamp: new Date(),
          modelId: 'gemini-pro-vision',
          headers: {},
        },
      };
    } catch (error) {
      console.error('Gemini Vision API error:', error);
      throw error;
    }
  },
});

// Export configured provider
export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        // Create single model instance and reuse it
        ...(() => {
          const baseModel = createGeminiModel();
          const modelWithReasoning = wrapLanguageModel({
            model: baseModel,
            middleware: extractReasoningMiddleware({ tagName: 'think' }),
          });

          return {
            'chat-model': modelWithReasoning,
            'chat-model-reasoning': modelWithReasoning,
            'title-model': baseModel,
            'artifact-model': baseModel,
          };
        })(),
      },
      imageModels: {
        'small-model': createVisionModel(),
      },
    });
