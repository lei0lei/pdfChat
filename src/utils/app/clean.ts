import { Conversation } from '../../types/chat';
import { OpenAIModelID, OpenAIModels } from '../../types/openai';
import { DEFAULT_SYSTEM_PROMPT } from './const';

export const cleanSelectedConversation = (conversation: Conversation) => {
  // added model for each conversation (3/20/23)
  // added system prompt for each conversation (3/21/23)
  // added folders (3/23/23)
  // added prompts (3/26/23)

  let updatedConversation = conversation;

  // check for model on each conversation
  // @ts-ignore
  if (!updatedConversation.model) {
    updatedConversation = {
      ...updatedConversation,
      // @ts-ignore
      model: updatedConversation.model || OpenAIModels[OpenAIModelID.GPT_3_5],
    };
  }

  // check for system prompt on each conversation
  // @ts-ignore
  if (!updatedConversation.prompt) {
    updatedConversation = {
      ...updatedConversation,
      // @ts-ignore
      prompt: updatedConversation.prompt || DEFAULT_SYSTEM_PROMPT,
    };
  }
// @ts-ignore
  if (!updatedConversation.folderId) {
    updatedConversation = {
      ...updatedConversation,
      // @ts-ignore
      folderId: updatedConversation.folderId || null,
    };
  }

  return updatedConversation;
};

export const cleanConversationHistory = (history: any[]): Conversation[] => {
  // added model for each conversation (3/20/23)
  // added system prompt for each conversation (3/21/23)
  // added folders (3/23/23)
  // added prompts (3/26/23)

  if (!Array.isArray(history)) {
    console.warn('history is not an array. Returning an empty array.');
    return [];
  }

  return history.reduce((acc: any[], conversation) => {
    try {
      if (!conversation.model) {
        conversation.model = OpenAIModels[OpenAIModelID.GPT_3_5];
      }

      if (!conversation.prompt) {
        conversation.prompt = DEFAULT_SYSTEM_PROMPT;
      }

      if (!conversation.folderId) {
        conversation.folderId = null;
      }

      acc.push(conversation);
      return acc;
    } catch (error) {
      console.warn(
        `error while cleaning conversations' history. Removing culprit`,
        error,
      );
    }
    return acc;
  }, []);
};
