import config from './ChatbotConfig.js';
import MessageParser from './MessageParser.js';
import ActionProvider from './ActionProvider.js';
import Chatbot from 'react-chatbot-kit'

import './Chatbot.css'
import React, { useContext } from 'react';
import { PdfContext } from './context.js'; // 你需要导入你的 Context 对象

export const MyChatbot = () => {
  // const context = useContext(PdfContext);
  


  // GPT调用逻辑
  return (
    <>

    <div>
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
        placeholderText='在此输入问题'
      />
    </div>
    </>
  );
};

