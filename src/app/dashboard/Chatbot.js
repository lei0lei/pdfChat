import config from './ChatbotConfig.js';
import MessageParser from './MessageParser.js';
import ActionProvider from './ActionProvider.js';
import Chatbot from 'react-chatbot-kit'
import CustomMessageInput from './input.js';



import './Chatbot.css'
import React, { useContext } from 'react';
import { PdfContext } from './context.js'; // 你需要导入你的 Context 对象

export const MyChatbot = () => {
  const validator = (input) => {
    if (!input.replace(/\s/g, '').length) //check if only composed of spaces
      return false;
    if (input.length > 0) //check if the message is empty
      return true;
    return false
  }
  const CustomHeader = () => (
    <div className="bg-blue-100 py-2 px-4 text-white">
      Chatbot Title
      <span className="ml-2">Loading...</span>
    </div>
  );
  // GPT调用逻辑
  return (
    <>

    <div>
      <Chatbot
        config={config}
        validator={validator}
        headerComponent={CustomHeader}
        messageInput={<CustomMessageInput />}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
        placeholderText='在此输入问题'
      />
      
    </div>
    </>
  );
};

