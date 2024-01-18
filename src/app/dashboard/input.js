import React, { useState } from 'react';

const CustomMessageInput = () => {
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // 在这里处理提交消息的逻辑
    console.log('Submitted message:', message);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={message}
        onChange={handleChange}
        placeholder="输入消息..."
      />
      <button type="submit">发送</button>
    </form>
  );
};

export default CustomMessageInput;