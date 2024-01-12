import React, { useState } from 'react';
import { Transition } from '@headlessui/react';

const ActionProvider = ({ createChatBotMessage, setState, children }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  console.log(isLoading)
  const handleResponse = (strResponse) => {
    console.log('ssssssss')
    // setIsLoading(true); // 取消加载中状态
    const botMessage = createChatBotMessage(strResponse);

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };


  return (
    <div>
      {isLoading && (
      <div className="flex items-center justify-center bg-blue-300 text-white">
          <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2"></div>
          <span className="ml-2">回复中...</span>
        </div>
      )}
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          actions: { handleResponse, setIsLoading },
        });
      })}
    </div>
  );
};

export default ActionProvider;