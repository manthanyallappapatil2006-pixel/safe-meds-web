
/**
 * aiService.js — Aarogya AI service.
 *
 * Sends chat messages and Safe Meds reference knowledge
 * to the backend AI endpoint.
 *
 * Private AI provider keys must remain on the backend.
 */

import { apiClient } from './api';
import { aarogyaKnowledge } from '../data/aarogyaKnowledge';

export const aiService = {
  /**
   * Checks whether a backend URL has been configured.
   * This does not confirm that the server is reachable.
   */
  isConfigured() {
    return Boolean(import.meta.env.VITE_API_BASE_URL);
  },

  /**
   * Sends a message to the backend AI service.
   *
   * Expected endpoint: POST /ai/chat
   *
   * Request:
   * {
   *   message,
   *   history,
   *   language,
   *   knowledgeBase
   * }
   *
   * Expected response:
   * {
   *   reply: string,
   *   disclaimer: string
   * }
   */
  async sendMessage(message, history = [], language = 'en') {
    if (!this.isConfigured()) {
      return {
        data: null,
        error: {
          code: 'BACKEND_NOT_CONFIGURED',
          message: 'Aarogya AI backend URL is not configured.',
        },
      };
    }

    const safeHistory = history
      .filter(
        (item) =>
          ['user', 'assistant'].includes(item.role) &&
          typeof item.content === 'string'
      )
      .slice(-6)
      .map((item) => ({
        role: item.role,
        content: item.content,
      }));

    return apiClient.post('/ai/chat', {
      message,
      history: safeHistory,
      language,
      knowledgeBase: aarogyaKnowledge,
    });
  },
};

export default aiService;
