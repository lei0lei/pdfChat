import React, { useState } from 'react';
import { Transition } from '@headlessui/react';

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  console.log(isLoading)
  const handleResponse = (strResponse) => {
    setState((prev) => {
      const messages = prev.messages;
      let updatedMessages = [];
      
      if (strResponse === '') {
        console.log('xxxxxxloading')
        const loadMessage = createChatBotMessage(<React.Fragment><div className='chatbot-loader-container'>
        <svg
          id='dots'
          width='50px'
          height='21px'
          viewBox='0 0 132 58'
          version='1.1'
          xmlns='http://www.w3.org/2000/svg'
        >
          <g stroke='none' fill='none'>
            <g id='chatbot-loader' fill='#fff'>
              <circle id='chatbot-loader-dot1' cx='25' cy='30' r='13'></circle>
              <circle id='chatbot-loader-dot2' cx='65' cy='30' r='13'></circle>
              <circle id='chatbot-loader-dot3' cx='105' cy='30' r='13'></circle>
            </g>
          </g>
        </svg>
      </div></React.Fragment>);
        updatedMessages = messages.concat(loadMessage); // 直接添加load消息
      } else {
        console.log('new message')
        updatedMessages = messages.slice(0, -1); // 删除前一条消息
        const botMessage = createChatBotMessage(strResponse);
        updatedMessages = updatedMessages.concat(botMessage); // 添加新的消息
      }
  
      return {
        ...prev,
        messages: updatedMessages,
      };
    });
  };

  // const handleResponse = (strResponse) => {
  //   console.log('ssssssss')
  //   // setIsLoading(true); // 取消加载中状态

  //   const botMessage = createChatBotMessage(strResponse);
  //   setState((prev) => ({
  //     ...prev,
  //     messages: prev.messages.slice(0, -1).concat(botMessage),
  //   }));
  //   // const botMessage = createChatBotMessage('');
  //   setState((prev) => ({
  //     ...prev,
  //     messages: [...prev.messages, botMessage],
  //   }));
  // };


  return (
    <div>
      {/* {isLoading && (
      <div className="flex items-center justify-center bg-blue-300 text-white">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2"></div>
          <span className="ml-2">回复中...</span>
        </div>
      )} */}
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: { handleResponse, setIsLoading },
        });
      })}
    </div>
  );
};

export default ActionProvider;