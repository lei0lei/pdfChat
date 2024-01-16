import { createChatBotMessage } from 'react-chatbot-kit';

const config = {
  initialMessages: [createChatBotMessage(`请输入问题`)],
  customComponents: {
    header: () => <div style={{ height: "40px",backgroundColor: '#2898ec', padding: "5px", borderRadius: "3px" }}>Conversation Chatbot</div>
  },
  // inputField: {
  //   // 修改输入框的样式
  //   width: '300px',
  //   height: '900px'
  // }
};

export default config;