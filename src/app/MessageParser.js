import { ConversationalRetrievalQAChain } from "langchain/chains";
import React, { useContext } from 'react';
import { BufferMemory } from "langchain/memory";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PdfContext } from './context.js';

// move to server
// let model = null

// let streamedResponse = "";
// try{
          
//   // model = new ChatOpenAI({ modelName: "gpt-3.5-turbo" ,openAIApiKey:process.env.REACT_APP_openAIApiKey});
//   model = new ChatOpenAI({ modelName: "gpt-3.5-turbo" ,callbacks: [{
//     handleLLMNewToken(token) {
//         streamedResponse += token;
        
//     },}],streaming: true,openAIApiKey:process.env.REACT_APP_openAIApiKey});
  
// } catch(err) {
// //   alert('Api key not available');
//   let openAIApiKey = prompt('No api key found, insert here')
//   model = new ChatOpenAI({ modelName: "gpt-3.5-turbo" ,openAIApiKey:openAIApiKey});
// }
// // const model = new ChatOpenAI({ modelName: "gpt-3.5-turbo" ,openAIApiKey:process.env.REACT_APP_openAIApiKey});
// const memory = new BufferMemory({
//   memoryKey: "chat_history",
//   returnMessages: true,
// });

const MessageParser = ({ children, actions }) => {
  const context = useContext(PdfContext);
  const { 
    seq_id,conversationID,sessionID,
    updateSeq_id,
    socket,
     } = useContext(PdfContext);
  const parse = async (message) => {
    socket.emit('onConversation',{message:message,
                                  seq_id:seq_id,
                                  conversationID:conversationID,
                                  sessionID:sessionID})
    socket.on('answer',(data) => {
      // console.log(data.result.text,data.refFilename,data.refPage,data.refText);
      console.log(data.result)
      console.log(data.ref)
      actions.handleResponse(data.result.text);
      actions.handleResponse('filename: '+data.ref[0].refFilename+'\r\n'+'pagenum: '+data.ref[0].refPage);
      socket.off('answer');
      updateSeq_id(seq_id+1)})}
    

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions: {},
        });
      })}
    </div>
  );
};

export default MessageParser;