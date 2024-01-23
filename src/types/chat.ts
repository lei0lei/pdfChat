import { OpenAIModel } from './openai';

export interface Message {
  role: Role;
  content: string;
}

export type Role = 'assistant' | 'user';

export interface ChatBody {
  messages: Message[];
}

export interface Conversation {
  id: string;
  name: string;
  messages: Message[];
}

export interface FileObj {
  id: string;
  name: string;
  hash: string;
  title: string;
}